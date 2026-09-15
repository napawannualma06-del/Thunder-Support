/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerReportForm } from './components/CustomerReportForm';
import { CustomerTrackingView } from './components/CustomerTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { IntegrationModal } from './components/IntegrationModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ShareLinkModal } from './components/ShareLinkModal';
import { StorageService } from './services/storageService';
import { IssueTicket, IntegrationSettings } from './types';
import { FileSpreadsheet, BellRing, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'report' | 'track' | 'admin'>('report');
  const [tickets, setTickets] = useState<IssueTicket[]>([]);
  const [settings, setSettings] = useState<IntegrationSettings>(StorageService.getSettings());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // จัดการธีมมืด/สว่าง
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
      localStorage.setItem('app_theme', theme);
    } catch (e) {
      console.error('Failed to set theme:', e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('game_pass_auth') === 'true';
  });
  const [trackingQuery, setTrackingQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState<'google_sheets' | 'local'>('local');

  // โหลดข้อมูลเริ่มต้น
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const result = await StorageService.getTickets();
      setTickets(result.tickets);
      setDataSource(result.source);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // การเปลี่ยนแท็บ พร้อมระบบป้องกันรหัสผ่านสำหรับหน้าคิวงาน
  const handleSelectTab = (tab: 'report' | 'track' | 'admin') => {
    if (tab === 'admin') {
      if (!isAdminAuthenticated) {
        setIsAuthModalOpen(true);
        return;
      }
    }
    setActiveTab(tab);
    if (tab !== 'track') {
      setTrackingQuery('');
    }
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('game_pass_auth', 'true');
    setIsAuthModalOpen(false);
    setActiveTab('admin');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('game_pass_auth');
    setActiveTab('report');
  };

  // สร้างเคสใหม่
  const handleCreateTicket = async (
    ticketData: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>
  ): Promise<IssueTicket> => {
    const created = await StorageService.createTicket(ticketData);
    setTickets((prev) => [created, ...prev]);
    return created;
  };

  // ดูสถานะเคสโดยตรงจากหน้าสร้างเสร็จ
  const handleViewTicket = (ticketId: string) => {
    setTrackingQuery(ticketId);
    setActiveTab('track');
  };

  // อัปเดตเคส (จากแอดมิน)
  const handleUpdateTicket = async (
    ticketId: string,
    updates: Partial<IssueTicket>,
    adminName: string,
    notifyLine: boolean
  ): Promise<IssueTicket | null> => {
    const updated = await StorageService.updateTicket(ticketId, updates, adminName, notifyLine);
    if (updated) {
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
    }
    return updated;
  };

  // ลบเคส
  const handleDeleteTicket = (ticketId: string) => {
    const success = StorageService.deleteTicket(ticketId);
    if (success) {
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    }
  };

  // ลบทุกรายการทั้งหมด (เคลียร์ข้อมูล)
  const handleClearAllTickets = () => {
    StorageService.clearAllTickets();
    setTickets([]);
  };

  // ส่งออก CSV
  const handleExportCSV = () => {
    StorageService.exportToCSV(tickets);
  };

  // บันทึกการตั้งค่า Google Sheets & LINE
  const handleSaveSettings = (newSettings: IntegrationSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
    // รีเฟรชข้อมูลตามการตั้งค่าใหม่
    loadData();
  };

  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navigation & Mobile Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        openSettings={() => setIsSettingsOpen(true)}
        settings={settings}
        pendingCount={pendingCount}
        inProgressCount={inProgressCount}
        isAdminAuthenticated={isAdminAuthenticated}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'report' && (
          <CustomerReportForm
            onSubmit={handleCreateTicket}
            onViewTicket={handleViewTicket}
            isGasConnected={Boolean(settings.gasWebAppUrl)}
          />
        )}

        {activeTab === 'track' && (
          <CustomerTrackingView
            tickets={tickets}
            initialSearchQuery={trackingQuery}
            onRefresh={loadData}
            isRefreshing={isRefreshing}
          />
        )}

        {activeTab === 'admin' && isAdminAuthenticated && (
          <AdminDashboard
            tickets={tickets}
            settings={settings}
            onUpdateTicket={handleUpdateTicket}
            onDeleteTicket={handleDeleteTicket}
            onClearAll={handleClearAllTickets}
            onExportCSV={handleExportCSV}
            onRefresh={loadData}
            isRefreshing={isRefreshing}
            openSettings={() => setIsSettingsOpen(true)}
            onLogout={handleLogoutAdmin}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Thunder Support (ฝ่ายเทคนิค พี่เกม)</span>
            <span>•</span>
            <span>ขับเคลื่อนด้วย Google Sheets & Google Apps Script</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <span className={`w-2 h-2 rounded-full ${dataSource === 'google_sheets' ? 'bg-emerald-500' : 'bg-blue-400'}`} />
              {dataSource === 'google_sheets' ? 'ซิงค์กับ Google Sheets เรียลไทม์' : 'โหมดบันทึก Local & Instant Sync'}
            </span>
            {isAdminAuthenticated && (
              <>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  คู่มือตั้งค่า
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Share Link for Employees Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Integration Setup Modal */}
      <IntegrationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Admin Password Gate Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
