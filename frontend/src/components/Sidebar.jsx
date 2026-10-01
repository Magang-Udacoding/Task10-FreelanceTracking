import React, { useState } from 'react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Bell, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  FolderOpen,
  Users,
  X,
  User,
  ShieldCheck,
  Star,
  Search
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { state, dispatch, logout } = useDashboard();
  const { theme, user, projects, clients } = state;
  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';

  const [clientsCollapsed, setClientsCollapsed] = useState(false);
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const filteredClients = clients.filter(c => 
    c.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const activeMenu = state.activeView || 'Dashboard';

  const navigateToTableSection = () => {
    if (state.activeView !== 'Dashboard') {
      dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: 'Dashboard' });
    }
    setMobileOpen(false);

    // Smooth scroll to Daftar Tagihan & Proyek section
    setTimeout(() => {
      const el = document.getElementById('daftar-tagihan-proyek');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleSelectClient = (clientName) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: { client: clientName } });
    navigateToTableSection();
  };

  const handleSelectStatus = (statusValue) => {
    dispatch({ type: ACTIONS.SET_FILTER, payload: { status: statusValue } });
    navigateToTableSection();
  };

  const menuItems = [
    { name: 'Dashboard', label: 'Kabar Beranda', icon: <LayoutDashboard size={14} /> },
    { name: 'Calendar', label: 'Kalender & Jadwal', icon: <Calendar size={14} /> },
    { name: 'Notifications', label: 'Pemberitahuan', icon: <Bell size={14} /> },
    { name: 'Settings', label: 'Pengaturan Akun', icon: <Settings size={14} /> },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Retro Facebook Left Sidebar */}
      <aside 
        className={`w-64 md:w-56 lg:w-60 shrink-0 bg-white dark:bg-[#111111] text-[#1c1e21] dark:text-[#e4e6eb] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] p-3 flex flex-col justify-between transition-transform duration-200 no-print z-50 md:z-auto fixed md:static top-0 left-0 h-screen md:h-fit md:max-h-[calc(100vh-60px)] overflow-y-auto ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-3.5">
          
          {/* Mobile Drawer Close Header */}
          <div className="md:hidden flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 bg-black text-white dark:bg-white dark:text-black font-extrabold flex items-center justify-center text-xs rounded-[1px]">
                f
              </span>
              <span className="font-bold text-xs">Menu Navigasi</span>
            </div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Classic Facebook Profile Photo Box */}
          <div className="p-2 border border-[#ccd0d5] dark:border-[#333333] bg-[#f5f6f7] dark:bg-[#1a1a1a] rounded-[2px]">
            <div className="flex items-start gap-2.5">
              <div className="w-11 h-11 bg-black text-white dark:bg-white dark:text-black border border-neutral-400 flex items-center justify-center shrink-0 font-mono font-bold text-base rounded-[1px] shadow-[1px_1px_0px_#888]">
                <User size={20} />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-bold text-xs text-black dark:text-white truncate leading-tight">
                  {user?.username ? user.username.toUpperCase() : 'DEVELOPER'}
                </p>
                <span className="text-[10px] text-neutral-500 block truncate">
                  {user?.email || 'admin@example.com'}
                </span>
                <span className="inline-block mt-1 px-1.5 py-0.2 bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-[8px] sm:text-[9px] rounded-[1px]">
                  {isAdmin ? 'ADMINISTRATOR' : 'STAFF'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Segment */}
          <div>
            <div className="bg-[#e9ebee] dark:bg-[#222222] border-y border-[#ccd0d5] dark:border-[#333333] px-2 py-1 mb-1">
              <span className="text-[10px] uppercase font-bold text-[#4b4f56] dark:text-neutral-400 tracking-wider">
                Navigasi Utama
              </span>
            </div>
            
            <nav className="space-y-0.5">
              {menuItems.map((item) => {
                const isActive = item.name === activeMenu;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: item.name });
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold rounded-[2px] transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'bg-black text-white font-bold dark:bg-white dark:text-black shadow-[1px_1px_0px_#444]'
                        : 'hover:bg-[#f0f2f5] dark:hover:bg-[#222222] text-[#1c1e21] dark:text-neutral-300'
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Clients List (Classic "Teman / Halaman") */}
          <div>
            <button
              onClick={() => setClientsCollapsed(!clientsCollapsed)}
              className="w-full flex items-center justify-between bg-[#e9ebee] dark:bg-[#222222] border-y border-[#ccd0d5] dark:border-[#333333] px-2 py-1 text-[10px] uppercase font-bold text-[#4b4f56] dark:text-neutral-400 tracking-wider hover:bg-[#dfe3ee] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Users size={11} />
                <span>Daftar Klien ({clients.length})</span>
              </div>
              {clientsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
            </button>

            {!clientsCollapsed && (
              <div className="py-1">
                {/* Search Client Input */}
                <div className="px-1 mb-1">
                  <div className="relative flex items-center bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-700 rounded-[2px] overflow-hidden">
                    <span className="pl-1.5 pr-1 text-neutral-400">
                      <Search size={10} />
                    </span>
                    <input
                      type="text"
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Cari klien..."
                      className="w-full py-0.5 px-0.5 text-[11px] text-black dark:text-white bg-transparent focus:outline-none placeholder-neutral-400"
                    />
                    {clientSearch && (
                      <button
                        type="button"
                        onClick={() => setClientSearch('')}
                        className="pr-1.5 text-neutral-400 hover:text-black dark:hover:text-white text-[10px]"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
                  {/* All Clients Reset Button */}
                  <button
                    type="button"
                    onClick={() => handleSelectClient('all')}
                    className={`w-full text-left truncate text-xs py-1 px-2 rounded-[1px] transition-colors flex items-center justify-between group cursor-pointer ${
                      !state.filters.client || state.filters.client === 'all'
                        ? 'font-bold bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white'
                        : 'hover:bg-neutral-100 dark:hover:bg-[#222222] text-neutral-600 dark:text-neutral-400'
                    }`}
                    title="Tampilkan semua proyek mitra"
                  >
                    <span>Semua Klien</span>
                    <span className="text-[10px] font-mono text-neutral-400">{clients.length}</span>
                  </button>

                  {filteredClients.length > 0 ? (
                    filteredClients.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectClient(c)}
                        className={`w-full text-left truncate text-xs py-1 px-2 rounded-[1px] transition-colors flex items-center gap-1.5 group cursor-pointer ${
                          state.filters.client === c
                            ? 'font-bold bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white'
                            : 'hover:bg-neutral-100 dark:hover:bg-[#222222] text-black dark:text-neutral-200'
                        }`}
                        title={`Klik untuk melihat tagihan & proyek dari ${c}`}
                      >
                        <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-[1px] shrink-0" />
                        <span className="truncate group-hover:underline">{c}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-[10px] text-neutral-400 px-2 py-1 italic">
                      {clientSearch ? 'Klien tidak ditemukan' : 'Belum ada klien'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Filter Proyek Status */}
          <div>
            <button
              onClick={() => setProjectsCollapsed(!projectsCollapsed)}
              className="w-full flex items-center justify-between bg-[#e9ebee] dark:bg-[#222222] border-y border-[#ccd0d5] dark:border-[#333333] px-2 py-1 text-[10px] uppercase font-bold text-[#4b4f56] dark:text-neutral-400 tracking-wider hover:bg-[#dfe3ee] dark:hover:bg-[#2a2a2a] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <FolderOpen size={11} />
                <span>Status Proyek</span>
              </div>
              {projectsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
            </button>

            {!projectsCollapsed && (
              <div className="py-1 space-y-0.5">
                {[
                  { label: 'Semua Status', value: 'all' },
                  { label: 'Selesai', value: 'completed' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Ditangguhkan', value: 'on-hold' },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => handleSelectStatus(s.value)}
                    className={`w-full text-left text-xs py-1 px-2 rounded-[1px] transition-colors cursor-pointer flex items-center justify-between ${
                      (state.filters.status || 'all') === s.value 
                        ? 'font-bold bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' 
                        : 'hover:bg-neutral-100 dark:hover:bg-[#222222] text-neutral-600 dark:text-neutral-300'
                    }`}
                    title={`Lihat tagihan & proyek berstatus ${s.label}`}
                  >
                    <span>{s.label}</span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {s.value === 'all' 
                        ? projects.length 
                        : projects.filter(p => p.status === s.value).length}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Section: Logout Button */}
        <div className="pt-3 border-t border-neutral-300 dark:border-neutral-800 mt-3">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-black dark:text-white border border-neutral-400 dark:border-neutral-700 text-xs font-bold rounded-[2px] transition-all cursor-pointer shadow-[1px_1px_0px_#ccc] dark:shadow-none"
          >
            <LogOut size={13} />
            Keluar Akun
          </button>
          
          <div className="mt-2 text-center text-[9px] text-neutral-400 font-mono">
            Freelancebook &copy; 2026 Retro
          </div>
        </div>

      </aside>
    </>
  );
}
