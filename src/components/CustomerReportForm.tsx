import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Zap
} from 'lucide-react';
import { IssueTicket } from '../types';

interface CustomerReportFormProps {
  onSubmit: (ticketData: Omit<IssueTicket, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Promise<IssueTicket>;
  onViewTicket: (ticketId: string) => void;
  isGasConnected: boolean;
}

export const CustomerReportForm: React.FC<CustomerReportFormProps> = ({
  onSubmit,
  onViewTicket,
  isGasConnected,
}) => {
  // ดึงชื่อผู้แจ้งที่เคยกรอกไว้ในเครื่องเพื่อไม่ต้องพิมพ์ซ้ำ
  const [contractNo, setContractNo] = useState('');
  const [requestType, setRequestType] = useState('ปิดพร็อกซี่');
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('last_user_name') || '');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<IssueTicket | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // บันทึกชื่อลง LocalStorage เพื่อความสะดวกรวดเร็วในครั้งถัดไป
  useEffect(() => {
    if (customerName) localStorage.setItem('last_user_name', customerName);
  }, [customerName]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์เกิน 5MB กรุณาเลือกไฟล์รูปภาพที่เล็กลง');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachmentUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!contractNo.trim()) {
      setErrorMessage('กรุณาระบุเลขที่สัญญา (เช่น 9042 หรือ CT-8891)');
      return;
    }
    if (!requestType.trim()) {
      setErrorMessage('กรุณาระบุสิ่งที่ต้องการให้ทำ (เช่น ปิดพร็อกซี่)');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('กรุณาระบุชื่อผู้แจ้งหรือแผนก');
      return;
    }

    const finalRequestType = requestType.trim();
    const finalDescription = description.trim() 
      ? description.trim() 
      : `สัญญา ${contractNo.trim().toUpperCase()}: ${finalRequestType}`;

    try {
      setIsSubmitting(true);
      const newTicket = await onSubmit({
        contractNo: contractNo.trim().toUpperCase(),
        requestType: finalRequestType,
        customerName: customerName.trim(),
        description: finalDescription,
        attachmentUrl: attachmentUrl || undefined,
        status: 'pending',
      });

      setCreatedTicket(newTicket);
    } catch (err: any) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContractNo('');
    setRequestType('ปิดพร็อกซี่');
    setDescription('');
    setAttachmentUrl('');
    setCreatedTicket(null);
    setErrorMessage('');
  };

  // เมื่อส่งแจ้งเสร็จสิ้น
  if (createdTicket) {
    return (
      <div className="max-w-md mx-auto py-6 px-4">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
          <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            แจ้งฝ่ายเทคนิค (พี่เกม) เรียบร้อยแล้ว
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
            ฝ่ายเทคนิค (พี่เกม) ได้รับเรื่องแล้ว และจะรีบเข้าไปดำเนินการให้ครับ
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-left mb-5 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">เลขที่สัญญา:</span>
              <span className="font-mono text-base font-bold text-indigo-700 dark:text-indigo-400">{createdTicket.contractNo}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">รายการที่แจ้ง:</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{createdTicket.requestType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">รหัสเคส:</span>
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{createdTicket.id}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => onViewTicket(createdTicket.id)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>ดูสถานะคิวงานนี้</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition"
            >
              แจ้งรายการสัญญาอื่นเพิ่ม
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-4 sm:py-6 px-4 pb-20 md:pb-8">
      
      {/* Friendly Header */}
      <div className="mb-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center justify-center gap-2">
          <Zap className="w-6 h-6 text-pink-500 fill-pink-500" />
          <span>Thunder Support</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          กรอกเลขสัญญา และสิ่งที่ต้องการให้ทำ ฝ่ายเทคนิค (พี่เกม) จะได้รับเรื่องทันที
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 sm:p-6 space-y-4 transition-colors">
        
        {/* 1. เลขที่สัญญา (เด่น ชัด กรอกง่าย) */}
        <div>
          <label htmlFor="contractNo" className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            <span>เลขที่สัญญา (Contract No.) <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="contractNo"
            type="text"
            required
            autoFocus
            value={contractNo}
            onChange={(e) => setContractNo(e.target.value)}
            placeholder="พิมพ์เลขสัญญา"
            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white font-mono text-base sm:text-lg font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal placeholder:text-sm focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition uppercase tracking-wider"
          />
        </div>

        {/* 2. สิ่งที่ต้องการให้ทำ */}
        <div>
          <label htmlFor="requestType" className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1.5">
            <span>สิ่งที่ต้องการให้ทำ <span className="text-rose-500">*</span></span>
          </label>
          <input
            id="requestType"
            type="text"
            required
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            placeholder="พิมพ์สิ่งที่ต้องการให้ทำ เช่น ปิดพร็อกซี่"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white text-base sm:text-sm font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
          />
        </div>

        {/* 3. ผู้แจ้ง */}
        <div>
          <label htmlFor="customerName" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            ชื่อผู้แจ้ง / แผนก <span className="text-rose-500">*</span>
          </label>
          <input
            id="customerName"
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="พิมพ์ชื่อผู้แจ้ง หรือชื่อแผนก"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-2xl text-base sm:text-sm text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Collapsible: ข้อมูลเพิ่มเติม / รูปแนบ (ซ่อนไว้ให้ดูไม่รก ถ้าไม่มีก็ไม่ต้องใส่) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className="w-full flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium py-1.5 hover:underline"
          >
            <span>{showMoreOptions ? '− ซ่อนรายละเอียดและรูปแนบ' : '+ เพิ่มข้อความหรือรูปถ่ายหน้าจอ (ถ้ามี)'}</span>
            {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showMoreOptions && (
            <div className="mt-2 space-y-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <label htmlFor="description" className="block text-slate-600 dark:text-slate-400 mb-1">
                  ข้อความเพิ่มเติมถึงฝ่ายเทคนิค (พี่เกม):
                </label>
                <textarea
                  id="description"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="พิมพ์รายละเอียดเพิ่มเติม (ถ้ามี)"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  รูปถ่ายหน้าจอ Error / รูปหลักฐาน:
                </label>
                {attachmentUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={attachmentUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-300 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => setAttachmentUrl('')}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-xs"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition flex items-center justify-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">แตะเพื่อเลือกรูปภาพ</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Big Touch-Friendly Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 active:scale-[0.99] text-white dark:text-slate-950 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 min-h-[48px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 dark:border-slate-950/30 border-t-white dark:border-t-slate-950 rounded-full animate-spin" />
                <span>กำลังส่งข้อมูล...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>ส่งแจ้งฝ่ายเทคนิค (พี่เกม) ทันที</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
