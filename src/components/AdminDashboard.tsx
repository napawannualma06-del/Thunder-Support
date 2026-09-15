import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Download, 
  RefreshCw, 
  Trash2, 
  MessageSquare, 
  Bell, 
  HelpCircle,
  X,
  FileSpreadsheet,
  Check,
  UserCheck,
  Lock,
  Settings
} from 'lucide-react';
import { 
  IssueTicket, 
  IssueStatus, 
  STATUS_CONFIG, 
  QUICK_REPLY_TEMPLATES,
  IntegrationSettings
} from '../types';

interface AdminDashboardProps {
  tickets: IssueTicket[];
  settings: IntegrationSettings;
  onUpdateTicket: (ticketId: string, updates: Partial<IssueTicket>, adminName: string, notifyLine: boolean) => Promise<IssueTicket | null>;
  onDeleteTicket: (ticketId: string) => void;
  onClearAll?: () => void;
  onExportCSV: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  openSettings: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  settings,
  onUpdateTicket,
  onDeleteTicket,
  onClearAll,
  onExportCSV,
  onRefresh,
  isRefreshing,
  openSettings,
  onLogout,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | IssueStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quick Update Drawer / Modal state
  const [selectedTicket, setSelectedTicket] = useState<IssueTicket | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus>('resolved');
  const [technicianNote, setTechnicianNote] = useState('');
  const [technicianName, setTechnicianName] = useState(() => localStorage.getItem('last_tech_name') || 'ฝ่ายเทคนิค (พี่เกม)');
  const [notifyLine, setNotifyLine] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [quickSuccessMsg, setQuickSuccessMsg] = useState('');

