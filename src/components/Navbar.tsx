import React from 'react';
import { 
  Send, 
  Search, 
  Wrench, 
  Settings, 
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Sun,
  Moon,
  Share2
} from 'lucide-react';
import { IntegrationSettings } from '../types';

interface NavbarProps {
  activeTab: 'report' | 'track' | 'admin';
  setActiveTab: (tab: 'report' | 'track' | 'admin') => void;
  openSettings: () => void;
  settings: IntegrationSettings;
  pendingCount: number;
  inProgressCount: number;
  isAdminAuthenticated?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenShareModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSettings,
  settings,
  pendingCount,
  inProgressCount,
  isAdminAuthenticated = false,
  theme,
  onToggleTheme,
  onOpenShareModal,
}) => {
  const isGASConnected = Boolean(settings.gasWebAppUrl);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo & Quick identity */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer select-none"
              onClick={() => setActiveTab('report')}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-indigo-200 dark:shadow-none">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                    แจ้งปัญหา
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-full border border-indigo-200 dark:border-indigo-800">
                    ปิด Proxy / ไอที
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  ระบุเลขสัญญา ➔ แจ้งฝ่ายเทคนิค (พี่เกม) ➔ อัปเดตงานทันที
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'report'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>แจ้งปัญหา</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'track'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>เช็คสถานะ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 dark:bg-indigo-700 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isAdminAuthenticated ? 'คิวงานฝ่ายเทคนิค' : 'สำหรับฝ่ายเทคนิค (ต้องใส่รหัส)'}
              >
                {isAdminAuthenticated ? (
                  <Wrench className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-200" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>คิวงาน (พี่เกม)</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                    {pendingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Quick Action Buttons (Share, Theme, Settings) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* Share Link for Employees */}
              <button
                type="button"
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition"
                title="ส่งลิงก์ให้พนักงาน"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ส่งลิงก์ให้พนักงาน</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-200" />
                )}
              </button>

              {/* Integration Setting Button */}
              <button
                type="button"
                onClick={openSettings}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                  isGASConnected
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isGASConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">
                  {isGASConnected ? 'Sheets & LINE' : 'ตั้งค่าชีท'}
                </span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile & Tablet Bottom Navigation Bar (Very clean and comfortable for touch) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg transition-colors">
        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'report' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Send className="w-5 h-5" />
          <span className="text-[11px]">แจ้งปัญหา</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'track' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[11px]">เช็คสถานะ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            activeTab === 'admin' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            {isAdminAuthenticated ? (
              <Wrench className="w-5 h-5" />
            ) : (
              <Lock className="w-5 h-5 text-amber-500" />
            )}
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">คิวงาน (พี่เกม)</span>
        </button>
      </div>
    </>
  );
};
