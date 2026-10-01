import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';

export default function AddProjectModal({ isOpen, onClose }) {
  const { state, dispatch, fetchData } = useDashboard();
  const { activeBackendUrl, projects } = state;

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [revenue, setRevenue] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !client || !revenue || !hours) {
      setError('Harap isi semua kolom wajib!');
      return;
    }

    setLoading(true);

    const payload = {
      project_name: name,
      client: client,
      amount: parseFloat(revenue),
      hours: parseInt(hours),
      date: startDate,
      status: status === 'completed' ? 'paid' : status === 'on-hold' ? 'overdue' : 'pending',
      priority: priority,
      start_date: startDate,
      end_date: endDate
    };

    if (activeBackendUrl) {
      try {
        const response = await fetch(`${activeBackendUrl}/api/add_invoice.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success) {
          fetchData();
          onClose();
          dispatch({ 
            type: ACTIONS.ADD_NOTIFICATION, 
            payload: { message: `✨ Tagihan "${name}" berhasil ditambahkan ke database!` } 
          });
          return;
        } else {
          setError(result.message || 'Gagal menyimpan ke server');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Backend gagal, menyimpan ke state lokal:', err);
      }
    }

    // Local state fallback
    const newProject = {
      id: Date.now(),
      name,
      client,
      revenue: parseFloat(revenue),
      hours: parseInt(hours),
      status,
      priority,
      start_date: startDate,
      end_date: endDate
    };

    dispatch({
      type: ACTIONS.ADD_PROJECT,
      payload: newProject
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none">
      <div className="bg-white dark:bg-[#141414] rounded-[2px] w-full max-w-lg max-h-[92vh] flex flex-col shadow-[4px_4px_0px_#000] border-2 border-black dark:border-white my-auto overflow-hidden">
        
        {/* Retro Facebook Modal Header */}
        <div className="bg-black text-white px-3.5 py-2 flex items-center justify-between border-b border-neutral-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-white text-black font-extrabold flex items-center justify-center text-[10px] rounded-[1px]">
              f
            </span>
            <h3 className="text-xs font-bold uppercase tracking-wider">Tambah Tagihan / Proyek Baru</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-400 hover:text-white p-0.5 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Body - Scrollable with responsive padding */}
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 font-sans overflow-y-auto">
          
          {error && (
            <p className="p-2 border border-black dark:border-white bg-neutral-100 dark:bg-neutral-900 text-xs font-bold text-black dark:text-white rounded-[1px]">
              ⚠️ {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Nama Proyek *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white"
                placeholder="E.g., Web API React"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Klien *</label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white"
                placeholder="E.g., BCA Digital"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Omset (Rp) *</label>
              <input
                type="number"
                required
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white font-mono"
                placeholder="E.g., 15000000"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Estimasi Jam Kerja *</label>
              <input
                type="number"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white font-mono"
                placeholder="E.g., 40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Status Proyek</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white font-bold cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed (Selesai)</option>
                <option value="on-hold">On Hold (Ditangguhkan)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white font-bold cursor-pointer"
              >
                <option value="high">High (Tinggi)</option>
                <option value="medium">Medium (Sedang)</option>
                <option value="low">Low (Rendah)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Tanggal Mulai</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-black dark:text-white mb-1">Deadline Selesai</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-400 dark:border-neutral-600 bg-white dark:bg-[#202020] text-black dark:text-white rounded-[1px] focus:outline-none focus:border-black dark:focus:border-white font-mono"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-3 border-t border-neutral-300 dark:border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="fb-btn-secondary w-full sm:w-auto text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="fb-btn-primary flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <Save size={13} />
              {loading ? 'Menyimpan...' : 'Simpan Tagihan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
