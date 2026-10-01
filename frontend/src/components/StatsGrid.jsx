import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Wallet, TrendingUp, FileText, Target } from 'lucide-react';

export default function StatsGrid() {
  const { state } = useDashboard();
  const { revenue, target, achievement, avgDaily, projects } = state;

  const formatShorthand = (val) => {
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(0)} Jt`;
    }
    if (val >= 1000) {
      return `Rp ${(val / 1000).toFixed(0)} Rb`;
    }
    return `Rp ${val}`;
  };

  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length;

  const stats = [
    {
      title: 'Omset Bulanan',
      value: formatShorthand(revenue),
      subtext: 'Penerimaan berjalan',
      icon: <Wallet size={14} />,
    },
    {
      title: 'Rata-Rata Harian',
      value: formatShorthand(avgDaily),
      subtext: 'Omset per hari',
      icon: <TrendingUp size={14} />,
    },
    {
      title: 'Total Tagihan',
      value: `${projects.length} Proyek`,
      subtext: `${activeProjectsCount} proyek aktif`,
      icon: <FileText size={14} />,
    },
    {
      title: 'Target Omset',
      value: `${achievement.toFixed(1)}%`,
      subtext: `Target: Rp ${(target / 1000000).toFixed(0)} Jt`,
      icon: <Target size={14} />,
      progress: Math.min(achievement, 100)
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex flex-col justify-between"
        >
          {/* Classic Facebook Box Header Bar */}
          <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
            <span className="font-bold text-[11px] uppercase tracking-wide truncate">
              {stat.title}
            </span>
            <span className="text-black dark:text-white shrink-0 ml-1">
              {stat.icon}
            </span>
          </div>

          {/* Box Content Body */}
          <div className="p-3 sm:p-3.5">
            <h3 className="text-lg sm:text-xl font-bold font-sans text-black dark:text-white tracking-tight truncate">
              {stat.value}
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
              {stat.subtext}
            </p>

            {stat.progress !== undefined && (
              <div className="mt-2.5">
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-[1px] overflow-hidden border border-neutral-400 dark:border-neutral-600">
                  <div 
                    className="bg-black dark:bg-white h-full transition-all duration-700" 
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}
