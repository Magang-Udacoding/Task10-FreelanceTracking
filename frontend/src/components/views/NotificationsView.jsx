import React from 'react';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsView() {
  const { state, dispatch } = useDashboard();
  const { notifications } = state;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
      
      {/* Retro Facebook Box Header */}
      <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Bell size={14} /> Pusat Pemberitahuan
          </h2>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Anda memiliki {unreadCount} pesan baru yang belum dibaca.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch({ type: ACTIONS.MARK_NOTIFICATIONS_READ })}
            className="fb-btn-primary self-start sm:self-auto flex items-center gap-1.5"
          >
            <Check size={12} /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-2.5">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-[2px] border transition-all flex items-start gap-3 ${
                n.read
                  ? 'bg-neutral-50 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                  : 'bg-white dark:bg-black border-2 border-black dark:border-white shadow-[2px_2px_0px_#000] text-black dark:text-white'
              }`}
            >
              <div className={`mt-1 w-2 h-2 rounded-[1px] shrink-0 ${n.read ? 'bg-neutral-300 dark:bg-neutral-700' : 'bg-black dark:bg-white'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${n.read ? 'font-normal' : 'font-bold'} break-words leading-relaxed`}>
                  {n.message}
                </p>
                <span className="text-[10px] text-neutral-400 font-mono block mt-1">{n.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-[2px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Bell size={24} />
            </div>
            <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Belum ada pemberitahuan</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Aktivitas dan pencapaian Anda akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
