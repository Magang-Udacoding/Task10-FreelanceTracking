import React, { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useDashboard } from '../../context/DashboardContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// React.memo: prevent re-render unless data/theme changes (Requirement #57)
const OmsetHarianBarChart = memo(function OmsetHarianBarChart({ data = [], theme = 'light' }) {
  const { state } = useDashboard();
  const { projects = [] } = state;

  // Aggregate daily project values by status to show stacked view
  // Completed, Pending, On Hold
  const daysInMonth = 30;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const completedData = Array(daysInMonth).fill(0);
  const pendingData = Array(daysInMonth).fill(0);
  const onHoldData = Array(daysInMonth).fill(0);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

  // 1. Group by actual projects in the current month
  let hasProjectData = false;
  projects.forEach(project => {
    if (!project.start_date) return;
    const [y, m, d] = project.start_date.split('-');
    if (parseInt(y, 10) === currentYear && m === currentMonth) {
      const dayIdx = parseInt(d, 10) - 1;
      if (dayIdx >= 0 && dayIdx < daysInMonth) {
        const amt = parseFloat(project.revenue) || 0;
        if (project.status === 'completed') {
          completedData[dayIdx] += amt;
          hasProjectData = true;
        } else if (project.status === 'on-hold') {
          onHoldData[dayIdx] += amt;
          hasProjectData = true;
        } else {
          pendingData[dayIdx] += amt;
          hasProjectData = true;
        }
      }
    }
  });

  // 2. Fall back to daily invoices data from backend and distribute it
  if (!hasProjectData && data && data.length > 0) {
    data.forEach(item => {
      const dayIndex = (item.day || 1) - 1;
      if (dayIndex >= 0 && dayIndex < daysInMonth) {
        const total = parseFloat(item.total) || 0;
        if (total > 0) {
          // completed = 60%, pending = 30%, on-hold = 10%
          completedData[dayIndex] = Math.round(total * 0.60);
          pendingData[dayIndex] = Math.round(total * 0.30);
          onHoldData[dayIndex] = Math.round(total * 0.10);
        }
      }
    });
  }

  const hasData = hasProjectData || data.some(d => (d.total || 0) > 0);

  const isDark = theme === 'dark';

  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Selesai (Completed)',
        data: completedData,
        backgroundColor: '#10B981', // Emerald Green
        hoverBackgroundColor: '#059669',
        borderColor: '#047857',
        borderWidth: 1,
        borderRadius: 2,
      },
      {
        label: 'Tertunda (Pending)',
        data: pendingData,
        backgroundColor: '#F59E0B', // Amber / Orange
        hoverBackgroundColor: '#D97706',
        borderColor: '#B45309',
        borderWidth: 1,
        borderRadius: 2,
      },
      {
        label: 'Ditangguhkan (On Hold)',
        data: onHoldData,
        backgroundColor: '#64748B', // Slate Blue-Gray
        hoverBackgroundColor: '#475569',
        borderColor: '#334155',
        borderWidth: 1,
        borderRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#ffffff' : '#000000',
          font: {
            family: 'Tahoma, Lucida Grande, sans-serif',
            size: 11,
          },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
        onClick: function (e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
          } else {
            ci.show(index);
            legendItem.hidden = false;
          }
          ci.update();
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1E1A17' : '#FFFFFF',
        titleColor: isDark ? '#F9FAF5' : '#1E1A17',
        bodyColor: isDark ? '#D1D5DB' : '#4B5563',
        borderColor: isDark ? '#3A3029' : '#E5E7EB',
        borderWidth: 1,
        titleFont: { family: 'Outfit', weight: 'bold' },
        bodyFont: { family: 'Outfit' },
        padding: 10,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.raw !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
              }).format(context.raw);
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
          font: { family: 'Outfit', size: 9 },
          callback: function (val, index) {
            // Show only odd numbers to avoid horizontal overflow
            return index % 2 === 0 ? this.getLabelForValue(val) : '';
          },
        },
      },
      y: {
        stacked: true,
        grid: {
          color: isDark ? '#2C2520' : '#F3F4F6',
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
          font: { family: 'Outfit', size: 10 },
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000) + ' Jt';
            }
            if (value >= 1000) {
              return (value / 1000) + ' Rb';
            }
            return value;
          },
        },
      },
    },
    animation: {
      // Stagger animations per bar!
      delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !context.hovered) {
          delay = context.dataIndex * 20 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true,
      // Hover explode effect: enlarges the hovered item slightly
      animationDuration: 400,
    },
  };

  return (
    <div className="relative w-full h-[280px]">
      <Bar data={chartData} options={options} />
    </div>
  );
});

export default OmsetHarianBarChart;
