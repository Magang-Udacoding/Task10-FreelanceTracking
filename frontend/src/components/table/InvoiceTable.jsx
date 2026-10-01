import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Download, 
  Printer, 
  Trash2, 
  CheckSquare, 
  Square,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Grid,
  Star,
  X,
  Filter
} from 'lucide-react';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';
import useTableSort from '../../hooks/useTableSort';

// Helper to highlight matching query text
function highlightMatch(text = '', query = '') {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = String(text).split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-black dark:text-white px-0.5 rounded-[1px] font-bold">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// React.memo: prevent row re-renders unless specific row data/state changes (Requirement #57)
const InvoiceRow = React.memo(function InvoiceRow({
  project: p,
  isSelected,
  isFavorite,
  visibleColumns,
  onToggleRow,
  onToggleFavorite,
  getStatusBadge,
  getPriorityBadge,
  formatRupiah,
  searchQuery = '',
}) {
  return (
    <tr 
      className={`border-b border-[#e9ebee] dark:border-[#222222] hover:bg-[#f0f2f5] dark:hover:bg-[#1a1a1a] transition-colors select-text ${
        isSelected ? 'bg-[#e4e6eb] dark:bg-[#282828]' : ''
      }`}
    >
      {/* Checkbox column */}
      <td className="p-2.5 text-center no-print">
        <button
          onClick={() => onToggleRow(p.id)}
          className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors focus:outline-none"
        >
          {isSelected ? (
            <CheckSquare size={15} className="text-black dark:text-white" />
          ) : (
            <Square size={15} />
          )}
        </button>
      </td>
      
      {/* Favorite column */}
      <td className="p-2.5 text-center no-print w-8">
        <button
          onClick={() => onToggleFavorite(p.id)}
          className={`transition-colors focus:outline-none ${
            isFavorite ? 'text-black dark:text-white' : 'text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
          title={isFavorite ? "Hapus dari Favorit" : "Tandai sebagai Favorit"}
        >
          <Star size={15} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </td>

      {visibleColumns.project && (
        <td className="p-2.5 font-bold text-black dark:text-white max-w-[200px] truncate" title={p.name}>
          {highlightMatch(p.name, searchQuery)}
        </td>
      )}
      {visibleColumns.client && (
        <td className="p-2.5 text-neutral-600 dark:text-neutral-300 max-w-[180px] truncate" title={p.client}>
          {highlightMatch(p.client, searchQuery)}
        </td>
      )}
      {visibleColumns.revenue && (
        <td className="p-2.5 font-bold font-mono text-black dark:text-white">
          {formatRupiah(p.revenue)}
        </td>
      )}
      {visibleColumns.hours && (
        <td className="p-2.5 text-center font-mono text-neutral-600 dark:text-neutral-300">
          {p.hours} jam
        </td>
      )}
      {visibleColumns.status && (
        <td className="p-2.5 text-center">
          {getStatusBadge(p.status)}
        </td>
      )}
      {visibleColumns.priority && (
        <td className="p-2.5 text-center">
          {getPriorityBadge(p.priority)}
        </td>
      )}
      {visibleColumns.start && (
        <td className="p-2.5 text-[11px] font-mono text-neutral-500">
          {p.start_date}
        </td>
      )}
      {visibleColumns.end && (
        <td className="p-2.5 text-[11px] font-mono text-neutral-500">
          {p.end_date}
        </td>
      )}
    </tr>
  );
});

export default function InvoiceTable() {
  const { state, dispatch, fetchData } = useDashboard();
  const { projects, filters, visibleColumns, selectedRows, favorites = [], theme, user } = state;

  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';

  // Memoized event handlers to prevent row component re-renders (Requirement #58)
  const handleToggleRow = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_ROW, payload: id });
  }, [dispatch]);

  const handleToggleFavorite = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_FAVORITE, payload: id });
  }, [dispatch]);

  // Local Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Column Visibility Dropdown State
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  // Search Mode & Input State
  const [searchScope, setSearchScope] = useState('all'); // 'all' | 'project' | 'client'
  const [tableSearch, setTableSearch] = useState(filters.search || '');

  // Keep local search input synchronized with filters.search from context / navbar
  useEffect(() => {
    setTableSearch(filters.search || '');
  }, [filters.search]);

  // Debounce sync to global context when user types in table search bar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tableSearch !== filters.search) {
        dispatch({ type: ACTIONS.SET_FILTER, payload: { search: tableSearch } });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [tableSearch, filters.search, dispatch]);

  // Reset pagination on search/filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchScope]);

  // 1. Filter projects based on global search, search scope & select criteria
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Text Search Filter (Project Name and/or Client Name based on searchScope)
    if (filters.search && filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      if (searchScope === 'project') {
        result = result.filter((p) => (p.name || '').toLowerCase().includes(query));
      } else if (searchScope === 'client') {
        result = result.filter((p) => (p.client || '').toLowerCase().includes(query));
      } else {
        result = result.filter(
          (p) =>
            (p.name || '').toLowerCase().includes(query) ||
            (p.client || '').toLowerCase().includes(query)
        );
      }
    }

    // Client select filter
    if (filters.client && filters.client !== 'all') {
      result = result.filter((p) => p.client === filters.client);
    }

    // Status select filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((p) => p.status === filters.status);
    }

    // Priority select filter
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter((p) => p.priority === filters.priority);
    }

    return result;
  }, [projects, filters, searchScope]);

  // 2. Apply useTableSort custom hook (Requirement #19-21)
  const {
    sortedItems: filteredAndSortedProjects,
    sortConfig,
    requestSort,
    getSortDirection,
  } = useTableSort(filteredProjects, { key: 'start_date', direction: 'desc' });

  // Render sorting arrow helper with Lucide icons
  const getSortIcon = (key) => {
    const dir = getSortDirection(key);
    if (!dir) {
      return <div className="flex flex-col ml-1 opacity-20"><ChevronUp size={10} /><ChevronDown size={10} /></div>;
    }
    return dir === 'asc' 
      ? <ChevronUp size={14} className="text-brand-gold ml-1 animate-pulse" />
      : <ChevronDown size={14} className="text-brand-gold ml-1 animate-pulse" />;
  };

  // Paginated Slices
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage) || 1;

  // Formatting Rupiah Currency Helper
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Row selection logic
  const handleSelectAll = () => {
    const currentPageIds = paginatedProjects.map(p => p.id);
    const allSelectedOnPage = currentPageIds.every(id => selectedRows.includes(id));

    if (allSelectedOnPage) {
      // Unselect all on this page
      const nextSelected = selectedRows.filter(id => !currentPageIds.includes(id));
      dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: nextSelected });
    } else {
      // Select all on this page
      const nextSelected = [...new Set([...selectedRows, ...currentPageIds])];
      dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: nextSelected });
    }
  };

  const isRowSelected = (id) => selectedRows.includes(id);

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!isAdmin) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedRows.length} invoice terpilih?`)) {
      if (state.activeBackendUrl) {
        try {
          await Promise.all(selectedRows.map(id => 
            fetch(`${state.activeBackendUrl}/api/delete_invoice.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id }),
              credentials: 'include'
            })
          ));
          fetchData();
        } catch (error) {
          console.error(error);
        }
      } else {
        // Mock delete logic
        const remaining = projects.filter(p => !selectedRows.includes(p.id));
        dispatch({
          type: ACTIONS.SET_DATA,
          payload: {
            ...state,
            projects: remaining,
            invoices: remaining.map(p => ({
              id: p.id,
              project_name: p.name,
              client: p.client,
              amount: p.revenue,
              date: p.start_date,
              status: p.status === 'completed' ? 'paid' : p.status === 'on-hold' ? 'overdue' : 'pending'
            }))
          }
        });
      }
      dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: [] });
      dispatch({ 
        type: ACTIONS.ADD_NOTIFICATION, 
        payload: { message: `🗑️ ${selectedRows.length} Invoice berhasil dihapus (Bulk Action)` } 
      });
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (!isAdmin) return;
    if (state.activeBackendUrl) {
      try {
        await Promise.all(selectedRows.map(id => {
          const proj = projects.find(p => p.id === id);
          return fetch(`${state.activeBackendUrl}/api/edit_invoice.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...proj,
              project_name: proj.name,
              amount: proj.revenue,
              date: proj.start_date,
              status: status === 'completed' ? 'paid' : status === 'on-hold' ? 'overdue' : 'pending'
            }),
            credentials: 'include'
          });
        }));
        fetchData();
      } catch (error) {
        console.error(error);
      }
    } else {
      // Mock update
      const updated = projects.map(p => 
        selectedRows.includes(p.id) ? { ...p, status: status } : p
      );
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: {
          ...state,
          projects: updated,
          invoices: updated.map(p => ({
            id: p.id,
            project_name: p.name,
            client: p.client,
            amount: p.revenue,
            date: p.start_date,
            status: status === 'completed' ? 'paid' : status === 'on-hold' ? 'overdue' : 'pending'
          }))
        }
      });
    }
    dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: [] });
    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `🔄 Status ${selectedRows.length} Invoice berhasil diubah ke: ${status.toUpperCase()}` } 
    });
  };

  // Exporters using PapaParse
  const handleExportCSV = () => {
    const exportData = filteredAndSortedProjects.map(p => ({
      'Project Name': p.name,
      'Client Name': p.client,
      'Revenue (IDR)': p.revenue,
      'Hours Spent': p.hours,
      'Project Status': p.status.toUpperCase(),
      'Priority Level': p.priority.toUpperCase(),
      'Start Date': p.start_date,
      'End Date': p.end_date
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `omset_tracker_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `📥 Berhasil mengunduh CSV (${filteredAndSortedProjects.length} baris)` } 
    });
  };

  const handleExportExcel = () => {
    // Generate standard XML spreadsheet format or formatted CSV representing Excel structure
    // PapaParse handles this beautifully, we append UTF-8 BOM to make sure it opens correctly in MS Excel with accents
    const exportData = filteredAndSortedProjects.map(p => ({
      'Project Name': p.name,
      'Client Name': p.client,
      'Revenue (IDR)': p.revenue,
      'Hours': p.hours,
      'Status': p.status,
      'Priority': p.priority,
      'Start Date': p.start_date,
      'End Date': p.end_date
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `omset_tracker_export_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `📊 Berhasil mengunduh Excel Spreadsheet` } 
    });
  };

  // Window Printer
  const handlePrint = () => {
    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: '🖨️ Membuka jendela dialog cetak / PDF dokumen tagihan...' } 
    });
    setTimeout(() => window.print(), 250);
  };

  // Status badges helper (Retro Facebook Monochrome Badges)
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

  // Priority badges helper (Monochrome)
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="font-mono text-[9px] font-bold uppercase border border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-1.5 py-0.5 rounded-[1px]">TINGGI</span>;
      case 'low':
        return <span className="font-mono text-[9px] uppercase border border-neutral-400 text-neutral-500 px-1.5 py-0.5 rounded-[1px]">RENDAH</span>;
      default:
        return <span className="font-mono text-[9px] font-bold uppercase border border-neutral-600 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white px-1.5 py-0.5 rounded-[1px]">SEDANG</span>;
    }
  };

  return (
    <div className="w-full">
      {/* Fitur Pencarian Nama Proyek / Klien */}
      <div className="bg-[#f0f2f5] dark:bg-[#161616] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] p-2.5 mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] no-print">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
          
          {/* Kolom Input Pencarian */}
          <div className="relative flex-1 flex items-center bg-white dark:bg-[#111111] border border-neutral-400 dark:border-neutral-600 rounded-[2px] overflow-hidden focus-within:border-black dark:focus-within:border-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
            <span className="pl-2.5 pr-1.5 text-neutral-500 shrink-0">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder={
                searchScope === 'project'
                  ? "Cari nama proyek..."
                  : searchScope === 'client'
                  ? "Cari nama klien..."
                  : "Cari nama proyek atau nama klien..."
              }
              className="w-full py-1.5 px-1 text-xs text-black dark:text-white bg-transparent focus:outline-none placeholder-neutral-400 font-sans min-w-0"
            />
            {tableSearch && (
              <button
                type="button"
                onClick={() => {
                  setTableSearch('');
                  dispatch({ type: ACTIONS.SET_FILTER, payload: { search: '' } });
                }}
                className="pr-2.5 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer shrink-0"
                title="Hapus kata kunci pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Opsi Target Kolom & Filter Cepat Status */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 hidden sm:inline">
              Target:
            </span>
            <select
              value={searchScope}
              onChange={(e) => setSearchScope(e.target.value)}
              className="py-1.5 px-2 bg-white dark:bg-[#111111] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white rounded-[2px] text-xs font-bold cursor-pointer focus:outline-none shadow-[1px_1px_0px_#ccc] dark:shadow-none"
            >
              <option value="all">Semua (Proyek & Klien)</option>
              <option value="project">Hanya Nama Proyek</option>
              <option value="client">Hanya Nama Klien</option>
            </select>

            {/* Quick Status Pill Filters */}
            <div className="flex items-center border border-neutral-400 dark:border-neutral-600 rounded-[2px] overflow-hidden bg-white dark:bg-[#111111] text-xs font-bold shadow-[1px_1px_0px_#ccc] dark:shadow-none">
              {[
                { label: 'Semua', value: 'all' },
                { label: 'Selesai', value: 'completed' },
                { label: 'Pending', value: 'pending' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => dispatch({ type: ACTIONS.SET_FILTER, payload: { status: tab.value } })}
                  className={`px-2 py-1 text-[11px] transition-colors cursor-pointer ${
                    (filters.status || 'all') === tab.value
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#222222]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tombol Reset Filter jika aktif */}
            {(tableSearch || (filters.client && filters.client !== 'all') || (filters.status && filters.status !== 'all')) && (
              <button
                type="button"
                onClick={() => {
                  setTableSearch('');
                  setSearchScope('all');
                  dispatch({ 
                    type: ACTIONS.SET_FILTER, 
                    payload: { search: '', client: '', status: 'all', priority: 'all' } 
                  });
                }}
                className="py-1 px-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-black dark:text-white text-xs font-bold rounded-[2px] border border-neutral-400 dark:border-neutral-600 transition-colors cursor-pointer flex items-center gap-1 shadow-[1px_1px_0px_#ccc] dark:shadow-none"
                title="Reset semua filter dan pencarian"
              >
                <X size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Info Hasil Pencarian */}
        <div className="flex flex-wrap items-center justify-between gap-1 mt-2 pt-1.5 border-t border-neutral-300 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Hasil Pencarian:</span>
            <span className="font-bold text-black dark:text-white font-mono bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.2 rounded-[1px] border border-neutral-400 dark:border-neutral-700">
              {filteredProjects.length} / {projects.length} Proyek
            </span>
            {tableSearch && (
              <span className="text-[10px] bg-yellow-100 dark:bg-yellow-950/70 text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 px-1.5 py-0.2 rounded-[1px] font-mono">
                Kata kunci: "{tableSearch}" ({searchScope === 'all' ? 'Proyek & Klien' : searchScope === 'project' ? 'Nama Proyek' : 'Nama Klien'})
              </span>
            )}
            {filters.client && filters.client !== 'all' && (
              <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white border border-neutral-400 dark:border-neutral-700 px-1.5 py-0.2 rounded-[1px] font-mono">
                Klien: {filters.client}
              </span>
            )}
          </div>
          {filteredProjects.length === 0 && (
            <span className="text-red-500 font-bold text-[10px]">
              Tidak ada proyek atau klien yang cocok dengan kata kunci.
            </span>
          )}
        </div>
      </div>

      {/* Table Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2.5 gap-2.5 no-print">
        
        {/* Bulk action buttons when rows are selected */}
        {selectedRows.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-[#eceff5] dark:bg-[#1c1c1c] border border-black dark:border-white rounded-[2px] p-1.5 px-3">
            <span className="text-xs font-bold text-black dark:text-white font-mono">
              {selectedRows.length} Terpilih:
            </span>
            {isAdmin ? (
              <>
                <button
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black font-bold text-[11px] rounded-[1px] border border-black dark:border-white transition-all cursor-pointer"
                >
                  Set Selesai
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('pending')}
                  className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-bold text-[11px] rounded-[1px] border border-neutral-600 transition-all cursor-pointer"
                >
                  Set Pending
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-2 py-0.5 bg-black text-white hover:bg-neutral-800 font-bold text-[11px] rounded-[1px] border border-black transition-all cursor-pointer flex items-center gap-1"
                >
                  <Trash2 size={11} /> Hapus
                </button>
              </>
            ) : (
              <span className="text-[10px] text-neutral-500">Khusus Admin</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white uppercase tracking-wide">
              Daftar Tagihan & Proyek
            </h3>
            <span className="px-1.5 py-0.5 border border-black dark:border-white font-mono text-[10px] font-bold bg-white dark:bg-black text-black dark:text-white rounded-[1px]">
              {filteredAndSortedProjects.length} Item
            </span>
          </div>
        )}

        {/* Global Toolbar and Exporters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Column visibility controller */}
          <div className="relative">
            <button
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              className="px-2.5 py-1 bg-white hover:bg-neutral-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold text-xs rounded-[2px] shadow-[1px_1px_0px_#ccc] dark:shadow-none flex items-center gap-1 cursor-pointer transition-all"
            >
              <Grid size={12} />
              Kolom
            </button>
            
            {showVisibilityDropdown && (
              <div className="absolute right-0 mt-1 w-44 rounded-[2px] shadow-[2px_2px_0px_#000] border border-black bg-white dark:bg-[#1a1a1a] p-1.5 z-30 transition-all">
                <p className="text-[10px] uppercase font-bold text-black dark:text-white p-1 border-b border-neutral-300 dark:border-neutral-700 mb-1">
                  Visibilitas Kolom
                </p>
                {Object.keys(visibleColumns).map((col) => (
                  <button
                    key={col}
                    onClick={() => dispatch({ type: ACTIONS.TOGGLE_COLUMN, payload: col })}
                    className="flex items-center w-full px-2 py-1 text-xs text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-[#282828] rounded-[1px] text-left capitalize gap-2"
                  >
                    {visibleColumns[col] ? (
                      <Eye size={12} className="text-black dark:text-white" />
                    ) : (
                      <EyeOff size={12} className="text-neutral-400" />
                    )}
                    {col === 'start' ? 'Start Date' : col === 'end' ? 'End Date' : col}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-[2px] border border-black shadow-[1px_1px_0px_#555] flex items-center gap-1 cursor-pointer transition-all"
          >
            <Download size={12} />
            CSV
          </button>
          
          <button
            onClick={handleExportExcel}
            className="px-2.5 py-1 bg-white hover:bg-neutral-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold text-xs rounded-[2px] shadow-[1px_1px_0px_#ccc] dark:shadow-none flex items-center gap-1 cursor-pointer transition-all"
          >
            <Download size={12} />
            Excel
          </button>

          <button
            onClick={handlePrint}
            className="px-2.5 py-1 bg-white hover:bg-neutral-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold text-xs rounded-[2px] shadow-[1px_1px_0px_#ccc] dark:shadow-none flex items-center gap-1 cursor-pointer transition-all"
          >
            <Printer size={12} />
            Cetak
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Table */}
      <div className="overflow-x-auto rounded-[2px] border border-[#ccd0d5] dark:border-[#333333] shadow-[0_1px_2px_rgba(0,0,0,0.1)] bg-white dark:bg-[#121212] print-card">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[#eceff5] dark:bg-[#1c1c1c] border-b-2 border-black dark:border-white text-black dark:text-white font-bold uppercase text-[10px] tracking-wider select-none">
              <th className="p-2.5 w-10 text-center no-print">
                <button
                  onClick={handleSelectAll}
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors focus:outline-none"
                >
                  {paginatedProjects.length > 0 && paginatedProjects.every(p => selectedRows.includes(p.id)) ? (
                    <CheckSquare size={15} className="text-black dark:text-white" />
                  ) : (
                    <Square size={15} />
                  )}
                </button>
              </th>
              <th className="p-2.5 w-8 text-center no-print">
                <Star size={13} className="text-black dark:text-white mx-auto" />
              </th>
              {visibleColumns.project && (
                <th className="p-2.5 cursor-pointer hover:underline" onClick={() => requestSort('name')}>
                  <div className="flex items-center">PROYEK {getSortIcon('name')}</div>
                </th>
              )}
              {visibleColumns.client && (
                <th className="p-2.5 cursor-pointer hover:underline" onClick={() => requestSort('client')}>
                  <div className="flex items-center">KLIEN {getSortIcon('client')}</div>
                </th>
              )}
              {visibleColumns.revenue && (
                <th className="p-2.5 cursor-pointer hover:underline" onClick={() => requestSort('revenue')}>
                  <div className="flex items-center">OMSET (IDR) {getSortIcon('revenue')}</div>
                </th>
              )}
              {visibleColumns.hours && (
                <th className="p-2.5 cursor-pointer hover:underline text-center" onClick={() => requestSort('hours')}>
                  <div className="flex items-center justify-center">JAM {getSortIcon('hours')}</div>
                </th>
              )}
              {visibleColumns.status && (
                <th className="p-2.5 cursor-pointer hover:underline text-center" onClick={() => requestSort('status')}>
                  <div className="flex items-center justify-center">STATUS {getSortIcon('status')}</div>
                </th>
              )}
              {visibleColumns.priority && (
                <th className="p-2.5 cursor-pointer hover:underline text-center" onClick={() => requestSort('priority')}>
                  <div className="flex items-center justify-center">PRIORITAS {getSortIcon('priority')}</div>
                </th>
              )}
              {visibleColumns.start && (
                <th className="p-2.5 cursor-pointer hover:underline" onClick={() => requestSort('start_date')}>
                  <div className="flex items-center">MULAI {getSortIcon('start_date')}</div>
                </th>
              )}
              {visibleColumns.end && (
                <th className="p-2.5 cursor-pointer hover:underline" onClick={() => requestSort('end_date')}>
                  <div className="flex items-center">SELESAI {getSortIcon('end_date')}</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e9ebee] dark:divide-[#222222] text-xs">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((p) => (
                <InvoiceRow
                  key={p.id}
                  project={p}
                  isSelected={isRowSelected(p.id)}
                  isFavorite={favorites.includes(p.id)}
                  visibleColumns={visibleColumns}
                  onToggleRow={handleToggleRow}
                  onToggleFavorite={handleToggleFavorite}
                  getStatusBadge={getStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  formatRupiah={formatRupiah}
                  searchQuery={filters.search}
                />
              ))
            ) : (
              <tr>
                <td colSpan={11} className="p-8 text-center text-neutral-400">
                  Tidak ada proyek / invoice yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-3 gap-2.5 no-print text-xs p-1">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 font-bold text-[11px]">Tampilkan:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#1a1a1a] text-black dark:text-white rounded-[2px] text-xs font-bold focus:ring-0 focus:border-black cursor-pointer"
          >
            <option value={10}>10 per Halaman</option>
            <option value={25}>25 per Halaman</option>
            <option value={50}>50 per Halaman</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 bg-white hover:bg-neutral-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold text-xs rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed shadow-[1px_1px_0px_#ccc] dark:shadow-none cursor-pointer transition-all"
          >
            &laquo; Sebelumnya
          </button>
          <span className="px-2 font-mono text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
            Hal {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 bg-white hover:bg-neutral-100 dark:bg-[#1a1a1a] dark:hover:bg-[#252525] border border-neutral-400 dark:border-neutral-600 text-black dark:text-white font-bold text-xs rounded-[2px] disabled:opacity-40 disabled:cursor-not-allowed shadow-[1px_1px_0px_#ccc] dark:shadow-none cursor-pointer transition-all"
          >
            Berikutnya &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
