import React, { useState } from 'react';
import { Share2, Copy, Check, X, Smartphone, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // ดึง URL ปัจจุบัน
  const currentUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                วิธีส่งลิงก์ให้พนักงานใช้งาน
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                ส่งเข้า LINE หรือกลุ่มแชท ใช้งานได้ทันทีไม่ต้องติดตั้ง
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* URL Box with Big Copy Button */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              ลิงก์สำหรับส่งให้พนักงาน:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-300 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 transition flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
              </button>
            </div>
          </div>

          {/* Easy Steps Guide */}
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-500" />
              <span>ขั้นตอนง่ายๆ ในการนำไปใช้งานจริง:</span>
            </div>

            <ol className="space-y-2 text-slate-600 dark:text-slate-300 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>กดคัดลอกลิงก์ข้างบน</strong> แล้วนำไปวางส่งในห้องแชท LINE แผนก หรือกลุ่มบริษัท
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>พนักงานเปิดผ่านมือถือ/คอมฯ</strong> จะเห็นหน้า "แจ้งปัญหา" ทันที กรอกเพียงเลขสัญญาและกดส่งได้เลย <em>(ไม่ต้องใส่รหัสผ่านใดๆ)</em>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>พี่เกมเข้าดูคิวงาน</strong> โดยกดแท็บ "คิวงาน (พี่เกม)" แล้วใส่รหัส <code>232324</code> เพื่อกด "ปิด Proxy แล้ว" ตอบกลับพนักงานได้แบบ 1-Tap ทันที
                </span>
              </li>
            </ol>
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-[11px]">
              พนักงานจะเห็นเฉพาะหน้าแจ้งและเช็คสถานะ ส่วนหน้าคิวงานจะล็อคไว้ให้เฉพาะพี่เกมเท่านั้น
            </span>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
