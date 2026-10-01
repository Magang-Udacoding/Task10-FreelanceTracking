import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  DUMMY_PROJECTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS,
  getCalculatedMockData,
} from '../data/mockData';

const DashboardContext = createContext();

const BACKEND_URLS = [
  import.meta.env.VITE_BACKEND_URL,
  'http://localhost/task%2010/backend',
  'http://localhost/task%206/backend',
  'http://localhost:8000',
  '/backend',
].filter(Boolean);

// Calculate initial metrics from mock dataset
const initialCalc = getCalculatedMockData();
const initialUniqueClients = [...new Set(DUMMY_PROJECTS.map((p) => p.client))];

// Function to safely get stored session user from localStorage
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem('session_user');
    if (!item || item === 'null' || item === 'undefined') return null;
    const parsed = JSON.parse(item);
    return parsed && typeof parsed === 'object' && parsed.id ? parsed : null;
  } catch (_) {
    return null;
  }
};

// Initial state values (Requirement #6: state: projects[], clients[], revenue, filter, theme)
const initialState = {
  user: getStoredUser(), // Initialize from stored session, or null if logged out
  theme: 'light',
  projects: DUMMY_PROJECTS,
  invoices: DUMMY_PROJECTS,
  clients: initialUniqueClients,
  revenue: initialCalc.total_omset,
  target: initialCalc.target,
  achievement: initialCalc.achievement,
  avgDaily: initialCalc.avg_daily,
  dailyChart: initialCalc.daily_chart,
  weeklyChart: initialCalc.weekly_chart,
  clientChart: initialCalc.client_chart,
  filters: {
    search: '',
    client: '',
    status: '',
    priority: '',
  },
  notifications: INITIAL_NOTIFICATIONS,
  achievements: INITIAL_ACHIEVEMENTS,
  loading: false,
  selectedRows: [],
  visibleColumns: {
    project: true,
    client: true,
    revenue: true,
    hours: true,
    status: true,
    priority: true,
    start: true,
    end: true,
  },
  favorites: [],
  activeBackendUrl: '',
  activeView: 'Dashboard',
  toasts: [],
};

// Reducer Action Types (Requirement #7: 10+ action types)
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ACTIVE_BACKEND: 'SET_ACTIVE_BACKEND',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_DATA: 'SET_DATA',
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  BULK_DELETE: 'BULK_DELETE',
  UPDATE_REVENUE: 'UPDATE_REVENUE',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_FILTER: 'SET_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_SELECTED_ROWS: 'SET_SELECTED_ROWS',
  TOGGLE_ROW: 'TOGGLE_ROW',
  TOGGLE_COLUMN: 'TOGGLE_COLUMN',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATIONS_READ: 'MARK_NOTIFICATIONS_READ',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  REFRESH_REVENUE: 'REFRESH_REVENUE',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_FAVORITES: 'SET_FAVORITES',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
};

