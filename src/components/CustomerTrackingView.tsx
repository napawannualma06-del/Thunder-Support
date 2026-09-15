import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  RefreshCw, 
  Wrench,
  ChevronRight
} from 'lucide-react';
import { IssueTicket, STATUS_CONFIG, IssueStatus } from '../types';

interface CustomerTrackingViewProps {
  tickets: IssueTicket[];
  initialSearchQuery?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const CustomerTrackingView: React.FC<CustomerTrackingViewProps> = ({
  tickets,
  initialSearchQuery = '',
  onRefresh,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchingTickets = tickets.filter((t) => {
    if (!cleanQuery) return true;
    return (
      t.contractNo.toLowerCase().includes(cleanQuery) ||
      t.id.toLowerCase().includes(cleanQuery) ||
      t.customerName.toLowerCase().includes(cleanQuery) ||
      t.requestType.toLowerCase().includes(cleanQuery)
    );
  });

  return (
    <div className="max-w-md sm:max-w-lg mx-auto py-4 sm:py-6 px-4 pb-24 md:pb-8 space-y-4">
      
      {/* Search Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 space-y-3 transition-colors">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            เช็คสถานะการแจ้งปัญหา
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            พิมพ์เลขที่สัญญาเพื่อดูว่าฝ่ายเทคนิค (พี่เกม) ทำให้แล้วหรือยัง
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="พิมพ์เลขสัญญาเพื่อค้นหา"
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-base sm:text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                ล้าง
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center transition"
            title="รีเฟรช"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {matchingTickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 text-center">
            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">ไม่พบข้อมูลสัญญา {searchQuery}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              กรุณาตรวจสอบเลขที่สัญญา หรือแจ้งงานใหม่ได้ที่แท็บ "แจ้งปัญหา"
            </div>
          </div>
        ) : (
          matchingTickets.map((ticket) => {
            const statusInfo = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
            const isResolved = ticket.status === 'resolved';
            const isWaiting = ticket.status === 'waiting_info';

            return (
              <div
                key={ticket.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 transition space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">สัญญา:</span>
                    <span className="font-mono text-lg font-black text-indigo-700 dark:text-indigo-400">
                      {ticket.contractNo}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${statusInfo.bgBadge}`}>
                    {isResolved && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isWaiting && <HelpCircle className="w-3.5 h-3.5" />}
                    {ticket.status === 'in_progress' && <Wrench className="w-3.5 h-3.5" />}
                    {ticket.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Additional Info */}
                {(ticket.topic || ticket.mdmProvider || ticket.deviceModel || ticket.realCustomerName) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ticket.topic && (
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${ticket.topic === 'แจ้งเรื่อง MDM' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300'}`}>
                        {ticket.topic}
                      </span>
                    )}
                    {ticket.realCustomerName && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium">
                        ลูกค้า: {ticket.realCustomerName}
                      </span>
                    )}
                    {ticket.mdmProvider && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium">
                        MDM: {ticket.mdmProvider}
                      </span>
                    )}
                    {ticket.deviceModel && (
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-medium">
                        รุ่น: {ticket.deviceModel}
                      </span>
                    )}
                  </div>
                )}

                {/* Request title */}
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {ticket.requestType}
                  </div>
                  {ticket.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      "{ticket.description}"
                    </div>
                  )}
                </div>

                {/* Technician Reply Box (The key part user wants to see!) */}
                {ticket.technicianNote ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>ฝ่ายเทคนิค (พี่เกม) แจ้งว่า:</span>
                    </div>
                    <div className="text-xs font-medium leading-relaxed">
                      {ticket.technicianNote}
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                      โดย: {ticket.technicianName || 'ฝ่ายเทคนิค (พี่เกม)'} • เมื่อ {new Date(ticket.updatedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>อยู่ในคิวรอฝ่ายเทคนิค (พี่เกม) ดำเนินการ เมื่อทำแล้วจะแจ้งอัปเดตที่นี่ครับ</span>
                  </div>
                )}

                {/* Footer details */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
                  <span>ผู้แจ้ง: {ticket.customerName}</span>
                  <span>{new Date(ticket.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