  // Counts
  const pendingTickets = tickets.filter((t) => t.status === 'pending');
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress');
  const waitingInfoTickets = tickets.filter((t) => t.status === 'waiting_info');
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved');

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchFilter = activeFilter === 'all' || t.status === activeFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery = !q || (
      t.contractNo.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.requestType.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
    return matchFilter && matchQuery;
  });

  // 1-Tap Quick Action directly from card
  const handleQuickStatus = async (
    ticket: IssueTicket, 
    newStatus: IssueStatus, 
    defaultNote: string
  ) => {
    try {
      setIsUpdating(true);
      await onUpdateTicket(
        ticket.id,
        {
          status: newStatus,
          technicianNote: defaultNote,
          technicianName,
        },
        technicianName,
        notifyLine
      );
      setQuickSuccessMsg(`อัปเดตสัญญา ${ticket.contractNo}: ${STATUS_CONFIG[newStatus].label} เรียบร้อยแล้ว`);
      setTimeout(() => setQuickSuccessMsg(''), 3000);
    } catch (e: any) {
      alert('เกิดข้อผิดพลาด: ' + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenEdit = (ticket: IssueTicket) => {
    setSelectedTicket(ticket);
    setSelectedStatus(ticket.status === 'pending' ? 'resolved' : ticket.status);
    setTechnicianNote(ticket.technicianNote || (ticket.status === 'pending' ? 'ปิด Proxy ให้เรียบร้อยแล้วครับ ทดสอบใช้งานได้เลย' : ''));
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    try {
      setIsUpdating(true);
      localStorage.setItem('last_tech_name', technicianName);
      await onUpdateTicket(
        selectedTicket.id,
        {
          status: selectedStatus,
          technicianNote: technicianNote.trim(),
          technicianName: technicianName.trim(),
        },
        technicianName,
        notifyLine
      );
      setSelectedTicket(null);
    } catch (e: any) {
      alert('บันทึกไม่สำเร็จ: ' + e.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (ticket: IssueTicket) => {
    if (confirm(`ต้องการลบรายการของสัญญา ${ticket.contractNo} หรือไม่?`)) {
      onDeleteTicket(ticket.id);
      if (selectedTicket?.id === ticket.id) setSelectedTicket(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4 pb-24 md:pb-8 space-y-4">
      
      {/* Header & Quick Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-800/90 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>คิวงานฝ่ายเทคนิค (พี่เกม)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            จัดการเคสแจ้งปัญหา ปิด Proxy และแจ้งเตือนผลกลับพนักงานแบบเรียลไทม์
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
            <span>รีเฟรช</span>
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>โหลด Excel</span>
          </button>

          <button
            type="button"
            onClick={openSettings}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
            title="ตั้งค่าเชื่อมต่อ Google Sheets & LINE Notify"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>ตั้งค่าชีท & LINE</span>
          </button>

          {onClearAll && tickets.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('คุณต้องการลบรายการแจ้งงานทั้งหมดหรือไม่? (รายการจะถูกลบเกลี้ยง)')) {
                  onClearAll();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-slate-400 flex items-center gap-1.5 transition"
              title="ล้างรายการงานทั้งหมด"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างทั้งหมด</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-2 rounded-xl text-xs font-medium border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 transition"
              title="ล็อคหน้าจอเพื่อไม่ให้พนักงานเข้าดู"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ล็อคคิวงาน</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Success Toast */}
      {quickSuccessMsg && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-md animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{quickSuccessMsg}</span>
        </div>
      )}

      {/* Status Filter Tabs (Mobile & Tablet Friendly) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            activeFilter === 'all'
              ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          ทั้งหมด ({tickets.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('pending')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeFilter === 'pending'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
              : 'bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>รอดำเนินการ ({pendingTickets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('in_progress')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeFilter === 'in_progress'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>กำลังทำ ({inProgressTickets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('waiting_info')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeFilter === 'waiting_info'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 hover:bg-orange-50 dark:hover:bg-orange-950/40'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>ขอข้อมูลเพิ่ม ({waitingInfoTickets.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('resolved')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
            activeFilter === 'resolved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>เสร็จแล้ว ({resolvedTickets.length})</span>
        </button>
      </div>

      {/* Quick Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาเลขสัญญา หรือ ชื่อผู้แจ้ง..."
          className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-2xl text-base sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {/* Ticket Cards List (Designed specifically for Mobile & Tablet Touch UX) */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center transition-colors">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">ไม่มีคิวงานในหมวดนี้</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">ยินดีด้วย! คุณเคลียร์งานหมดเรียบร้อยแล้ว</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const statusInfo = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
            const isResolved = ticket.status === 'resolved';

            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-4 sm:p-5 transition hover:border-indigo-300 dark:hover:border-indigo-500/60"
              >
                {/* Card Top: Contract No + Status badge + Time */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">สัญญา:</span>
                    <span className="font-mono text-base font-extrabold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                      {ticket.contractNo}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {ticket.id}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${statusInfo.bgBadge}`}>
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Request Type Title */}
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {ticket.requestType}
                </div>

                {/* Description if any */}
                {ticket.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 rounded-xl p-2.5 mb-2.5 border border-slate-100 dark:border-slate-700">
                    "{ticket.description}"
                  </p>
                )}

                {/* Technician's reply if already answered */}
                {ticket.technicianNote && (
                  <div className="text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl p-2.5 mb-3 border border-emerald-200 dark:border-emerald-800 flex items-start gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-700 dark:text-emerald-400" />
                    <div>
                      <span className="font-bold">แจ้งผู้ใช้: </span>
                      <span>{ticket.technicianNote}</span>
                    </div>
                  </div>
                )}

                {/* Footer of Card: Requester info + Time */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div>
                    ผู้แจ้ง: <span className="font-semibold text-slate-800 dark:text-slate-200">{ticket.customerName}</span>
                    {ticket.phone && <span className="ml-1 text-slate-400">({ticket.phone})</span>}
                  </div>
                  <div>
                    {new Date(ticket.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                  </div>
                </div>

                {/* Quick 1-Tap Action Buttons for Technician (The magic feature!) */}
                <div className="pt-3 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  
                  <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                    {/* ปุ่ม: เสร็จแล้ว / ได้แล้ว */}
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleQuickStatus(ticket, 'resolved', 'ปิด Proxy ให้เรียบร้อยแล้วครับ ทดสอบใช้งานได้เลย')}
                      className={`flex-1 min-h-[40px] px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs ${
                        isResolved
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isResolved ? 'เสร็จแล้ว ✅' : 'กด: เสร็จแล้ว'}</span>
                    </button>

                    {/* ปุ่ม: กำลังทำ */}
                    {ticket.status !== 'resolved' && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleQuickStatus(ticket, 'in_progress', 'กำลังเข้าไปทำให้ครับ รอสักครู่นะครับ')}
                        className={`min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 border ${
                          ticket.status === 'in_progress'
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                            : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>กำลังทำ</span>
                      </button>
                    )}

                    {/* ปุ่ม: ขอข้อมูลเพิ่ม */}
                    {ticket.status !== 'resolved' && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ticket)}
                        className="min-h-[40px] px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-orange-700 dark:text-orange-400 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1"
                        title="ขอข้อมูลเพิ่มเติม"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">ขอข้อมูลเพิ่ม</span>
                      </button>
                    )}
                  </div>

                  {/* Actions: Edit / Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ticket)}
                      className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-xs font-medium"
                      title="แก้ไข / พิมพ์ข้อความตอบกลับ"
                    >
                      ตอบกลับ / พิมพ์ข้อความ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ticket)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="ลบรายการ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal / Bottom Sheet for custom reply */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 text-slate-900 dark:text-white">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/80">
              <div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  อัปเดตงาน: <span className="font-mono font-extrabold text-indigo-700 dark:text-indigo-400">สัญญา {selectedTicket.contractNo}</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {selectedTicket.requestType} ({selectedTicket.customerName})
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-4 overflow-y-auto">
              
              {/* Status Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  เปลี่ยนสถานะ:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['pending', 'in_progress', 'waiting_info', 'resolved'] as IssueStatus[]).map((st) => {
                    const isSelected = selectedStatus === st;
                    const conf = STATUS_CONFIG[st];
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStatus(st)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between min-h-[44px] ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span>{conf.label}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Template Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                  แตะข้อความตอบกลับสำเร็จรูป (ไม่ต้องพิมพ์):
                </label>
                <div className="space-y-1.5">
                  {QUICK_REPLY_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl}
                      type="button"
                      onClick={() => setTechnicianNote(tmpl)}
                      className="w-full text-left p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs hover:bg-indigo-50 dark:hover:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 transition block truncate"
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Note input */}
              <div>
                <label htmlFor="technicianNote" className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                  ข้อความแจ้งให้ผู้ใช้ทราบ:
                </label>
                <textarea
                  id="technicianNote"
                  rows={2}
                  value={technicianNote}
                  onChange={(e) => setTechnicianNote(e.target.value)}
                  placeholder="เช่น ปิด Proxy ให้แล้วครับ ทดสอบเข้าโปรแกรมดูได้เลยครับ"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Line Notify toggle */}
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-300">
                    ส่งแจ้งเตือนผ่าน LINE Notify ทันที
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyLine}
                  onChange={(e) => setNotifyLine(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 min-h-[46px]"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกและส่งแจ้งเตือน</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
