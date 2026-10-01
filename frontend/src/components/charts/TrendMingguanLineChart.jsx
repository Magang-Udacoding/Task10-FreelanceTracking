import React, { memo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin  // Requirement #32: zoom/pan enabled
);

// React.memo: prevent re-render unless data/theme changes (Requirement #57)
// Requirement #29: 30 hari smooth Bezier curve
const TrendMingguanLineChart = memo(function TrendMingguanLineChart({ data = [], target = 25000000, theme = 'light' }) {
  // Generate 30-day labels
  const days = Array.from({ length: 30 }, (_, i) => `Hari ${i + 1}`);

  // Map daily data to 30-day array — data comes from daily_chart
  const actualValues = Array(30).fill(0);
  if (data && data.length > 0) {
    data.forEach(item => {
      // Support both day-indexed and week-indexed data
      const dayIdx = item.day != null ? item.day - 1 : ((item.week || 1) - 1) * 7;
      if (dayIdx >= 0 && dayIdx < 30) {
        actualValues[dayIdx] = item.total || 0;
      }
    });
  }

  // Linear target trajectory over 30 days
  const targetValues = days.map((_, i) => Math.round(target * ((i + 1) / 30)));


  const isDark = theme === 'dark';

  const chartData = {
    labels: days,
    datasets: [
      {
        label: 'Omset Aktual',
        data: actualValues,
        fill: true,
        borderColor: '#2563EB', // Vibrant Blue
        backgroundColor: isDark ? 'rgba(37, 99, 235, 0.22)' : 'rgba(37, 99, 235, 0.12)',
        tension: 0.4, // Smooth Bezier curve
        pointBackgroundColor: '#2563EB',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#2563EB',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
      },
      {
        label: 'Target Omset',
        data: targetValues,
        fill: false,
        borderColor: '#F59E0B', // Vibrant Amber
        borderDash: [6, 4],
        tension: 0.1,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#FFFFFF',
        pointRadius: 3,
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
        pan: {
          enabled: true,
          mode: 'x',
        }
      },
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#E5E7EB' : '#1E1A17',
          font: { family: 'Outfit', size: 11 },
          usePointStyle: true,
          pointStyle: 'circle',
        }
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
            const rawVal = context.raw;
            const datasetLabel = context.dataset.label;
            
            // Format Indonesian Currency in Juta / Ribu shorthand
            let shorthand = '';
            if (rawVal >= 1000000) {
              shorthand = `Rp ${(rawVal / 1000000).toFixed(1)}Jt`;
            } else if (rawVal >= 1000) {
              shorthand = `Rp ${(rawVal / 1000).toFixed(0)}Rb`;
            } else {
              shorthand = `Rp ${rawVal}`;
            }

            // Calculate percentage increase/deviation relative to target
            const correspondingTarget = targetValues[context.dataIndex];
            const diffPct = ((rawVal - correspondingTarget) / correspondingTarget) * 100;
            const sign = diffPct >= 0 ? '+' : '';
            const badge = ` (${sign}${diffPct.toFixed(0)}%)`;

            return `${datasetLabel}: ${shorthand}${badge}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
          font: { family: 'Outfit', size: 10 }
        }
      },
      y: {
        grid: {
          color: isDark ? '#2C2520' : '#F3F4F6'
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
          }
        }
      }
    }
  };

  return (
    <div className="relative w-full h-[280px]">
      <Line data={chartData} options={options} />
    </div>
  );
});

export default TrendMingguanLineChart;
