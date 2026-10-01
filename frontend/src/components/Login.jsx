import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { KeyRound, Mail, AlertTriangle, User as UserIcon } from 'lucide-react';

export default function Login() {
  const { login, register } = useDashboard();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setEmail('');
    setPassword('');
    setUsername('');
    setError('');
    setSuccessMsg('');
  }, [isRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    if (isRegistering) {
      const result = await register(username, email, password);
      setLoading(false);
      if (result.success) {
        setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
        setIsRegistering(false);
      } else {
        setError(result.message || 'Pendaftaran gagal.');
      }
    } else {
      const result = await login(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col font-sans select-none">
      
      {/* Retro Facebook Top Bar */}
      <header className="bg-black text-white border-b-2 border-neutral-700 py-2.5 sm:py-3 px-4 sm:px-6 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white text-black font-extrabold text-xl sm:text-2xl flex items-center justify-center rounded-[2px] leading-none select-none">
              f
            </div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tighter lowercase">
              freelance<span className="font-normal text-neutral-400">book</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-3.5 sm:p-6 md:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight leading-tight">
              Freelancebook membantu Anda melacak omset dan proyek secara real-time.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Platform pelacakan proyek, jam kerja, grafik Bezier 30 hari, distribusi klien, dan pencapaian target.
            </p>

            <div className="p-3 bg-white dark:bg-[#161616] border border-[#ccd0d5] dark:border-[#333333] rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-xs space-y-2">
              <p className="font-bold text-black dark:text-white">Akun Demo Siap Pakai (Klik untuk mengisi):</p>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }}
                  className="w-full text-left p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition font-mono text-[11px] flex justify-between items-center border border-dashed border-[#ccd0d5] dark:border-[#444]"
                >
                  <span>Admin: <strong className="text-black dark:text-white">admin@example.com</strong> (admin123)</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-sans font-bold underline">Gunakan</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('staff@example.com'); setPassword('staff123'); }}
                  className="w-full text-left p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition font-mono text-[11px] flex justify-between items-center border border-dashed border-[#ccd0d5] dark:border-[#444]"
                >
                  <span>Staff: <strong className="text-black dark:text-white">staff@example.com</strong> (staff123)</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-sans font-bold underline">Gunakan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Login Box */}
          <div className="bg-white dark:bg-[#141414] border border-[#ccd0d5] dark:border-[#333333] rounded-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.15)] p-4 sm:p-6 space-y-4">
            
            <div className="border-b border-[#ccd0d5] dark:border-[#333333] pb-2.5">
              <h3 className="font-bold text-sm sm:text-base text-black dark:text-white">
                {isRegistering ? 'Daftar Akun Baru' : 'Masuk ke Freelancebook'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {isRegistering ? 'Lengkapi data untuk membuat akun' : 'Masukkan rincian akun Anda di bawah ini'}
              </p>
            </div>

            {error && (
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white text-black dark:text-white text-xs flex items-center gap-2 rounded-[2px]">
                <AlertTriangle size={14} className="shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-600 text-black dark:text-white text-xs rounded-[2px]">
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {isRegistering && (
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#ccd0d5] dark:border-[#444] rounded-[2px] text-xs bg-white dark:bg-[#202020] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                    placeholder="Username Anda"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email atau Nama Pengguna
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#ccd0d5] dark:border-[#444] rounded-[2px] text-xs bg-white dark:bg-[#202020] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#ccd0d5] dark:border-[#444] rounded-[2px] text-xs bg-white dark:bg-[#202020] text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-[2px] border border-black shadow-[1px_1px_0px_#444] cursor-pointer transition-all active:translate-y-0.5"
              >
                {loading ? 'Memproses...' : (isRegistering ? 'Daftar Sekarang' : 'Masuk')}
              </button>
            </form>

            <div className="pt-3 border-t border-[#ccd0d5] dark:border-[#333333] text-center">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs text-black dark:text-white font-bold hover:underline cursor-pointer"
              >
                {isRegistering ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Buat Akun Baru'}
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-3 sm:py-4 border-t border-[#ccd0d5] dark:border-[#333333] text-center text-[10px] sm:text-[11px] text-neutral-500">
        Freelancebook &copy; 2026 &middot; Bahasa Indonesia
      </footer>
    </div>
  );
}
