import React, { useEffect } from 'react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Info, 
  Sparkles, 
  X 
} from 'lucide-react';

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    // Auto-dismiss each toast after 4 seconds
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getBadgeAndIcon = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />,
          badgeBg: 'bg-emerald-500 text-white',
          badgeText: '[SUKSES]',
          borderColor: 'border-emerald-600',
        };
      case 'warning':
      case 'delete':
        return {
          icon: <Trash2 size={14} className="text-rose-500 shrink-0" />,
          badgeBg: 'bg-rose-600 text-white',
          badgeText: '[HAPUS/PERINGATAN]',
          borderColor: 'border-rose-600',
        };
      case 'error':
        return {
          icon: <AlertTriangle size={14} className="text-amber-500 shrink-0" />,
          badgeBg: 'bg-amber-600 text-white',
          badgeText: '[PERHATIAN]',
          borderColor: 'border-amber-600',
        };
      default:
        return {
          icon: <Info size={14} className="text-blue-500 shrink-0" />,
          badgeBg: 'bg-blue-600 text-white',
          badgeText: '[INFORMASI]',
          borderColor: 'border-blue-600',
        };
    }
  };

  const { icon, badgeBg, badgeText, borderColor } = getBadgeAndIcon();

  return (
    <div 
      className="pointer-events-auto w-full bg-white dark:bg-[#181818] border-2 border-black dark:border-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff] rounded-[2px] overflow-hidden transition-all duration-300 animate-slideInRight select-none"
      role="alert"
    >
      {/* Toast Retro Header */}
      <div className="bg-[#eceff5] dark:bg-[#252525] border-b border-[#ccd0d5] dark:border-[#3a3a3a] px-2.5 py-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-4 h-4 bg-black text-white dark:bg-white dark:text-black font-extrabold flex items-center justify-center text-[9px] rounded-[1px] font-mono shrink-0">
            f
          </span>
          <span className={`px-1 py-0.2 rounded-[1px] font-mono text-[8px] font-bold uppercase tracking-wider ${badgeBg} shrink-0`}>
            {badgeText}
          </span>
          <span className="font-bold text-[10px] text-black dark:text-white uppercase tracking-wider truncate">
            {toast.title || 'Notifikasi'}
          </span>
        </div>

        <button
          onClick={() => onRemove(toast.id)}
          className="p-0.5 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
          aria-label="Tutup"
        >
          <X size={12} />
        </button>
      </div>

      {/* Toast Content Body */}
      <div className="p-2.5 flex items-start gap-2">
        <div className="mt-0.5">{icon}</div>
        <p className="text-xs font-semibold text-black dark:text-white leading-snug break-words flex-1">
          {toast.message}
        </p>
      </div>

      {/* Animated Auto-dismiss Countdown Progress Bar */}
      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1 overflow-hidden">
        <div 
          className="h-full bg-black dark:bg-white origin-left"
          style={{
            animation: 'shrinkWidth 4s linear forwards',
          }}
        />
      </div>
    </div>
  );
}

export default function ToastNotification() {
  const { state, dispatch } = useDashboard();
  const toasts = state?.toasts || [];

  if (toasts.length === 0) return null;

  const handleRemove = (id) => {
    dispatch({ type: ACTIONS.REMOVE_TOAST, payload: id });
  };

  return (
    <div 
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[9999] flex flex-col gap-2 max-w-xs sm:max-w-sm w-full pointer-events-none px-2 sm:px-0"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
      ))}
    </div>
  );
}