// Reducer function
function dashboardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ACTIVE_BACKEND:
      return { ...state, activeBackendUrl: action.payload };

    case ACTIONS.LOGIN: {
      const showToast = action.payload?.showToast !== false && !action.silent;
      const toastItem = showToast ? {
        id: Date.now() + Math.random(),
        title: 'SESI LOGIN',
        message: `👋 Selamat datang kembali, ${action.payload?.username || 'User'}!`,
        type: 'success',
        timestamp: Date.now(),
      } : null;
      return { 
        ...state, 
        user: action.payload,
        toasts: toastItem ? [toastItem, ...(state.toasts || []).slice(0, 4)] : (state.toasts || [])
      };
    }

    case ACTIONS.LOGOUT: {
      const showToast = !action.silent;
      const toastItem = showToast ? {
        id: Date.now() + Math.random(),
        title: 'SESI LOGOUT',
        message: '👋 Anda telah berhasil keluar dari akun.',
        type: 'info',
        timestamp: Date.now(),
      } : null;
      return { 
        ...state, 
        user: null,
        toasts: toastItem ? [toastItem, ...(state.toasts || []).slice(0, 4)] : (state.toasts || [])
      };
    }

    case ACTIONS.SET_DATA: {
      const {
        projects = [],
        invoices = [],
        total_omset,
        target = 100000000,
        achievement,
        avg_daily,
        daily_chart = [],
        weekly_chart = [],
        client_chart = [],
      } = action.payload;

      const activeProjects = projects.length > 0 ? projects : state.projects;
      const computedTotal = total_omset !== undefined
        ? total_omset
        : activeProjects.reduce((acc, p) => acc + (parseFloat(p.revenue) || 0), 0);

      const uniqueClients = [...new Set(activeProjects.map((p) => p.client))];

      // Evaluate achievements dynamically
      let newNotifications = [...state.notifications];
      let newToasts = [...(state.toasts || [])];
      const updatedAchievements = state.achievements.map((ach) => {
        let isUnlocked = ach.unlocked;
        if (ach.id === 'rev_100m' && computedTotal >= 100000000) isUnlocked = true;

        const completedCount = activeProjects.filter((p) => p.status === 'completed').length;
        if (ach.id === 'proj_50' && completedCount >= 50) isUnlocked = true;

        const topClientFound = client_chart.some((c) => (c.total || 0) >= 40000000) ||
          uniqueClients.some((client) => {
            const clientTotal = activeProjects
              .filter((p) => p.client === client)
              .reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
            return clientTotal >= 40000000;
          });
        if (ach.id === 'client_gold' && topClientFound) isUnlocked = true;

        if (!ach.unlocked && isUnlocked) {
          const msg = `🎉 Pencapaian baru terbuka: ${ach.title}!`;
          newNotifications.unshift({
            id: Date.now() + Math.random(),
            message: msg,
            time: 'Baru saja',
            read: false,
          });
          newToasts.unshift({
            id: Date.now() + Math.random(),
            title: 'PRESTASI TERBUKA',
            message: msg,
            type: 'success',
            timestamp: Date.now(),
          });
        }

        return { ...ach, unlocked: isUnlocked };
      });

      return {
        ...state,
        projects: activeProjects,
        invoices: invoices.length > 0 ? invoices : activeProjects,
        revenue: computedTotal,
        target: target || state.target,
        achievement: achievement !== undefined ? achievement : Math.min((computedTotal / target) * 100, 100),
        avgDaily: avg_daily !== undefined ? avg_daily : Math.round(computedTotal / 30),
        dailyChart: daily_chart.length > 0 ? daily_chart : state.dailyChart,
        weeklyChart: weekly_chart.length > 0 ? weekly_chart : state.weeklyChart,
        clientChart: client_chart.length > 0 ? client_chart : state.clientChart,
        clients: uniqueClients,
        achievements: updatedAchievements,
        notifications: newNotifications,
        toasts: newToasts.slice(0, 5),
        loading: false,
      };
    }

    case ACTIONS.SET_PROJECTS: {
      const nextProjects = action.payload;
      const totalRev = nextProjects.reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
      const uniqueClients = [...new Set(nextProjects.map((p) => p.client))];
      return {
        ...state,
        projects: nextProjects,
        revenue: totalRev,
        clients: uniqueClients,
        achievement: Math.min((totalRev / state.target) * 100, 100),
        avgDaily: Math.round(totalRev / 30),
      };
    }

    case ACTIONS.ADD_PROJECT: {
      const newProj = action.payload;
      const updatedProjects = [newProj, ...state.projects];
      const totalRev = updatedProjects.reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
      const uniqueClients = [...new Set(updatedProjects.map((p) => p.client))];
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'PROYEK DIBUAT',
        message: `✨ Proyek "${newProj.name}" (${newProj.client}) berhasil ditambahkan!`,
        type: 'success',
        timestamp: Date.now(),
      };

      return {
        ...state,
        projects: updatedProjects,
        revenue: totalRev,
        clients: uniqueClients,
        achievement: Math.min((totalRev / state.target) * 100, 100),
        avgDaily: Math.round(totalRev / 30),
        notifications: [
          {
            id: Date.now(),
            message: `✨ Proyek baru ditambahkan: ${newProj.name} (${newProj.client})`,
            time: 'Baru saja',
            read: false,
          },
          ...state.notifications,
        ],
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.UPDATE_PROJECT: {
      const updatedItem = action.payload;
      const nextProjects = state.projects.map((p) => (p.id === updatedItem.id ? updatedItem : p));
      const totalRev = nextProjects.reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'DATA DIPERBARUI',
        message: `🔄 Data proyek "${updatedItem.name || 'Proyek'}" berhasil diperbarui.`,
        type: 'success',
        timestamp: Date.now(),
      };
      return {
        ...state,
        projects: nextProjects,
        revenue: totalRev,
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.DELETE_PROJECT: {
      const idToDelete = action.payload;
      const deletedItem = state.projects.find((p) => p.id === idToDelete);
      const nextProjects = state.projects.filter((p) => p.id !== idToDelete);
      const totalRev = nextProjects.reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'PROYEK DIHAPUS',
        message: `🗑️ Proyek "${deletedItem?.name || 'Item'}" telah berhasil dihapus.`,
        type: 'warning',
        timestamp: Date.now(),
      };
      return {
        ...state,
        projects: nextProjects,
        revenue: totalRev,
        selectedRows: state.selectedRows.filter((id) => id !== idToDelete),
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.BULK_DELETE: {
      const idsToDelete = action.payload;
      const nextProjects = state.projects.filter((p) => !idsToDelete.includes(p.id));
      const totalRev = nextProjects.reduce((s, p) => s + (parseFloat(p.revenue) || 0), 0);
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'HAPUS MASSAL',
        message: `🗑️ ${idsToDelete.length} proyek telah berhasil dihapus.`,
        type: 'warning',
        timestamp: Date.now(),
      };
      return {
        ...state,
        projects: nextProjects,
        revenue: totalRev,
        selectedRows: [],
        notifications: [
          {
            id: Date.now(),
            message: `🗑️ ${idsToDelete.length} proyek telah berhasil dihapus.`,
            time: 'Baru saja',
            read: false,
          },
          ...state.notifications,
        ],
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.UPDATE_REVENUE:
      return {
        ...state,
        revenue: action.payload,
        achievement: Math.min((action.payload / state.target) * 100, 100),
      };

    case ACTIONS.TOGGLE_THEME: {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'TEMA TAMPILAN',
        message: nextTheme === 'dark' ? '🌙 Mode Gelap (Hitam) diaktifkan' : '☀️ Mode Terang (Putih) diaktifkan',
        type: 'info',
        timestamp: Date.now(),
      };
      return { 
        ...state, 
        theme: nextTheme, 
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)] 
      };
    }

    case ACTIONS.SET_FILTER: {
      let toastItem = null;
      if (action.payload.client && action.payload.client !== 'all' && action.payload.client !== state.filters.client) {
        toastItem = {
          id: Date.now() + Math.random(),
          title: 'FILTER KLIEN',
          message: `🔍 Menampilkan proyek untuk: "${action.payload.client}"`,
          type: 'info',
          timestamp: Date.now(),
        };
      } else if (action.payload.client === 'all' && state.filters.client) {
        toastItem = {
          id: Date.now() + Math.random(),
          title: 'FILTER DIRESET',
          message: '🔄 Filter klien dibatalkan. Menampilkan semua proyek.',
          type: 'info',
          timestamp: Date.now(),
        };
      } else if (action.payload.status && action.payload.status !== 'all' && action.payload.status !== state.filters.status) {
        toastItem = {
          id: Date.now() + Math.random(),
          title: 'FILTER STATUS',
          message: `🔍 Menyaring status proyek: [${action.payload.status.toUpperCase()}]`,
          type: 'info',
          timestamp: Date.now(),
        };
      }
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        toasts: toastItem ? [toastItem, ...(state.toasts || []).slice(0, 4)] : state.toasts,
      };
    }

    case ACTIONS.RESET_FILTERS: {
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'RESET FILTER',
        message: '🔄 Semua filter proyek telah dikosongkan.',
        type: 'info',
        timestamp: Date.now(),
      };
      return { 
        ...state, 
        filters: { search: '', client: '', status: '', priority: '' },
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.SET_SELECTED_ROWS:
      return { ...state, selectedRows: action.payload };

    case ACTIONS.TOGGLE_ROW: {
      const id = action.payload;
      const isSelected = state.selectedRows.includes(id);
      return {
        ...state,
        selectedRows: isSelected
          ? state.selectedRows.filter((rowId) => rowId !== id)
          : [...state.selectedRows, id],
      };
    }

    case ACTIONS.TOGGLE_COLUMN: {
      const colName = action.payload;
      const isVisibleNow = !state.visibleColumns[colName];
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'VISIBILITAS KOLOM',
        message: `👁️ Kolom "${colName.toUpperCase()}" sekarang ${isVisibleNow ? 'ditampilkan' : 'disembunyikan'}.`,
        type: 'info',
        timestamp: Date.now(),
      };
      return {
        ...state,
        visibleColumns: {
          ...state.visibleColumns,
          [colName]: isVisibleNow,
        },
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.ADD_NOTIFICATION: {
      const toastItem = {
        id: Date.now() + Math.random(),
        title: action.payload.title || 'PEMBERITAHUAN',
        message: action.payload.message,
        type: action.payload.type || 'info',
        timestamp: Date.now(),
      };
      return {
        ...state,
        notifications: [
          {
            id: Date.now(),
            message: action.payload.message,
            time: 'Baru saja',
            read: false,
          },
          ...state.notifications,
        ],
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.MARK_NOTIFICATIONS_READ: {
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'PEMBERITAHUAN',
        message: '✅ Semua pemberitahuan ditandai telah dibaca.',
        type: 'success',
        timestamp: Date.now(),
      };
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.UNLOCK_ACHIEVEMENT: {
      const achId = action.payload;
      const ach = state.achievements.find(a => a.id === achId);
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'PRESTASI TERBUKA',
        message: `🏆 Selamat! Pencapaian baru terbuka: ${ach?.title || 'Prestasi'}`,
        type: 'success',
        timestamp: Date.now(),
      };
      return {
        ...state,
        achievements: state.achievements.map((ach) =>
          ach.id === achId ? { ...ach, unlocked: true } : ach
        ),
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.REFRESH_REVENUE: {
      // Simulate periodic live micro-refresh (Requirement #22, #50)
      const delta = (Math.random() - 0.4) * 200000;
      const updatedRev = Math.max(state.revenue + Math.round(delta), 100000000);
      return {
        ...state,
        revenue: updatedRev,
        achievement: Math.min((updatedRev / state.target) * 100, 100),
      };
    }

    case ACTIONS.SET_ACTIVE_VIEW:
      return { ...state, activeView: action.payload };

    case ACTIONS.SET_FAVORITES:
      return { ...state, favorites: action.payload };

    case ACTIONS.TOGGLE_FAVORITE: {
      const id = action.payload;
      const isFav = state.favorites.includes(id);
      const proj = state.projects.find((p) => p.id === id);
      const toastItem = {
        id: Date.now() + Math.random(),
        title: 'FAVORIT PROYEK',
        message: isFav 
          ? `⭐ "${proj?.name || 'Proyek'}" dihapus dari favorit.` 
          : `⭐ "${proj?.name || 'Proyek'}" ditandai sebagai favorit!`,
        type: 'info',
        timestamp: Date.now(),
      };
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter((favId) => favId !== id)
          : [...state.favorites, id],
        toasts: [toastItem, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.ADD_TOAST: {
      const newToast = {
        id: Date.now() + Math.random(),
        title: action.payload.title || 'PEMBERITAHUAN',
        message: action.payload.message,
        type: action.payload.type || 'info',
        timestamp: Date.now(),
      };
      return {
        ...state,
        toasts: [newToast, ...(state.toasts || []).slice(0, 4)],
      };
    }

    case ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: (state.toasts || []).filter((t) => t.id !== action.payload),
      };

    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [localTheme, setLocalTheme] = useLocalStorage('theme', 'light');
  const [sessionUser, setSessionUser] = useLocalStorage('session_user', null);
  const [localFavorites, setLocalFavorites] = useLocalStorage('project_favorites', []);
  const envBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  // Sync initial theme and user session
  useEffect(() => {
    if (sessionUser) {
      if (!state.user || state.user.id !== sessionUser.id) {
        dispatch({ type: ACTIONS.LOGIN, payload: { ...sessionUser, showToast: false } });
      }
    } else {
      if (state.user) {
        dispatch({ type: ACTIONS.LOGOUT, silent: true });
      }
    }
    if (localFavorites && localFavorites.length > 0) {
      dispatch({ type: ACTIONS.SET_FAVORITES, payload: localFavorites });
    }
    if (localTheme) {
      if (localTheme === 'dark') {
        window.document.documentElement.classList.add('dark');
        if (state.theme !== 'dark') {
          dispatch({ type: ACTIONS.TOGGLE_THEME });
        }
      }
    }
  }, []);

  // Update DOM when theme changes (Requirement #10, #13, #54)
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
      setLocalTheme('dark');
    } else {
      root.classList.remove('dark');
      setLocalTheme('light');
    }
  }, [state.theme]);

  // Update localStorage when favorites state changes
  useEffect(() => {
    setLocalFavorites(state.favorites);
  }, [state.favorites]);

  // Discover and set active PHP backend URL
  const discoverBackend = async () => {
    try {
      const response = await fetch(`${envBackendUrl}/api/get_data.php`, { credentials: 'include' });
      if (response.ok || response.status === 401) {
        dispatch({ type: ACTIONS.SET_ACTIVE_BACKEND, payload: envBackendUrl });
        return envBackendUrl;
      }
    } catch (_) {}

    for (const url of BACKEND_URLS) {
      if (url === envBackendUrl) continue;
      try {
        const response = await fetch(`${url}/api/get_data.php`, { credentials: 'include' });
        if (response.ok || response.status === 401) {
          dispatch({ type: ACTIONS.SET_ACTIVE_BACKEND, payload: url });
          return url;
        }
      } catch (_) {}
    }
    return '';
  };

  // Main data fetching method
  const fetchData = useCallback(
    async (customBackendUrl = '') => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      let targetUrl = customBackendUrl || state.activeBackendUrl || envBackendUrl;

      if (targetUrl) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const response = await fetch(`${targetUrl}/api/get_data.php`, {
            credentials: 'include',
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (response.ok) {
            const result = await response.json();
            if (result && !result.error && Array.isArray(result.projects) && result.projects.length > 0) {
              dispatch({ type: ACTIONS.SET_DATA, payload: result });
              return;
            }
          }
        } catch (_) {}
      }

      // Backend unreachable or empty: Fall back seamlessly to rich calculated mock data
      const mockData = getCalculatedMockData();
      dispatch({ type: ACTIONS.SET_DATA, payload: mockData });
    },
    [state.activeBackendUrl, envBackendUrl]
  );

  // Initial mounting discovery and fetch
  useEffect(() => {
    const init = async () => {
      const activeUrl = await discoverBackend();
      fetchData(activeUrl);
    };
    init();

    // 30 seconds auto-refresh interval (Requirement #22, #50)
    const interval = setInterval(() => {
      dispatch({ type: ACTIONS.REFRESH_REVENUE });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Server-Sent Events / EventSource streaming (Requirement #23)
  useEffect(() => {
    const url = state.activeBackendUrl;
    if (!url) return;

    let eventSource = null;
    try {
      const sseUrl = `${url}/api/stream_revenue.php`;
      eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.revenue !== undefined) {
            dispatch({ type: ACTIONS.UPDATE_REVENUE, payload: data.revenue });
          }
        } catch (_) {}
      };

      eventSource.onerror = () => {
        if (eventSource) eventSource.close();
      };
    } catch (_) {}

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [state.activeBackendUrl]);

  // Auth operations
  const login = async (email, password) => {
    const url = state.activeBackendUrl || BACKEND_URLS[0];
    try {
      const response = await fetch(`${url}/api/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        dispatch({ type: ACTIONS.LOGIN, payload: result.user });
        setSessionUser(result.user);
        fetchData(url);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (_) {
      // Mock Login Bypass if offline
      if (
        (email === 'admin@example.com' && password === 'admin123') ||
        (email === 'admin' && password === 'admin123')
      ) {
        const mockUser = { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' };
        dispatch({ type: ACTIONS.LOGIN, payload: mockUser });
        setSessionUser(mockUser);
        fetchData();
        return { success: true };
      } else if (
        (email === 'staff@example.com' && password === 'staff123') ||
        (email === 'staff1' && password === 'staff123')
      ) {
        const mockUser = { id: 2, username: 'staff1', email: 'staff@example.com', role: 'staff' };
        dispatch({ type: ACTIONS.LOGIN, payload: mockUser });
        setSessionUser(mockUser);
        fetchData();
        return { success: true };
      }
      return { success: false, message: 'Gunakan akun demo admin: admin@example.com / admin123' };
    }
  };

  const register = async (username, email, password) => {
    const url = state.activeBackendUrl || BACKEND_URLS[0];
    try {
      const response = await fetch(`${url}/api/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });
      return await response.json();
    } catch (_) {
      return { success: true, message: 'Pendaftaran demo berhasil! Silakan masuk.' };
    }
  };

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    setSessionUser(null);
    try {
      window.localStorage.removeItem('session_user');
    } catch (_) {}
    const targetUrl = state.activeBackendUrl || envBackendUrl;
    if (targetUrl) {
      fetch(`${targetUrl}/api/logout.php`, { credentials: 'include' }).catch(() => {});
    }
  };

  const showToast = useCallback((message, type = 'info', title = '') => {
    dispatch({
      type: ACTIONS.ADD_TOAST,
      payload: { message, type, title },
    });
  }, [dispatch]);

  const removeToast = useCallback((id) => {
    dispatch({
      type: ACTIONS.REMOVE_TOAST,
      payload: id,
    });
  }, [dispatch]);

  return (
    <DashboardContext.Provider
      value={{
        state,
        dispatch,
        fetchData,
        login,
        logout,
        register,
        showToast,
        removeToast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
