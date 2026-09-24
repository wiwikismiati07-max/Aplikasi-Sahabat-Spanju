import React, { useState } from 'react';
import { Download, Smartphone, Laptop, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'sidebar' | 'card' | 'floating';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  // If already installed and variant is floating, don't display
  if (isInstalled && variant === 'floating') {
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-400 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer ${className}`}
          title="Install Aplikasi di HP / Laptop"
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Install Aplikasi</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'sidebar' && (
        <div className={`p-3 border-t border-slate-100 ${className}`}>
          <button
            type="button"
            onClick={handleClick}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md hover:from-emerald-700 hover:to-teal-800 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 p-1 flex items-center justify-center flex-shrink-0">
                <img
                  src="/pwa-192x192.png"
                  alt="Logo"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="text-left">
                <div className="text-xs font-extrabold flex items-center gap-1">
                  <span>Install Aplikasi</span>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </div>
                <div className="text-[10px] text-emerald-100">
                  HP Android, iOS &amp; Laptop
                </div>
              </div>
            </div>
            <div className="p-1.5 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors">
              <Download className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {variant === 'card' && (
        <div
          onClick={handleClick}
          className={`relative overflow-hidden rounded-3xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group ${className}`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-md border border-emerald-200 flex-shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/pwa-192x192.png"
                  alt="Logo PASS TEMENAN"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  Install Sahabat SPANJU
                </div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Pasang di Handphone &amp; Laptop Anda
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Akses instan dari Layar Utama HP dan Desktop Laptop dengan logo resmi <strong>PASS TEMENAN</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all flex-shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Pasang Sekarang</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Modal */}
      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
