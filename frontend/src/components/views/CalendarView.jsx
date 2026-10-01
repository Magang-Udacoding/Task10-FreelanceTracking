import React, { useState, useMemo, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  X, 
  Search, 
  Briefcase, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Flag,
  Target
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';

// Helper Currency Formatter
const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val || 0);
};

// Retro Badge Helpers
const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-mono text-[9px] font-bold rounded-[1px]">
          [SELESAI]
        </span>
      );
    case 'on-hold':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 border border-dashed border-neutral-500 bg-white dark:bg-black text-neutral-600 dark:text-neutral-300 font-mono text-[9px] font-bold rounded-[1px]">
          [DITANGGUHKAN]
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 border border-neutral-600 dark:border-neutral-400 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-mono text-[9px] font-bold rounded-[1px]">
          [PENDING]
        </span>
      );
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'high':
      return (
        <span className="font-mono text-[9px] font-bold uppercase border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 rounded-[1px]">
          TINGGI
        </span>
      );
    case 'low':
      return (
        <span className="font-mono text-[9px] uppercase border border-neutral-400 text-neutral-500 px-1.5 py-0.5 rounded-[1px]">
          RENDAH
        </span>
      );
    default:
      return (
        <span className="font-mono text-[9px] font-bold uppercase border border-neutral-600 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white px-1.5 py-0.5 rounded-[1px]">
          SEDANG
        </span>
      );
  }
};

