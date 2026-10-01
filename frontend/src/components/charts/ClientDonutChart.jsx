import React, { memo, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from 'chart.js';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';
import { Users, RotateCcw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip);

// Vibrant, distinct colors for easily identifying each client
const VIBRANT_CLIENT_PALETTE = [
  '#2563EB', // Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#EF4444', // Red
  '#84CC16', // Lime
  '#D946EF', // Fuchsia
  '#0284C7', // Sky Blue
  '#E11D48', // Rose
  '#059669', // Dark Emerald
  '#7C3AED', // Violet
  '#D97706', // Dark Amber
  '#0891B2', // Cyan-600
  '#C026D3', // Fuchsia-600
  '#4F46E5', // Indigo-600
];

function getClientColor(index) {
  return VIBRANT_CLIENT_PALETTE[index % VIBRANT_CLIENT_PALETTE.length];
}

// React.memo: prevent re-render unless data/theme changes (Requirement #57)
const ClientDonutChart = memo(function ClientDonutChart({ data = [], theme = 'light' }) {
  const { state, dispatch } = useDashboard();
  const { filters } = state;
  const isDark = theme === 'dark';
  const selectedClient = filters?.client;

  // Filter and sort clients by total revenue descending
  const activeData = useMemo(() => {
    return [...data]
      .filter(d => (d.total || 0) > 0)
      .sort((a, b) => b.total - a.total);
  }, [data]);

  const totalSum = useMemo(() => {
    return activeData.reduce((acc, curr) => acc + curr.total, 0);
  }, [activeData]);

  if (activeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[280px] text-center p-4">
        <div className="w-12 h-12 rounded-[2px] bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center mb-2 text-neutral-400">
          <Users size={20} />
        </div>
        <p className="text-xs font-bold text-black dark:text-white">Tidak ada data klien</p>
        <p className="text-[10px] text-neutral-500 mt-0.5">Belum ada tagihan proyek pada periode ini</p>
      </div>
    );
  }

  const labels = activeData.map(d => d.client);
  const totals = activeData.map(d => d.total);
  const colors = activeData.map((_, idx) => getClientColor(idx));

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: totals,
        backgroundColor: colors,
        hoverBackgroundColor: isDark ? '#ffffff' : '#000000',
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#141414' : '#FFFFFF',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%', // Thin, elegant donut with centered info
    plugins: {
      legend: {
        display: false, // Turn off canvas legend to eliminate text clipping completely!
      },
      tooltip: {
        backgroundColor: isDark ? '#111111' : '#FFFFFF',
        titleColor: isDark ? '#FFFFFF' : '#000000',
        bodyColor: isDark ? '#CCCCCC' : '#444444',
        borderColor: isDark ? '#444444' : '#CCCCCC',
        borderWidth: 1,
        titleFont: { family: 'Tahoma, sans-serif', weight: 'bold', size: 11 },
        bodyFont: { family: 'Tahoma, sans-serif', size: 10 },
        padding: 8,
        callbacks: {
          label: function (context) {
            const rawVal = context.raw || 0;
            const percentage = totalSum > 0 ? ((rawVal / totalSum) * 100).toFixed(1) : 0;
            const formattedVal = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(rawVal);
            return `${context.label}: ${formattedVal} (${percentage}%)`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const itemIndex = elements[0].index;
        const clickedClient = labels[itemIndex];
        dispatch({
          type: ACTIONS.SET_FILTER,
          payload: { client: selectedClient === clickedClient ? 'all' : clickedClient }
        });
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

  const handleSelectClient = (clientName) => {
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { client: selectedClient === clientName ? 'all' : clientName }
    });
  };

  const handleResetFilter = () => {
    dispatch({
      type: ACTIONS.SET_FILTER,
      payload: { client: 'all' }
    });
  };

  return (
    <div className="w-full flex flex-col justify-between">
      
      {/* 1. Donut Chart Canvas Area with Center Metric */}
      <div className="relative w-full h-[180px] sm:h-[195px] flex items-center justify-center">
        <Doughnut data={chartData} options={options} />
        
        {/* Center Donut Ring Summary Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center select-none">
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest leading-none">
            Total Klien
          </span>
          <span className="text-base sm:text-lg font-bold font-sans text-black dark:text-white leading-tight">
            {activeData.length}
          </span>
          <span className="text-[9px] font-mono text-neutral-400 leading-none">
            Rp {(totalSum / 1000000).toFixed(0)} Jt
          </span>
        </div>
      </div>

      {/* 2. Interactive Retro Facebook HTML Legend List (100% Responsive, Zero Text Clipping) */}
      <div className="mt-2.5 pt-2 border-t border-[#ccd0d5] dark:border-[#333333] flex flex-col">
        
        {/* Header with Active Filter Info & Reset Button */}
        <div className="flex items-center justify-between mb-1.5 px-1 text-[10px] uppercase font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">
          <div className="flex items-center gap-1.5 truncate">
            <span>Daftar Mitra ({activeData.length})</span>
            {selectedClient && selectedClient !== 'all' && (
              <span className="px-1 py-0.2 bg-black text-white dark:bg-white dark:text-black font-mono text-[8px] rounded-[1px]">
                Filter Aktif
              </span>
            )}
          </div>
          {selectedClient && selectedClient !== 'all' && (
            <button
              onClick={handleResetFilter}
              className="text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer flex items-center gap-0.5 normal-case font-semibold text-[10px]"
            >
              <RotateCcw size={10} /> Reset
            </button>
          )}
        </div>

        {/* Scrollable Client Items List with Full Text, Revenue & Percentages */}
        <div className="max-h-[150px] sm:max-h-[165px] overflow-y-auto pr-1 space-y-1 divide-y divide-neutral-100 dark:divide-neutral-800">
          {activeData.map((item, idx) => {
            const isSelected = selectedClient === item.client;
            const pct = totalSum > 0 ? ((item.total / totalSum) * 100).toFixed(1) : 0;
            const color = colors[idx];

            return (
              <button
                key={item.client}
                onClick={() => handleSelectClient(item.client)}
                className={`w-full flex items-center justify-between p-1.5 px-2 rounded-[2px] text-xs transition-colors cursor-pointer border pt-1.5 ${
                  isSelected
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold shadow-xs'
                    : 'hover:bg-[#eceff5] dark:hover:bg-[#1e1e1e] border-transparent text-black dark:text-neutral-200'
                }`}
                title={`Klik untuk memfilter proyek dari "${item.client}" (Rp ${item.total.toLocaleString('id-ID')} · ${pct}%)`}
              >
                {/* Left Swatch & Client Name (Never clipped) */}
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2 text-left">
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-neutral-400" 
                    style={{ backgroundColor: color }} 
                  />
                  <span className="truncate text-left text-[11px] font-semibold">
                    {item.client}
                  </span>
                </div>

                {/* Right Revenue Shorthand & Percentage */}
                <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                  <span className={isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'}>
                    Rp {(item.total / 1000000).toFixed(1)}Jt
                  </span>
                  <span className={`px-1 py-0.2 rounded-[1px] font-bold ${
                    isSelected
                      ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-black'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                  }`}>
                    {pct}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
});

export default ClientDonutChart;
