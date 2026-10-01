import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Award, Zap, Sparkles, PlusCircle, RefreshCw } from 'lucide-react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';

export default function Achievements({ onOpenAddModal }) {
  const { state, dispatch, fetchData } = useDashboard();
  const { achievements, revenue, target, user } = state;
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  const detectSize = () => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener('resize', detectSize);
    return () => window.removeEventListener('resize', detectSize);
  }, []);

  useEffect(() => {
    const revNum = Number(revenue);
    const targetNum = Number(target);

    if (revNum > 0 && targetNum > 0 && revNum >= targetNum) {
      const storageKey = `confetti_shown_target_${targetNum}`;
      const hasCelebrated = localStorage.getItem(storageKey);
      
      if (!hasCelebrated) {
        setShowConfetti(true);
        localStorage.setItem(storageKey, 'true');
        const timer = setTimeout(() => setShowConfetti(false), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [revenue, target]);

  return (
    <div className="space-y-3 no-print">
      
      {/* Monochrome Black & White Confetti */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          colors={['#000000', '#ffffff', '#333333', '#777777', '#bbbbbb']}
          style={{ zIndex: 100, position: 'fixed', top: 0, left: 0 }}
        />
      )}

      {/* Widget 1: Quick Actions (Retro Facebook Sidebar Box) */}
      <div className="bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
          <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
            <Zap size={13} /> Aksi Cepat
          </span>
        </div>
        
        <div className="p-3 space-y-2">
          {user?.role === 'admin' ? (
            <button
              onClick={onOpenAddModal}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-[2px] border border-black shadow-[1px_1px_0px_#444] cursor-pointer transition-all"
            >
              <PlusCircle size={14} />
              + Tambah Proyek / Tagihan
            </button>
          ) : (
            <div className="p-2 text-center text-xs text-neutral-500 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 rounded-[2px]">
              🔒 Tambah Tagihan (Khusus Admin)
            </div>
          )}

          <button
            onClick={() => {
              fetchData();
              dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '🔄 Sinkronisasi data proyek berhasil dimuat ulang.' } });
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-neutral-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold text-xs rounded-[2px] shadow-[1px_1px_0px_#ccc] dark:shadow-none cursor-pointer transition-all"
          >
            <RefreshCw size={13} />
            Muat Ulang Data
          </button>
        </div>
      </div>

      {/* Widget 2: Achievements (Retro Facebook Events/Badges Box) */}
      <div className="bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
          <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1.5">
            <Award size={13} /> Prestasi & Pencapaian
          </span>
        </div>

        <div className="p-2 space-y-1.5">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              onClick={() => {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
              }}
              title="Klik untuk merayakan selebrasi prestasi!"
              className={`p-2 border rounded-[2px] flex items-center gap-2.5 transition-all cursor-pointer ${
                ach.unlocked 
                  ? 'bg-neutral-50 dark:bg-[#181818] border-black dark:border-neutral-500 hover:bg-neutral-100' 
                  : 'bg-white dark:bg-[#141414] border-neutral-200 dark:border-neutral-800 opacity-60'
              }`}
            >
              <div className="text-xl shrink-0 select-none grayscale">
                {ach.icon}
              </div>
              
              <div className="truncate flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-black dark:text-white truncate m-0">
                    {ach.title}
                  </p>
                  <span className={`px-1.5 py-0.5 border font-mono text-[9px] font-bold rounded-[1px] ${
                    ach.unlocked 
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black' 
                      : 'border-neutral-400 text-neutral-400'
                  }`}>
                    {ach.unlocked ? 'TERBUKA' : 'TERKUNCI'}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                  {ach.desc}
                </p>
              </div>
            </div>
          ))}

          {/* Test Confetti Button */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
              }}
              className="w-full py-1.5 px-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold rounded-[2px] text-[10px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[1px_1px_0px_#ccc] dark:shadow-none"
            >
              <Sparkles size={12} /> Rayakan Pencapaian (Uji Confetti B&W)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