// Modal Pop-up Rincian Tanggal
function DayDetailModal({ isOpen, date, projects = [], onClose }) {
  const [modalSearch, setModalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'deadline' | 'started' | 'completed' | 'pending'

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset search and tab when opened with new date
  useEffect(() => {
    setModalSearch('');
    setActiveTab('all');
  }, [date, isOpen]);

  if (!isOpen || !date) return null;

  // Format date in Indonesian
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  // Categorize projects for this day
  const deadlineProjects = projects.filter(p => isSameDay(new Date(p.end_date), date));
  const startProjects = projects.filter(p => isSameDay(new Date(p.start_date), date));
  const completedProjects = projects.filter(p => p.status === 'completed');
  const pendingProjects = projects.filter(p => p.status === 'pending');

  // Total metrics
  const totalRevenue = projects.reduce((acc, p) => acc + (parseFloat(p.revenue) || 0), 0);
  const totalHours = projects.reduce((acc, p) => acc + (parseInt(p.hours) || 0), 0);

  // Filter based on active tab and search
  const filteredList = projects.filter(p => {
    // Search filter
    const matchesSearch = !modalSearch.trim() || 
      p.name?.toLowerCase().includes(modalSearch.toLowerCase()) ||
      p.client?.toLowerCase().includes(modalSearch.toLowerCase());

    if (!matchesSearch) return false;

    // Tab filter
    if (activeTab === 'deadline') {
      return isSameDay(new Date(p.end_date), date);
    }
    if (activeTab === 'started') {
      return isSameDay(new Date(p.start_date), date);
    }
    if (activeTab === 'completed') {
      return p.status === 'completed';
    }
    if (activeTab === 'pending') {
      return p.status === 'pending';
    }
    return true;
  });

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#141414] rounded-[2px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#000] border-2 border-black dark:border-white my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Retro Header */}
        <div className="bg-black text-white px-3.5 sm:px-4 py-2.5 flex items-center justify-between border-b border-neutral-700 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 bg-white text-black font-extrabold flex items-center justify-center text-xs rounded-[1px] shrink-0 font-mono">
              f
            </span>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight truncate uppercase">
                Rincian Jadwal: {formattedDate}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-white p-1 transition-colors cursor-pointer shrink-0 rounded-[2px] hover:bg-neutral-800"
            title="Tutup (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Quick Stats Summary Bar */}
        <div className="bg-[#eceff5] dark:bg-[#1e1e1e] border-b border-[#ccd0d5] dark:border-[#333333] px-3.5 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs shrink-0">
          <div className="bg-white dark:bg-[#121212] p-1.5 sm:p-2 border border-[#ccd0d5] dark:border-[#333] rounded-[1px]">
            <span className="block text-[10px] text-neutral-500 uppercase font-mono font-bold">Total Proyek</span>
            <span className="font-extrabold text-sm sm:text-base text-black dark:text-white font-mono">
              {projects.length}
            </span>
          </div>
          <div className="bg-white dark:bg-[#121212] p-1.5 sm:p-2 border border-[#ccd0d5] dark:border-[#333] rounded-[1px]">
            <span className="block text-[10px] text-neutral-500 uppercase font-mono font-bold">Total Omset</span>
            <span className="font-extrabold text-xs sm:text-sm text-black dark:text-white font-mono truncate block" title={formatRupiah(totalRevenue)}>
              {formatRupiah(totalRevenue)}
            </span>
          </div>
          <div className="bg-white dark:bg-[#121212] p-1.5 sm:p-2 border border-[#ccd0d5] dark:border-[#333] rounded-[1px]">
            <span className="block text-[10px] text-neutral-500 uppercase font-mono font-bold">Deadline Hari Ini</span>
            <span className="font-extrabold text-sm sm:text-base text-black dark:text-white font-mono">
              🎯 {deadlineProjects.length}
            </span>
          </div>
          <div className="bg-white dark:bg-[#121212] p-1.5 sm:p-2 border border-[#ccd0d5] dark:border-[#333] rounded-[1px]">
            <span className="block text-[10px] text-neutral-500 uppercase font-mono font-bold">Total Jam Kerja</span>
            <span className="font-extrabold text-sm sm:text-base text-black dark:text-white font-mono">
              ⏱️ {totalHours}j
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 border-b border-[#ccd0d5] dark:border-[#333333] bg-white dark:bg-[#141414] space-y-2 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center bg-white dark:bg-[#202020] border border-neutral-400 dark:border-neutral-600 rounded-[2px] overflow-hidden focus-within:border-black dark:focus-within:border-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
              <span className="pl-2.5 pr-1.5 text-neutral-500 shrink-0">
                <Search size={13} />
              </span>
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Cari proyek atau klien di tanggal ini..."
                className="w-full text-xs py-1.5 pr-2.5 bg-transparent text-black dark:text-white focus:outline-none"
              />
              {modalSearch && (
                <button
                  onClick={() => setModalSearch('')}
                  className="px-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2 py-1 rounded-[1px] border font-bold cursor-pointer transition-colors ${
                  activeTab === 'all'
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                }`}
              >
                Semua ({projects.length})
              </button>
              {deadlineProjects.length > 0 && (
                <button
                  onClick={() => setActiveTab('deadline')}
                  className={`px-2 py-1 rounded-[1px] border font-bold cursor-pointer transition-colors ${
                    activeTab === 'deadline'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  🎯 Deadline ({deadlineProjects.length})
                </button>
              )}
              {completedProjects.length > 0 && (
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-2 py-1 rounded-[1px] border font-bold cursor-pointer transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  Selesai ({completedProjects.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project List - Scrollable */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2.5 flex-1 bg-[#f0f2f5] dark:bg-[#0f0f0f]">
          {filteredList.length === 0 ? (
            <div className="py-10 text-center bg-white dark:bg-[#161616] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] p-6 space-y-2">
              <CalendarIcon size={32} className="mx-auto text-neutral-400 opacity-60" />
              <p className="text-xs font-bold text-black dark:text-white">
                {modalSearch 
                  ? 'Tidak ada proyek yang cocok dengan kata kunci pencarian.' 
                  : 'Tidak ada jadwal proyek atau deadline pada tanggal ini.'}
              </p>
              <p className="text-[11px] text-neutral-500">
                Pilih tanggal lain pada kalender untuk melihat jadwal proyek terkait.
              </p>
            </div>
          ) : (
            filteredList.map((p, idx) => {
              const isDeadline = isSameDay(new Date(p.end_date), date);
              const isStart = isSameDay(new Date(p.start_date), date);

              return (
                <div 
                  key={p.id || idx}
                  className="bg-white dark:bg-[#161616] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] p-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-black dark:hover:border-white transition-all space-y-2"
                >
                  {/* Card Header: Project Name & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-[#eceff5] dark:border-[#262626] pb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-bold text-xs sm:text-sm text-black dark:text-white leading-tight truncate">
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      {isDeadline && (
                        <span className="bg-black text-white dark:bg-white dark:text-black font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[1px] border border-black dark:border-white">
                          🎯 DEADLINE HARI INI
                        </span>
                      )}
                      {isStart && !isDeadline && (
                        <span className="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-[1px] border border-neutral-400">
                          🚀 MULAI HARI INI
                        </span>
                      )}
                      {getStatusBadge(p.status)}
                      {getPriorityBadge(p.priority)}
                    </div>
                  </div>

                  {/* Card Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                      <Briefcase size={12} className="text-neutral-500 shrink-0" />
                      <span className="truncate" title={p.client}>{p.client}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                      <DollarSign size={12} className="text-neutral-500 shrink-0" />
                      <span>{formatRupiah(p.revenue)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                      <Clock size={12} className="text-neutral-500 shrink-0" />
                      <span>{p.hours || 0} Jam Kerja</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate text-right">
                      {p.start_date} &rarr; {p.end_date}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white dark:bg-[#141414] border-t border-[#ccd0d5] dark:border-[#333333] px-3.5 py-2.5 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-neutral-500 font-mono">
            Menampilkan <span className="font-bold text-black dark:text-white">{filteredList.length}</span> dari {projects.length} proyek
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-[2px] border border-black shadow-[1px_1px_0px_#444] cursor-pointer transition-all active:translate-y-0.5"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}

export default function CalendarView() {
  const { state } = useDashboard();
  const { projects, theme } = state;
  const isDark = theme === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Map projects to dates (Start or End or In-between)
  const getProjectsForDay = (date) => {
    return projects.filter(p => {
      const pStart = new Date(p.start_date);
      const pEnd = new Date(p.end_date);
      return isSameDay(pStart, date) || isSameDay(pEnd, date) || (date >= pStart && date <= pEnd);
    });
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const selectedDayProjects = useMemo(() => {
    if (!selectedDay) return [];
    return getProjectsForDay(selectedDay);
  }, [selectedDay, projects]);

  return (
    <div className="bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
      
      {/* Retro Facebook Box Header */}
      <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <CalendarIcon size={15} className="text-black dark:text-white" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black dark:text-white">
            Kalender & Jadwal Proyek
          </h2>
          <span className="text-[10px] text-neutral-500 font-mono hidden sm:inline">
            (Klik tanggal untuk melihat rincian pop-up)
          </span>
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button 
            onClick={prevMonth} 
            className="p-1 sm:px-2 sm:py-1 bg-white dark:bg-[#252525] border border-neutral-400 dark:border-neutral-600 rounded-[2px] text-black dark:text-white text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer shadow-[1px_1px_0px_#ccc] dark:shadow-none"
            title="Bulan Sebelumnya"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="font-bold text-black dark:text-white text-xs min-w-[110px] text-center font-mono">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button 
            onClick={nextMonth} 
            className="p-1 sm:px-2 sm:py-1 bg-white dark:bg-[#252525] border border-neutral-400 dark:border-neutral-600 rounded-[2px] text-black dark:text-white text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer shadow-[1px_1px_0px_#ccc] dark:shadow-none"
            title="Bulan Berikutnya"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Responsive Calendar Body with Horizontal Scroll on Mobile */}
      <div className="p-3 sm:p-4 overflow-x-auto">
        <div className="min-w-[620px]">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5 border-b border-neutral-300 dark:border-neutral-700 pb-1.5">
            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
              <div key={day} className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider py-1 font-mono">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Fill empty days before month start */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[85px] sm:min-h-[100px] bg-neutral-100/50 dark:bg-neutral-900/30 rounded-[1px] border border-transparent"></div>
            ))}
            
            {/* Render actual days */}
            {daysInMonth.map((day, idx) => {
              const dayProjects = getProjectsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDayToday = isToday(day);
              const hasProjects = dayProjects.length > 0;
              
              return (
                <div 
                  key={idx} 
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[85px] sm:min-h-[100px] p-1.5 sm:p-2 rounded-[2px] border transition-all cursor-pointer group hover:border-black dark:hover:border-white hover:shadow-md ${
                    isCurrentDayToday 
                      ? 'bg-neutral-100 dark:bg-neutral-800 border-2 border-black dark:border-white shadow-xs' 
                      : isCurrentMonth
                        ? 'bg-white border-[#ccd0d5] dark:bg-[#181818] dark:border-[#333333]'
                        : 'bg-neutral-50 dark:bg-neutral-900/30 border-transparent text-neutral-400'
                  }`}
                  title={`Klik untuk melihat detail ${dayProjects.length} proyek pada tanggal ${format(day, 'd MMMM yyyy')}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[11px] font-bold font-mono transition-transform group-hover:scale-105 ${
                      isCurrentDayToday 
                        ? 'bg-black text-white dark:bg-white dark:text-black px-1 rounded-[1px]' 
                        : 'text-black dark:text-white'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    {hasProjects && (
                      <span 
                        className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full group-hover:scale-125 transition-transform" 
                        title={`${dayProjects.length} proyek`}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {dayProjects.slice(0, 2).map((p, pIdx) => {
                      const isEnd = isSameDay(new Date(p.end_date), day);
                      return (
                        <div 
                          key={`${p.id || pIdx}-${idx}`}
                          className={`text-[9px] px-1 py-0.5 rounded-[1px] truncate border font-medium transition-colors ${
                            isEnd 
                              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-bold'
                              : 'bg-neutral-100 text-black border-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700 group-hover:border-neutral-500'
                          }`}
                          title={`${p.name} (${p.client})`}
                        >
                          {isEnd ? '🎯 ' : ''}{p.name}
                        </div>
                      );
                    })}
                    {dayProjects.length > 2 && (
                      <div className="text-[9px] text-center text-neutral-500 dark:text-neutral-400 font-bold group-hover:text-black dark:group-hover:text-white transition-colors underline decoration-dotted">
                        +{dayProjects.length - 2} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pop Up Detail Modal Dialog */}
      <DayDetailModal
        isOpen={isModalOpen}
        date={selectedDay}
        projects={selectedDayProjects}
        onClose={handleCloseModal}
      />

    </div>
  );
}
