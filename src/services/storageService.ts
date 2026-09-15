import { IssueTicket, IntegrationSettings } from '../types';
import { INITIAL_SAMPLE_TICKETS } from './sampleData';

const STORAGE_KEY_TICKETS = 'contract_issue_tickets_simple_v2';
const STORAGE_KEY_SETTINGS = 'contract_issue_settings_simple_v2';

export const DEFAULT_SETTINGS: IntegrationSettings = {
  gasWebAppUrl: import.meta.env.VITE_GAS_URL || '',
  lineNotifyToken: import.meta.env.VITE_LINE_TOKEN || '',
  enableLineNotify: true,
  sheetName: 'Tickets',
  useGoogleSheetsSync: true,
};

export class StorageService {
  static getSettings(): IntegrationSettings {
    let settings = { ...DEFAULT_SETTINGS };
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        settings = { ...settings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    
    // บังคับใช้ค่าจาก .env เสมอถ้ามีการตั้งค่าไว้ เพื่อให้พนักงานทุกคนได้ตั้งค่าเดียวกัน
    if (import.meta.env.VITE_GAS_URL) {
      settings.gasWebAppUrl = import.meta.env.VITE_GAS_URL;
      settings.useGoogleSheetsSync = true;
    }
    if (import.meta.env.VITE_LINE_TOKEN) {
      settings.lineNotifyToken = import.meta.env.VITE_LINE_TOKEN;
    }
    
    return settings;
  }

  static saveSettings(settings: IntegrationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  static async getTickets(): Promise<{ tickets: IssueTicket[]; source: 'google_sheets' | 'local' }> {
    const settings = this.getSettings();

    if (settings.useGoogleSheetsSync && settings.gasWebAppUrl) {
      try {
        const response = await fetch(`${settings.gasWebAppUrl}?action=getTickets`, {
          method: 'GET',
          mode: 'cors',
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.tickets)) {
            this.saveLocalTickets(result.tickets);
            return { tickets: result.tickets, source: 'google_sheets' };
          }
        }
      } catch (err) {
        console.warn('Google Apps Script fetch error, using local:', err);
      }
    }

    const local = this.getLocalTickets();
    return { tickets: local, source: 'local' };
  }

  static getLocalTickets(): IssueTicket[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TICKETS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse local tickets:', e);
    }
    this.saveLocalTickets([]);
    return [];
  }

  static clearAllTickets(): void {
    this.saveLocalTickets([]);
  }

  static saveLocalTickets(tickets: IssueTicket[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
    } catch (e) {
      console.error('Failed to save local tickets:', e);
    }
  }

  static async createTicket(
    ticket: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): Promise<IssueTicket> {
    const settings = this.getSettings();
    const existing = this.getLocalTickets();
    const now = new Date().toISOString();

    const count = existing.length + 105;
    const newId = `TK-${count}`;

    const newTicket: IssueTicket = {
      ...ticket,
      id: newId,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: ticket.status || 'pending',
          timestamp: now,
          note: `ส่งคำขอ: ${ticket.requestType}`,
          updatedBy: ticket.customerName || 'ผู้แจ้ง',
        },
      ],
    };

    const updatedTickets = [newTicket, ...existing];
    this.saveLocalTickets(updatedTickets);

    // Sync to Google Apps Script
    if (settings.gasWebAppUrl) {
      try {
        const formData = new URLSearchParams();
        formData.append('action', 'addTicket');
        formData.append('ticket', JSON.stringify(newTicket));
        formData.append('lineNotifyToken', settings.lineNotifyToken);

        await fetch(settings.gasWebAppUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
      } catch (err) {
        console.error('Error syncing to GAS:', err);
      }
    }

    return newTicket;
  }

  static async updateTicket(
    ticketId: string,
    updates: Partial<IssueTicket>,
    adminName: string = 'ฝ่ายเทคนิค (พี่เกม)',
    notifyLine: boolean = true
  ): Promise<IssueTicket | null> {
    const settings = this.getSettings();
    const tickets = this.getLocalTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);

    if (index === -1) return null;

    const now = new Date().toISOString();
    const oldTicket = tickets[index];

    const statusHistory = [...(oldTicket.statusHistory || [])];
    if (updates.status && updates.status !== oldTicket.status) {
      statusHistory.push({
        status: updates.status,
        timestamp: now,
        note: updates.technicianNote || `เปลี่ยนสถานะเป็น ${updates.status}`,
        updatedBy: adminName,
      });
    }

    const updatedTicket: IssueTicket = {
      ...oldTicket,
      ...updates,
      updatedAt: now,
      statusHistory,
    };

    tickets[index] = updatedTicket;
    this.saveLocalTickets(tickets);

    // Sync to GAS
    if (settings.gasWebAppUrl) {
      try {
        const formData = new URLSearchParams();
        formData.append('action', 'updateTicket');
        formData.append('ticketId', ticketId);
        formData.append('updatedData', JSON.stringify(updates));
        formData.append('notifyLine', (notifyLine && settings.enableLineNotify).toString());
        formData.append('lineNotifyToken', settings.lineNotifyToken);

        await fetch(settings.gasWebAppUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
      } catch (err) {
        console.error('Error updating to GAS:', err);
      }
    }

    return updatedTicket;
  }

  static deleteTicket(ticketId: string): boolean {
    const tickets = this.getLocalTickets();
    const filtered = tickets.filter((t) => t.id !== ticketId);
    if (filtered.length !== tickets.length) {
      this.saveLocalTickets(filtered);
      return true;
    }
    return false;
  }

  static exportToCSV(tickets: IssueTicket[]): void {
    const headers = [
      'รหัสเคส',
      'เลขที่สัญญา',
      'รายการที่แจ้ง',
      'ชื่อพนักงาน/ผู้แจ้ง',
      'เบอร์โทร/ติดต่อ',
      'รายละเอียด',
      'สถานะ',
      'ข้อความตอบกลับจากช่าง',
      'วันที่แจ้ง',
      'วันที่อัปเดต'
    ];

    const rows = tickets.map((t) => [
      `"${t.id}"`,
      `"${t.contractNo}"`,
      `"${t.requestType}"`,
      `"${t.customerName}"`,
      `"${t.phone || '-'}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${(t.technicianNote || '').replace(/"/g, '""')}"`,
      `"${new Date(t.createdAt).toLocaleString('th-TH')}"`,
      `"${new Date(t.updatedAt).toLocaleString('th-TH')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `proxy_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
