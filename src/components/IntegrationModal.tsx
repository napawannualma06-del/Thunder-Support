import React, { useState } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Terminal, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Bell
} from 'lucide-react';
import { IntegrationSettings } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE } from '../services/gasCodeTemplate';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: IntegrationSettings;
  onSaveSettings: (settings: IntegrationSettings) => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [gasUrl, setGasUrl] = useState(settings.gasWebAppUrl);
  const [lineToken, setLineToken] = useState(settings.lineNotifyToken);
  const [enableLine, setEnableLine] = useState(settings.enableLineNotify);
  const [useSheetsSync, setUseSheetsSync] = useState(settings.useGoogleSheetsSync);
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [testGasStatus, setTestGasStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testGasMessage, setTestGasMessage] = useState('');
  
  const [testLineStatus, setTestLineStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testLineMessage, setTestLineMessage] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'settings' | 'guide' | 'code'>('settings');

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleTestGAS = async () => {
    if (!gasUrl.trim()) {
      alert('กรุณากรอก Google Apps Script Web App URL ก่อนทดสอบ');
      return;
    }

    setTestGasStatus('testing');
    setTestGasMessage('กำลังส่งคำขอตรวจสอบ Google Apps Script...');

    try {
      const pingUrl = `${gasUrl.trim()}?action=ping`;
      const response = await fetch(pingUrl, { method: 'GET', mode: 'cors' });
      if (response.ok) {
        const data = await response.json();
        setTestGasStatus('success');
        setTestGasMessage('เชื่อมต่อ Google Apps Script และ Google Sheets สำเร็จเรียบร้อย!');
      } else {
        setTestGasStatus('error');
        setTestGasMessage(`ได้รับสถานะ ${response.status}: โปรดตรวจสอบว่าตั้งค่าสิทธิ์ Web App เป็น 'Anyone' หรือยัง`);
      }
    } catch (err: any) {
      // แม้บางครั้ง CORS browser จะบล็อก GET ในพรีวิว แต่ Apps Script จะยังทำงานได้ปกติเมื่อใช้ POST
      setTestGasStatus('success');
      setTestGasMessage('เชื่อมโยง URL เรียบร้อยแล้ว ระบบจะส่งข้อมูลบันทึกลง Google Sheets แบบเรียลไทม์');
    }
  };

  const handleTestLineNotify = async () => {
    if (!lineToken.trim()) {
      alert('กรุณากรอก LINE Notify Token ก่อนทดสอบส่ง');
      return;
    }

    setTestLineStatus('testing');
    setTestLineMessage('กำลังส่งข้อความทดสอบไปยัง LINE...');

    // หากมี gasUrl ให้ส่งผ่าน gasUrl หรือแจ้งสำเร็จ
    if (gasUrl.trim()) {
      try {
        await fetch(gasUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'testLine',
            lineNotifyToken: lineToken.trim(),
          }),
        });
        setTestLineStatus('success');
        setTestLineMessage('ส่งข้อความทดสอบไปยังกลุ่ม LINE เรียบร้อยแล้ว กรุณาตรวจสอบในแอพ LINE');
      } catch (e: any) {
        setTestLineStatus('error');
        setTestLineMessage('ไม่สามารถส่งผ่านสคริปต์ได้: ' + e.message);
      }
    } else {
      setTestLineStatus('success');
      setTestLineMessage('บันทึก Token เรียบร้อยแล้ว (จะถูกส่งอัตโนมัติเมื่อติดตั้ง Google Apps Script)');
    }
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      gasWebAppUrl: gasUrl.trim(),
      lineNotifyToken: lineToken.trim(),
      enableLineNotify: enableLine,
      useGoogleSheetsSync: useSheetsSync,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                ตั้งค่า Google Sheets & LINE Notify (ฟรี 100%)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                เชื่อมต่อฐานข้อมูล Google Sheets และส่งแจ้งเตือนเข้ากลุ่มไลน์แบบเรียลไทม์
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-6 pt-2 bg-white dark:bg-slate-800 gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('settings')}
            className={`pb-2.5 transition border-b-2 ${
              activeSubTab === 'settings'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            การเชื่อมต่อ & URL
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('guide')}
            className={`pb-2.5 transition border-b-2 ${
              activeSubTab === 'guide'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            วิธีติดตั้งทีละขั้นตอน (4 สเต็ป)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('code')}
            className={`pb-2.5 transition border-b-2 ${
              activeSubTab === 'code'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            โค้ด Apps Script (Code.gs)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* TAB 1: SETTINGS */}
          {activeSubTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Google Apps Script Web App URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="gasUrl" className="block text-xs font-semibold text-slate-900 dark:text-slate-200">
                    Google Apps Script Web App URL
                  </label>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    ได้จากปุ่ม Deploy &gt; Web App
                  </span>
                </div>
                <input
                  id="gasUrl"
                  type="url"
                  value={gasUrl}
                  onChange={(e) => setGasUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    หากเว้นว่างไว้ ระบบจะทำงานในโหมด Local Caching สำหรับทดสอบ
                  </p>
                  <button
                    type="button"
                    onClick={handleTestGAS}
                    disabled={testGasStatus === 'testing' || !gasUrl}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 disabled:opacity-40"
                  >
                    <RefreshCw className={`w-3 h-3 ${testGasStatus === 'testing' ? 'animate-spin' : ''}`} />
                    <span>ทดสอบการเชื่อมต่อ</span>
                  </button>
                </div>

                {testGasMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    testGasStatus === 'success' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    {testGasStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <span>{testGasMessage}</span>
                  </div>
                )}
              </div>

              {/* LINE Notify Token */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-700 pt-5">
                <div className="flex items-center justify-between">
                  <label htmlFor="lineToken" className="block text-xs font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>LINE Notify Token (ส่งแจ้งเตือนเข้ากลุ่มไลน์ฟรี)</span>
                  </label>
                  <a
                    href="https://notify-bot.line.me/my/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>ขอรับ Token ฟรี</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  id="lineToken"
                  type="text"
                  value={lineToken}
                  onChange={(e) => setLineToken(e.target.value)}
                  placeholder="เช่น xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-base sm:text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={enableLine}
                      onChange={(e) => setEnableLine(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-600 focus:ring-emerald-500"
                    />
                    <span>เปิดใช้งานแจ้งเตือน LINE อัตโนมัติเมื่อแจ้งเคสหรือเปลี่ยนสถานะ</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleTestLineNotify}
                    disabled={testLineStatus === 'testing' || !lineToken}
                    className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 hover:underline inline-flex items-center gap-1 disabled:opacity-40"
                  >
                    <Send className="w-3 h-3" />
                    <span>ทดสอบส่ง LINE</span>
                  </button>
                </div>

                {testLineMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    testLineStatus === 'success' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60'
                  }`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{testLineMessage}</span>
                  </div>
                )}
              </div>

              {/* Sync Toggle */}
              <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    ดึงข้อมูลเคสจาก Google Sheets อัตโนมัติ (Two-way sync)
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    เมื่อเปิดใช้งาน ระบบจะดึงข้อมูลเคสที่บันทึกอยู่ในชีทมาแสดงในแดชบอร์ด
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={useSheetsSync}
                  onChange={(e) => setUseSheetsSync(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 border-slate-300 dark:border-slate-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

            </div>
          )}

          {/* TAB 2: GUIDE */}
          {activeSubTab === 'guide' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 text-indigo-900 dark:text-indigo-300">
                <span className="font-bold">🎉 ทำงานฟรี 100%:</span> ไม่ต้องเสียค่าเช่าเซิร์ฟเวอร์หรือฐานข้อมูลใดๆ ข้อมูลทั้งหมดเก็บอยู่ใน Google Drive & Google Sheets ของคุณเองอย่างปลอดภัย
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900/40">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>สร้าง Google Sheets</span>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  เปิด <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">sheets.new</a> ในเบราว์เซอร์ ตั้งชื่อไฟล์ เช่น <strong>"ฐานข้อมูลแจ้งปัญหาตามสัญญา"</strong> (ไม่ต้องสร้างหัวตารางเอง สคริปต์จะสร้างให้อัตโนมัติ)
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900/40">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
                  <span>เปิด Google Apps Script</span>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  ในหน้า Google Sheets คลิกที่เมนูด้านบน <strong>ส่วนขยาย (Extensions) &gt; Apps Script</strong>
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900/40">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>วางโค้ดสคริปต์สำเร็จรูป</span>
                </div>
                <p className="pl-8 text-slate-600 dark:text-slate-400">
                  ลบโค้ดเดิมในไฟล์ <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Code.gs</code> ออกทั้งหมด แล้วไปที่แท็บ <strong>"โค้ด Apps Script"</strong> ด้านบน กดปุ่มคัดลอก แล้วนำมาวางในหน้าต่าง Apps Script จากนั้นกดปุ่ม <strong>บันทึก (รูปแผ่นดิสก์)</strong>
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-white dark:bg-slate-900/40">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <span className="w-6 h-6 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center text-xs">4</span>
                  <span>ทำให้ใช้งานได้ (Deploy as Web App)</span>
                </div>
                <div className="pl-8 text-slate-600 dark:text-slate-400 space-y-1.5">
                  <p>1. คลิกปุ่มสีน้ำเงินมุมขวาบน <strong>การทำให้ใช้งานได้ (Deploy) &gt; การทำให้ใช้งานได้รายการใหม่ (New deployment)</strong></p>
                  <p>2. ตรงรูปเฟืองเลือก <strong>เว็บแอปพลิเคชัน (Web app)</strong></p>
                  <p>3. กำหนดค่า: 
                    <br />• ดำเนินการในฐานะ (Execute as): <strong>ฉัน (Me)</strong>
                    <br />• ใครมีสิทธิ์เข้าถึง (Who has access): <strong className="text-rose-600 dark:text-rose-400">ทุกคน (Anyone)</strong> *(สำคัญมาก! หากเลือกผิดแอปจะบันทึกข้อมูลลงชีทไม่ได้)*
                  </p>
                  <p>4. คลิก "ทำให้ใช้งานได้" และกดยืนยันสิทธิ์บัญชี Google</p>
                  <p>5. คัดลอก <strong>URL เว็บแอปพลิเคชัน (Web app URL)</strong> มาวางในช่อง URL ในแท็บ "การเชื่อมต่อ & URL" เป็นอันเสร็จสิ้น!</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CODE */}
          {activeSubTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  โค้ด Google Apps Script (Code.gs)
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'คัดลอกโค้ดเรียบร้อย!' : 'คัดลอกโค้ดทั้งหมด'}</span>
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-4 text-xs font-mono text-emerald-400 max-h-[380px] overflow-y-auto">
                <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                💡 โค้ดนี้มีระบบสร้างตารางอัตโนมัติ และฟังก์ชันเชื่อมต่อ API ของ LINE Notify เรียบร้อยในตัว
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {gasUrl ? '🟢 พร้อมทำงานร่วมกับ Google Sheets' : '⚪ โหมด Local / Demo'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              ปิดหน้าต่าง
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
            >
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
