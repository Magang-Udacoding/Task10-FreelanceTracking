import React, { useState, memo } from 'react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';
import { Bell, Sun, Moon, Check, User, Menu, X } from 'lucide-react';

// React.memo prevents re-render unless props change (Requirement #57)
const Navbar = memo(function Navbar({ mobileOpen, setMobileOpen }) {
  const { state, dispatch } = useDashboard();
  const { notifications, theme, user } = state;
  
  const isDark = theme === 'dark';
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-black text-white border-b-2 border-neutral-700 shadow-[0_2px_4px_rgba(0,0,0,0.4)] px-2.5 sm:px-4 py-2 select-none no-print sticky top-0 z-40">
      <div className="max-w-[1550px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 sm:gap-3">
        
        {/* Left: Hamburger and Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen && setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 rounded-[2px] shrink-0 focus:outline-none cursor-pointer"
            aria-label="Buka Menu Navigasi"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Classic Facebook Brand Logo in Black & White */}
          <div 
            onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: 'Dashboard' })}
            className="flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <div className="w-7 h-7 bg-white text-black font-extrabold text-xl flex items-center justify-center rounded-[2px] leading-none select-none font-sans">
              f
            </div>
            <div className="leading-tight hidden xs:block">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-white lowercase">
                freelance<span className="font-normal text-neutral-400">book</span>
              </span>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 block -mt-1 font-mono uppercase tracking-widest">
                tracker v1.0
              </span>
            </div>
          </div>
        </div>

        {/* Retro Navigation Links & Tools - Flex Wrap for Responsive Mobile */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 text-xs font-bold text-neutral-300 flex-wrap">
          
          {/* Classic Nav Buttons */}
          <div className="flex items-center divide-x divide-neutral-700 bg-neutral-900/80 md:bg-transparent border md:border-none border-neutral-800 rounded-[2px] px-1 md:px-0">
            <button 
              onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: 'Dashboard' })}
              className={`px-2 py-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                state.activeView === 'Dashboard' ? 'text-white underline font-extrabold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Beranda
            </button>
            <button 
              onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: 'Calendar' })}
              className={`px-2 py-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                state.activeView === 'Calendar' ? 'text-white underline font-extrabold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Kalender
            </button>
            <button 
              onClick={() => dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: 'Settings' })}
              className={`px-2 py-1 transition-colors text-[11px] sm:text-xs cursor-pointer ${
                state.activeView === 'Settings' ? 'text-white underline font-extrabold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Pengaturan
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Profile User Badge */}
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-700 px-2 py-1 rounded-[2px] text-white">
              <div className="w-4 h-4 bg-neutral-700 text-white rounded-[1px] flex items-center justify-center text-[10px] shrink-0">
                <User size={10} />
              </div>
              <span className="truncate max-w-[70px] sm:max-w-[100px] text-[11px] sm:text-xs">{user?.username || 'Admin'}</span>
            </div>

            {/* Notifications Icon with Counter */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-[2px] text-white flex items-center justify-center cursor-pointer"
                title="Pemberitahuan"
              >
                <Bell size={13} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-black font-mono text-[9px] font-extrabold px-1 rounded-[1px] leading-tight">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Window */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#111111] text-black dark:text-white border-2 border-black dark:border-neutral-700 shadow-[3px_3px_0px_#000] z-50 rounded-[2px]">
                  <div className="bg-black text-white px-3 py-1.5 font-bold text-xs flex justify-between items-center border-b border-neutral-800">
                    <span>Pemberitahuan ({notifications.length})</span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={() => dispatch({ type: ACTIONS.MARK_NOTIFICATIONS_READ })}
                        className="text-[10px] text-neutral-300 hover:text-white underline cursor-pointer flex items-center gap-1"
                      >
                        <Check size={11} /> Tandai dibaca
                      </button>
                    )}
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-neutral-200 dark:divide-neutral-800">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 text-xs transition-colors ${
                            n.read
                              ? 'bg-neutral-50 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400'
                              : 'bg-white dark:bg-black font-semibold text-black dark:text-white border-l-2 border-black dark:border-white'
                          }`}
                        >
                          <p className="leading-snug break-words">{n.message}</p>
                          <span className="text-[10px] text-neutral-500 font-mono block mt-1">{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-neutral-500">
                        Tidak ada pemberitahuan baru
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Black & White Theme Toggle */}
            <button
              onClick={() => dispatch({ type: ACTIONS.TOGGLE_THEME })}
              className="p-1.5 sm:px-2 sm:py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-[2px] text-white flex items-center gap-1 font-mono text-[10px] cursor-pointer"
              title="Alihkan Mode Hitam/Putih"
            >
              {isDark ? <Sun size={12} className="text-white" /> : <Moon size={12} className="text-white" />}
              <span className="hidden sm:inline">{isDark ? 'PUTIH' : 'HITAM'}</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
});

export default Navbar;
