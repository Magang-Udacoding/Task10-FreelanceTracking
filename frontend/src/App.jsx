import React, { useState, Suspense, useCallback } from 'react';
import { useDashboard } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import Achievements from './components/Achievements';
import InvoiceTable from './components/table/InvoiceTable';
import Login from './components/Login';
import SkeletonLoader from './components/SkeletonLoader';
import AddProjectModal from './components/AddProjectModal';
import CalendarView from './components/views/CalendarView';
import SettingsView from './components/views/SettingsView';
import NotificationsView from './components/views/NotificationsView';
import ToastNotification from './components/ToastNotification';

// Lazy loading all charts
const OmsetHarianBarChart = React.lazy(() => import('./components/charts/OmsetHarianBarChart'));
const TrendMingguanLineChart = React.lazy(() => import('./components/charts/TrendMingguanLineChart'));
const ClientDonutChart = React.lazy(() => import('./components/charts/ClientDonutChart'));
const SkillsRadarChart = React.lazy(() => import('./components/charts/SkillsRadarChart'));

function DashboardContent() {
  const { state } = useDashboard();
  const { loading, dailyChart, target, weeklyChart, clientChart, theme, projects, user } = state;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleOpenAddModal = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-200">
      
      {/* 1. Classic Full-Width Facebook Black Top Navbar */}
      <Navbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* 2. Classic Facebook Content Wrapper */}
      <div className="w-full max-w-[1550px] mx-auto flex flex-col md:flex-row p-2.5 sm:p-3.5 md:p-4 gap-3 md:gap-4 items-start">
        
        {/* Left Column: Classic Facebook Navigation & Profile Box */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Center Main Content Area */}
        <main className="flex-1 min-w-0 w-full space-y-3 sm:space-y-4">
          
          {/* Classic Facebook Status Box ("Apa yang Anda pikirkan?") */}
          <div className="bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-black text-white dark:bg-white dark:text-black font-extrabold flex items-center justify-center rounded-[2px] text-xs font-mono shrink-0">
                f
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs sm:text-sm text-black dark:text-white leading-tight truncate">
                  Selamat Datang di Beranda, {user?.username || 'Admin'}!
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  Pantau omset, grafik mingguan, dan data proyek freelance Anda secara real-time.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenAddModal}
                className="fb-btn-primary w-full sm:w-auto text-center"
              >
                + Buat Tagihan Baru
              </button>
            </div>
          </div>

          {/* Dynamic Module Content */}
          {loading ? (
            <>
              <SkeletonLoader type="stats" />
              <SkeletonLoader type="charts" />
              <SkeletonLoader type="table" />
            </>
          ) : (
            <>
              {state.activeView === 'Dashboard' && (
                <>
                  {/* 1. Statistics Cards (Classic Wall Info Boxes) */}
                  <StatsGrid />

                  {/* 2. 4 Analytical Charts in Classic Facebook Widget Boxes */}
                  <Suspense fallback={<SkeletonLoader type="charts" />}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 select-none">
                      
                      {/* Chart 1: Omset Harian (Bar Chart) - 8 Cols */}
                      <div className="lg:col-span-8 bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex flex-col">
                        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
                          <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wider">Omset Harian Proyek</h4>
                            <p className="text-[10px] text-neutral-500">Distribusi omset per hari berdasarkan status proyek</p>
                          </div>
                          <span className="px-1.5 py-0.5 border border-black dark:border-white font-mono text-[9px] font-bold uppercase rounded-[1px]">
                            Bar Chart
                          </span>
                        </div>
                        <div className="p-3">
                          <OmsetHarianBarChart data={dailyChart} theme={theme} />
                        </div>
                      </div>

                      {/* Chart 3: Distribusi Klien (Donut Chart) - 4 Cols */}
                      <div className="lg:col-span-4 bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex flex-col">
                        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
                          <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wider">Distribusi Klien</h4>
                            <p className="text-[10px] text-neutral-500">Pangsa omset per mitra kerja</p>
                          </div>
                          <span className="px-1.5 py-0.5 border border-black dark:border-white font-mono text-[9px] font-bold uppercase rounded-[1px]">
                            Donut Chart
                          </span>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <ClientDonutChart data={clientChart} theme={theme} />
                        </div>
                      </div>

                      {/* Chart 2: Trend Mingguan (Line Chart) - 8 Cols */}
                      <div className="lg:col-span-8 bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex flex-col">
                        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
                          <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wider">Trend Pendapatan Harian (30 Hari)</h4>
                            <p className="text-[10px] text-neutral-500">Kurva Bezier Aktual vs Target Omset</p>
                          </div>
                          <span className="px-1.5 py-0.5 border border-black dark:border-white font-mono text-[9px] font-bold uppercase rounded-[1px]">
                            Line Chart
                          </span>
                        </div>
                        <div className="p-3">
                          <TrendMingguanLineChart data={weeklyChart} target={target} theme={theme} />
                        </div>
                      </div>

                      {/* Chart 4: Radar Distribusi Proyek - 4 Cols */}
                      <div className="lg:col-span-4 bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] flex flex-col">
                        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 flex items-center justify-between text-black dark:text-white">
                          <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wider">Keahlian Teknis Developer</h4>
                            <p className="text-[10px] text-neutral-500">6 Tingkat Kemampuan Rekayasa Perangkat Lunak</p>
                          </div>
                          <span className="px-1.5 py-0.5 border border-black dark:border-white font-mono text-[9px] font-bold uppercase rounded-[1px]">
                            Radar Chart
                          </span>
                        </div>
                        <div className="p-3">
                          <SkillsRadarChart projects={projects} theme={theme} />
                        </div>
                      </div>

                    </div>
                  </Suspense>

                  {/* 3. Bottom Layout: Data Table (8 Cols) & Right Achievements (4 Cols) */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 items-start">
                    
                    {/* Invoice Data Grid (8 Cols) */}
                    <div id="daftar-tagihan-proyek" className="xl:col-span-8 scroll-mt-14">
                      <InvoiceTable />
                    </div>

                    {/* Achievements Sidebar (4 Cols) */}
                    <div className="xl:col-span-4">
                      <Achievements onOpenAddModal={handleOpenAddModal} />
                    </div>

                  </div>
                </>
              )}

              {state.activeView === 'Calendar' && <CalendarView />}
              {state.activeView === 'Settings' && <SettingsView />}
              {state.activeView === 'Notifications' && <NotificationsView />}
            </>
          )}

        </main>
      </div>

      {/* Add Project Modal Dialog */}
      <AddProjectModal isOpen={addModalOpen} onClose={handleCloseAddModal} />
    </div>
  );
}

export default function App() {
  const { state } = useDashboard();
  
  return (
    <>
      <ToastNotification />
      {!state.user ? <Login /> : <DashboardContent />}
    </>
  );
}
