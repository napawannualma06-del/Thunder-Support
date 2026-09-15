import React from 'react';
import { 
  Send, 
  Search, 
  Wrench, 
  Settings, 
  Lock, 
  Sun, 
  Moon, 
  Share2,
  Zap
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
  inProgressCount: _inProgressCount,
  isAdminAuthenticated = false,
  theme,
  onToggleTheme,
  onOpenShareModal,
}) => {
  const isGASConnected = Boolean(settings.gasWebAppUrl);

  return (
    <>
      {/* Top Header: Sleek, high-contrast, modern floating-glass aesthetic */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Title */}
            <div 
              id="brand-logo-button"
              className="flex items-center gap-3 cursor-pointer group select-none"
              onClick={() => setActiveTab('report')}
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-pink-400 text-white shadow-sm shadow-pink-500/25 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" title="ออนไลน์พร้อมรับเรื่อง" />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base text-slate-900 dark:text-white tracking-tight">
                    Thunder Support
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-500/20">
                    ฝ่ายเทคนิค
                  </span>
                </div>
                <span className="text-[12px] text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                  แจ้งตามเลขสัญญา ➔ พี่เกมดำเนินการทันที
                </span>
              </div>
            </div>

            {/* Desktop Navigation Segmented Control */}
            <nav id="desktop-nav" className="hidden md:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80">
              <button
                id="nav-tab-report"
                type="button"
                onClick={() => setActiveTab('report')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'report'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>แจ้งปัญหา</span>
              </button>

              <button
                id="nav-tab-track"
                type="button"
                onClick={() => setActiveTab('track')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'track'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>เช็คสถานะ</span>
              </button>

              <button
                id="nav-tab-admin"
                type="button"
                onClick={() => setActiveTab('admin')}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={isAdminAuthenticated ? 'คิวงานฝ่ายเทคนิค' : 'เฉพาะพี่เกม (ต้องใส่รหัส)'}
              >
                {isAdminAuthenticated ? (
                  <Wrench className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>คิวงาน</span>
                {pendingCount > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'admin'
                      ? 'bg-white/20 dark:bg-slate-950/20 text-inherit'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {pendingCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Action Tools Right Side */}
            <div id="navbar-actions" className="flex items-center gap-2">
              {/* Share button */}
              <button
                id="btn-share-link"
                type="button"
                onClick={onOpenShareModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition"
                title="แชร์ลิงก์ให้พนักงาน"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="hidden sm:inline">ส่งต่อให้พนักงาน</span>
              </button>

              {/* Theme Toggle Button */}
              <button
                id="btn-toggle-theme"
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition"
                title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Integration Settings (แสดงเฉพาะเมื่อพี่เกมเข้าสู่ระบบแล้วเท่านั้น) */}
              {isAdminAuthenticated && (
                <button
                  id="btn-open-settings"
                  type="button"
                  onClick={openSettings}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
                    isGASConnected
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-300 bg-transparent border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="ตั้งค่าเชื่อมต่อ Google Sheets & LINE Notify (สำหรับพี่เกม)"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isGASConnected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="text-[11px]">
                    {isGASConnected ? 'ชีทเชื่อมต่อแล้ว' : 'ตั้งค่าชีท'}
                  </span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Bar for touch devices */}
      <nav id="mobile-bottom-nav" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-6 py-2 flex items-center justify-around shadow-lg transition-colors">
        <button
          id="mobile-tab-report"
          type="button"
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeTab === 'report' ? 'text-amber-500 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="text-[11px]">แจ้งปัญหา</span>
        </button>

        <button
          id="mobile-tab-track"
          type="button"
          onClick={() => setActiveTab('track')}
          className={`flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeTab === 'track' ? 'text-amber-500 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="text-[11px]">เช็คสถานะ</span>
        </button>

        <button
          id="mobile-tab-admin"
          type="button"
          onClick={() => setActiveTab('admin')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 transition ${
            activeTab === 'admin' ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <div className="relative">
            {isAdminAuthenticated ? (
              <Wrench className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4 text-amber-500" />
            )}
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">คิวงาน</span>
        </button>
      </nav>
    </>
  );
};
