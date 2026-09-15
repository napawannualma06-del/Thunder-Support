export type IssueStatus = 'pending' | 'in_progress' | 'waiting_info' | 'resolved' | 'closed';

export type IssueUrgency = 'normal' | 'urgent';

export interface StatusHistoryItem {
  status: IssueStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface IssueTicket {
  id: string;              // e.g. "TK-001"
  contractNo: string;      // e.g. "9042" or "CT-2024-8891"
  customerName: string;    // ชื่อพนักงาน/ผู้แจ้ง
  phone?: string;          // เบอร์โทรหรือ LINE
  requestType: string;     // เช่น "ปิด Proxy", "เปิดใช้งาน", "อื่นๆ"
  description: string;     // ปัญหา / ข้อความเพิ่มเติม
  attachmentUrl?: string;  // รูปภาพหน้าจอ (ถ้ามี)
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  technicianNote?: string; // ข้อความตอบกลับจากเทคนิค
  technicianName?: string; // ผู้ทำรายการ
  statusHistory: StatusHistoryItem[];
}

export interface IntegrationSettings {
  gasWebAppUrl: string;
  lineNotifyToken: string;
  enableLineNotify: boolean;
  sheetName: string;
  useGoogleSheetsSync: boolean;
}

export const QUICK_REQUEST_TYPES = [
  'ปิดพร็อกซี่',
  'เปิด Find My Phone',
  'กรอกเลข SN ผิด',
  'ปิด Proxy ให้หน่อยครับ',
  'เปิด Proxy',
  'ปลดล็อค / รีเซ็ตสิทธิ์',
  'แจ้งปัญหาอื่นๆ'
];

export const QUICK_REPLY_TEMPLATES = [
  'ปิด Proxy ให้เรียบร้อยแล้วครับ ทดสอบใช้งานได้เลย',
  'เปิด Find My Phone ในระบบให้เรียบร้อยแล้วครับ ลูกค้าเข้าจัดการได้เลย',
  'แก้ไขเลข Serial Number ในระบบให้ถูกต้องเรียบร้อยแล้วครับ',
  'กำลังเข้าไปทำให้ครับ รอสักครู่นะครับ',
  'ดำเนินการให้เรียบร้อยแล้วครับ ใช้งานได้เลย',
  'ขอข้อมูลเพิ่มเติม: รบกวนส่งรูปหน้าจอ Error หรือเลข IP เครื่องให้หน่อยครับ',
  'ขอข้อมูลเพิ่มเติม: เครื่องเปิดอยู่ไหมครับ ลองรีสตาร์ตอีกครั้ง',
];

export const STATUS_CONFIG: Record<IssueStatus, { label: string; step: number; color: string; bgBadge: string; iconName: string; description: string }> = {
  pending: {
    label: 'รอดำเนินการ',
    step: 1,
    color: 'text-amber-600',
    bgBadge: 'bg-amber-100 text-amber-900 border-amber-300',
    iconName: 'Clock',
    description: 'ฝ่ายเทคนิค (พี่เกม) ได้รับเรื่องแล้ว อยู่ในคิวรอทำ'
  },
  in_progress: {
    label: 'กำลังทำให้',
    step: 2,
    color: 'text-blue-600',
    bgBadge: 'bg-blue-100 text-blue-900 border-blue-300',
    iconName: 'Wrench',
    description: 'ฝ่ายเทคนิค (พี่เกม) กำลังเข้าไปตรวจสอบและทำให้'
  },
  waiting_info: {
    label: 'ขอข้อมูลเพิ่ม',
    step: 3,
    color: 'text-orange-600',
    bgBadge: 'bg-orange-100 text-orange-900 border-orange-300',
    iconName: 'HelpCircle',
    description: 'ฝ่ายเทคนิค (พี่เกม) ต้องการข้อมูลเพิ่มเติมจากผู้แจ้ง'
  },
  resolved: {
    label: 'เสร็จแล้ว / ได้แล้ว',
    step: 4,
    color: 'text-emerald-600',
    bgBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    iconName: 'CheckCircle2',
    description: 'ทำให้เรียบร้อยแล้ว สามารถใช้งานได้ทันที'
  },
  closed: {
    label: 'ปิดเคส',
    step: 5,
    color: 'text-slate-600',
    bgBadge: 'bg-slate-100 text-slate-800 border-slate-300',
    iconName: 'Archive',
    description: 'รายการสมบูรณ์'
  }
};
