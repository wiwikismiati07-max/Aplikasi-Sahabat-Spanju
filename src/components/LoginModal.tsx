import React, { useState } from 'react';
import { ShieldCheck, LogIn, BookOpen, PhoneCall, GraduationCap, Users, UserCheck, Eye, EyeOff, Sparkles, Image as ImageIcon, X } from 'lucide-react';
import { UserProfile, UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onLogin: (user: UserProfile, redirectTab?: string) => void;
  onClose?: () => void;
  onOpenInfografis?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLogin,
  onClose,
  onOpenInfografis,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (u === 'admin' && p === 'admin123') {
      onLogin({
        username: 'admin',
        name: 'Administrator TPPK SPANJU',
        role: 'admin',
      });
    } else if (u === 'passtemenan' && p === 'smpn7') {
      onLogin({
        username: 'passtemenan',
        name: 'Warga Belajar SPANJU',
        role: 'guru', // default general role
      });
    } else {
      setErrorMessage('Username atau password tidak sesuai. Silakan periksa kembali.');
    }
  };

  const handleQuickPortal = (role: UserRole, name: string, redirectTab?: string) => {
    onLogin(
      {
        username: role === 'admin' ? 'admin' : 'passtemenan',
        name,
        role,
      },
      redirectTab
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Centered Header */}
        <div className="relative p-6 pb-4 flex flex-col items-center text-center bg-gradient-to-b from-emerald-50/70 to-white border-b border-slate-100 flex-shrink-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Logo in Center */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-emerald-500/25 flex items-center justify-center">
              <img
                src="https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg"
                alt="Logo PASS TEMENAN"
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Aplikasi Sahabat SPANJU
          </div>

          <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-snug uppercase px-2">
            Sekolah Aman, Harmonis, Anti Bullying & Tindak Kekerasan
          </h1>
          <p className="text-xs font-semibold text-emerald-700 tracking-wider uppercase mt-0.5">
            UPT SMP NEGERI 7 PASURUAN
          </p>

          {/* Infografis button shortcut */}
          {onOpenInfografis && (
            <button
              type="button"
              onClick={onOpenInfografis}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Lihat Infografis Alur SPANJU
            </button>
          )}
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username Akun
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="passtemenan / admin"
                required
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2 pr-10 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Aplikasi</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                Akses Cepat 1-Klik (Warga SPANJU)
              </span>
            </div>
          </div>

          {/* Quick Portals Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickPortal('siswa', 'Siswa Sahabat SPANJU')}
              className="p-2.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-center transition-all group flex flex-col items-center gap-1"
            >
              <GraduationCap className="w-5 h-5 text-sky-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-sky-900">Siswa</span>
              <span className="text-[10px] text-sky-600">Portal Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPortal('guru', 'Bapak/Ibu Guru SPANJU')}
              className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-center transition-all group flex flex-col items-center gap-1"
            >
              <UserCheck className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-emerald-900">Guru</span>
              <span className="text-[10px] text-emerald-600">Wali & Pengajar</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPortal('orangtua', 'Orang Tua / Wali Murid')}
              className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-center transition-all group flex flex-col items-center gap-1"
            >
              <Users className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-amber-900">Orang Tua</span>
              <span className="text-[10px] text-amber-600">Wali Murid</span>
            </button>
          </div>

          {/* Hotline & Manual Book Portals */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickPortal('tamu', 'Tamu / Pengunjung SPANJU', 'hotline')}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold">Portal Hotline</div>
                <div className="text-[10px] text-slate-500">Bantuan 1x24 Jam</div>
              </div>
            </button>

            <a
              href="https://heyzine.com/flip-book/45802adfc1.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <div className="text-left leading-tight">
                <div className="text-xs font-bold">Manual Book</div>
                <div className="text-[10px] text-slate-500">Flipbook Digital</div>
              </div>
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 flex-shrink-0">
          Akun Umum: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">passtemenan / smpn7</code>
        </div>
      </div>
    </div>
  );
};
