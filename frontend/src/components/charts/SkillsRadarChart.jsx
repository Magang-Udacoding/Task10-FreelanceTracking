import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 6 developer skills with custom dedicated colors for clear identification
const SKILLS = [
  { label: 'JavaScript', value: 95, color: '#F59E0B' }, // Amber / Gold
  { label: 'React', value: 90, color: '#06B6D4' },      // Cyan / Teal
  { label: 'PHP', value: 88, color: '#8B5CF6' },        // Violet / Purple
  { label: 'Laravel', value: 85, color: '#EF4444' },    // Crimson Red
  { label: 'TypeScript', value: 80, color: '#2563EB' }, // Royal Blue
  { label: 'Node.js', value: 78, color: '#10B981' },    // Emerald Green
];

export default function SkillsRadarChart({ theme = 'light' }) {
  const isDark = theme === 'dark';

  const chartData = {
    labels: SKILLS.map(s => s.label),
    datasets: [
      {
        label: 'Tingkat Kemampuan (%)',
        data: SKILLS.map(s => s.value),
        backgroundColor: isDark ? 'rgba(99, 102, 241, 0.28)' : 'rgba(79, 70, 229, 0.20)',
        borderColor: '#6366F1', // Vibrant Indigo
        borderWidth: 2.5,
        pointBackgroundColor: '#4F46E5',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#4F46E5',
        pointRadius: 4.5,
        pointHoverRadius: 7,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        angleLines: {
          color: isDark ? '#333333' : '#E5E7EB'
        },
        grid: {
          color: isDark ? '#262626' : '#E5E7EB'
        },
        pointLabels: {
          color: isDark ? '#E5E7EB' : '#1F2937',
          font: {
            family: 'Tahoma, sans-serif',
            size: 10,
            weight: 'bold'
          }
        },
        ticks: {
          display: true,
          stepSize: 25,
          color: isDark ? '#737373' : '#9CA3AF',
          font: { family: 'Tahoma, sans-serif', size: 8 },
          backdropColor: 'transparent',
          callback: (val) => val + '%',
        },
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="relative w-full h-[250px] sm:h-[270px]">
        <Radar data={chartData} options={options} />
      </div>
      
      {/* Skill legend badges with dedicated colors */}
      <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap justify-center gap-1 sm:gap-1.5 px-1">
        {SKILLS.map((s) => (
          <div 
            key={s.label} 
            className="flex items-center gap-1.5 border border-neutral-300 dark:border-neutral-700 px-2 py-0.5 rounded-[1px] bg-white dark:bg-[#1a1a1a] shadow-2xs"
          >
            <div 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: s.color }} 
            />
            <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
              {s.label} <span className="font-mono font-bold" style={{ color: s.color }}>{s.value}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
