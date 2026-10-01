import React, { useState, useEffect } from 'react';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';
import { Settings, User, Palette, Database, Save, Shield, Users } from 'lucide-react';

function UserManagementTab() {
  const { state, dispatch } = useDashboard();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const url = state.activeBackendUrl || import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${url}/api/get_users.php`, { credentials: 'include' });
      const result = await response.json();
      if (result.success) {
        setUsersList(result.users);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [state.activeBackendUrl]);

  const handleRoleChange = async (userId, newRole) => {
    const url = state.activeBackendUrl || import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await fetch(`${url}/api/update_role.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, new_role: newRole }),
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '✅ Role berhasil diperbarui' } });
        fetchUsers();
      } else {
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: `⚠️ Gagal: ${result.message}` } });
      }
    } catch (err) {
      dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '⚠️ Gagal terhubung ke server' } });
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wider">
          Manajemen Pengguna
        </h3>
        <p className="text-[11px] text-neutral-500 mt-0.5">Ubah hak akses role untuk staf atau administrator.</p>
      </div>

      <div className="border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] overflow-x-auto shadow-xs">
        {loadingUsers ? (
          <div className="p-6 text-center text-xs text-neutral-500">Memuat pengguna...</div>
        ) : (
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-[#eceff5] dark:bg-[#1c1c1c] text-[10px] uppercase font-bold text-black dark:text-white border-b border-[#ccd0d5] dark:border-[#333333]">
              <tr>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Role Saat Ini</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceff5] dark:divide-[#252525]">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-[#1a1a1a] transition-colors">
                  <td className="px-3 py-2.5 font-bold text-black dark:text-white">{u.username}</td>
                  <td className="px-3 py-2.5 text-neutral-600 dark:text-neutral-400 font-mono text-[11px]">{u.email}</td>
                  <td className="px-3 py-2.5">
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-[1px] border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    {u.id !== state.user?.id ? (
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs bg-white dark:bg-[#1e1e1e] border border-neutral-400 dark:border-neutral-600 rounded-[1px] px-2 py-1 text-black dark:text-white font-bold"
                      >
                        <option value="staff">Jadikan Staff</option>
                        <option value="admin">Jadikan Admin</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">Akun Anda</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function SettingsView() {
  const { state, dispatch } = useDashboard();
  const { user, target, theme, activeBackendUrl } = state;

  const [localTarget, setLocalTarget] = useState(target);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const isDark = theme === 'dark';

  const handleSave = async () => {
    setIsSaving(true);
    const url = activeBackendUrl || import.meta.env.VITE_BACKEND_URL;
    
    if (localTarget !== target && user?.role === 'admin') {
      try {
        const response = await fetch(`${url}/api/update_settings.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ target_bulanan: Number(localTarget) }),
          credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
          dispatch({
            type: ACTIONS.SET_DATA,
            payload: { ...state, target: Number(localTarget) }
          });
          dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '💾 Pengaturan berhasil disimpan ke database!' } });
        } else {
          dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: `⚠️ Gagal menyimpan: ${result.message}` } });
        }
      } catch (err) {
        console.error('Failed to update target:', err);
        // Fallback local save in case backend is offline
        dispatch({
          type: ACTIONS.SET_DATA,
          payload: { ...state, target: Number(localTarget) }
        });
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '💾 Pengaturan disimpan lokal (Koneksi offline)' } });
      }
    } else if (user?.role !== 'admin') {
      dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '⚠️ Akses ditolak. Hanya Admin yang dapat mengubah target.' } });
    }
    setIsSaving(false);
  };

  const navItems = [
    { id: 'profile', label: 'Profil Akun', icon: <User size={14} /> },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'Manajemen Pengguna', icon: <Shield size={14} /> }] : []),
    { id: 'app', label: 'Target & KPI', icon: <Settings size={14} /> },
    { id: 'appearance', label: 'Tampilan', icon: <Palette size={14} /> },
    { id: 'system', label: 'Sistem & Database', icon: <Database size={14} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start">
      {/* Settings Left Navigation Sidebar */}
      <div className="w-full md:w-56 shrink-0 bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-black dark:text-white">
          Menu Pengaturan
        </div>
        
        <nav className="p-1 space-y-0.5">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[1px] text-xs font-semibold text-left transition-colors cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-black text-white font-bold dark:bg-white dark:text-black shadow-[1px_1px_0px_#444]' 
                  : 'hover:bg-neutral-100 dark:hover:bg-[#202020] text-black dark:text-neutral-300'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content Area Box */}
      <div className="flex-1 w-full bg-white dark:bg-[#121212] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b border-[#ccd0d5] dark:border-[#333333] px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-black dark:text-white">
          Rincian Konfigurasi
        </div>

        <div className="p-3.5 sm:p-5">
          {activeTab === 'profile' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wide">
                  Profil Pengguna
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Informasi rincian akun Anda.</p>
              </div>
              <div className="space-y-3 font-sans">
                <div>
                  <label className="block text-[11px] font-bold text-black dark:text-white mb-1 uppercase tracking-wider">
                    Username
                  </label>
                  <input 
                    type="text" 
                    disabled 
                    value={user?.username || ''} 
                    className="block w-full px-3 py-1.5 border border-[#ccd0d5] dark:border-[#444] rounded-[1px] text-xs bg-neutral-100 dark:bg-[#202020] text-black dark:text-white font-mono opacity-80" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-black dark:text-white mb-1 uppercase tracking-wider">
                    Email
                  </label>
                  <input 
                    type="email" 
                    disabled 
                    value={user?.email || ''} 
                    className="block w-full px-3 py-1.5 border border-[#ccd0d5] dark:border-[#444] rounded-[1px] text-xs bg-neutral-100 dark:bg-[#202020] text-black dark:text-white font-mono opacity-80" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-black dark:text-white mb-1 uppercase tracking-wider">
                    Role Hak Akses
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase rounded-[1px] border border-black dark:border-white bg-black dark:bg-white text-white dark:text-black">
                      {user?.role || 'Staff'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && user?.role === 'admin' && (
            <UserManagementTab />
          )}

          {activeTab === 'app' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wide">
                  Pengaturan Target Omset
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Sesuaikan target pencapaian KPI bulanan Anda.</p>
              </div>
              <div className="space-y-3 font-sans">
                <div>
                  <label className="block text-[11px] font-bold text-black dark:text-white mb-1 uppercase tracking-wider">
                    Target Bulanan (Rp)
                  </label>
                  <input 
                    type="number" 
                    disabled={user?.role !== 'admin'}
                    value={localTarget} 
                    onChange={(e) => setLocalTarget(e.target.value)}
                    className="block w-full px-3 py-1.5 border border-neutral-400 dark:border-neutral-600 rounded-[1px] text-xs bg-white dark:bg-[#202020] text-black dark:text-white font-mono disabled:opacity-50" 
                  />
                  {user?.role !== 'admin' && <p className="text-[10px] text-neutral-500 mt-1">Hanya Admin yang dapat mengubah target.</p>}
                </div>
              </div>
              <button 
                onClick={handleSave}
                disabled={isSaving || user?.role !== 'admin'}
                className="fb-btn-primary flex items-center gap-1.5"
              >
                <Save size={13} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wide">
                  Tampilan Antarmuka
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Sesuaikan gaya visual monokrom hitam putih.</p>
              </div>
              <div className="flex items-center justify-between p-3 border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] bg-neutral-50 dark:bg-[#181818]">
                <div>
                  <p className="font-bold text-xs text-black dark:text-white">Mode Kontras Tinggi</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Beralih antara Putih (Light) dan Hitam (Dark)</p>
                </div>
                <button
                  onClick={() => dispatch({ type: ACTIONS.TOGGLE_THEME })}
                  className="fb-btn-secondary"
                >
                  {isDark ? 'Ganti ke Putih' : 'Ganti ke Hitam'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wide">
                  Sistem & Database
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">Status koneksi backend PHP/MySQL (XAMPP).</p>
              </div>
              <div className="p-3 border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] bg-neutral-50 dark:bg-[#181818] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full"></div>
                  <p className="font-bold text-xs text-black dark:text-white">
                    {activeBackendUrl ? 'Terkoneksi ke XAMPP MySQL' : 'Mode Offline (Mock Data 52 Proyek Aktif)'}
                  </p>
                </div>
                <p className="text-[11px] text-neutral-500">Endpoint Backend Saat Ini:</p>
                <code className="text-xs block p-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black font-mono text-black dark:text-white overflow-hidden text-ellipsis rounded-[1px]">
                  {activeBackendUrl || 'Menunggu koneksi http://localhost/task%2010/backend'}
                </code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
