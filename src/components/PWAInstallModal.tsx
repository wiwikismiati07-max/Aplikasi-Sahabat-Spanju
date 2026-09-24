import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  CheckCircle2,
  X,
  Share,
  PlusSquare,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Info,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isMobile, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'laptop'>(
    isIOS ? 'ios' : isMobile ? 'android' : 'laptop'
  );
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with PASS TEMENAN Brand & Badge */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 p-5 text-white flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="w-14 h-14 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-300">
              <img
                src="/pwa-192x192.png"
                alt="Logo PASS TEMENAN"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Progressive Web App (PWA)
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-snug mt-0.5">
                Install Aplikasi Sahabat SPANJU
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Komunitas PASS TEMENAN • SMPN 7 Pasuruan
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Status Alert if Already Installed */}
          {isInstalled && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold">Aplikasi Sudah Terpasang!</span>
                <p className="text-emerald-700 mt-0.5">
                  Anda sudah menggunakan aplikasi dalam mode aplikasi terinstal (Standalone).
                </p>
              </div>
            </div>
          )}

          {/* Quick 1-Click Install Button if browser supports BeforeInstallPrompt */}
          {isInstallable && !isInstalled && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-extrabold text-sm">Browser Mendukung Pasang Cepat!</div>
                  <div className="text-xs text-emerald-100 mt-0.5">
                    Klik tombol di samping untuk langsung menambahkan ke layar utama atau desktop.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDirectInstall}
                  className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-extrabold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-700" />
                  <span>Pasang Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {/* Device Tabs */}
          <div>
            <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Pilih Petunjuk Sesuai Perangkat Anda:</span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Android (HP)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Apple className="w-4 h-4" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('laptop')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'laptop'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>Laptop / PC</span>
              </button>
            </div>
          </div>

          {/* Tab Content 1: Android */}
          {activeTab === 'android' && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                Cara Pasang di HP Android (Google Chrome / Edge)
              </div>
              <ol className="text-xs text-slate-600 space-y-2.5 pl-2 list-decimal list-inside">
                <li className="leading-relaxed">
                  Buka link aplikasi ini di browser <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong> pada HP Anda.
                </li>
                <li className="leading-relaxed">
                  Ketuk tombol <strong>Menu Titik Tiga (⋮)</strong> di pojok kanan atas browser.
                </li>
                <li className="leading-relaxed">
                  Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> (atau <em>"Install Aplikasi"</em>).
                </li>
                <li className="leading-relaxed">
                  Ketuk <strong>"Install"</strong> atau <strong>"Tambah"</strong>. Icon logo <strong>PASS TEMENAN</strong> akan muncul di daftar aplikasi HP Anda dan bisa dibuka langsung seperti aplikasi native!
                </li>
              </ol>
            </div>
          )}

          {/* Tab Content 2: iOS */}
          {activeTab === 'ios' && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                Cara Pasang di iPhone &amp; iPad (Safari Browser)
              </div>
              <ol className="text-xs text-slate-600 space-y-2.5 pl-2 list-decimal list-inside">
                <li className="leading-relaxed">
                  Buka link aplikasi ini menggunakan browser bawaan <strong>Safari</strong> di iPhone/iPad.
                </li>
                <li className="leading-relaxed flex items-start gap-1.5">
                  <span>Ketuk tombol <strong>Bagikan / Share</strong></span>
                  <Share className="w-4 h-4 text-blue-600 inline flex-shrink-0" />
                  <span>di bagian bawah layar Safari.</span>
                </li>
                <li className="leading-relaxed flex items-start gap-1.5">
                  <span>Gulir ke bawah dan pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong></span>
                  <PlusSquare className="w-4 h-4 text-emerald-600 inline flex-shrink-0" />
                </li>
                <li className="leading-relaxed">
                  Ketuk tombol <strong>"Tambah" (Add)</strong> di pojok kanan atas. Icon <strong>PASS TEMENAN</strong> akan langsung terpasang di Home Screen iPhone/iPad Anda!
                </li>
              </ol>
            </div>
          )}

          {/* Tab Content 3: Laptop & PC */}
          {activeTab === 'laptop' && (
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                Cara Pasang di Laptop &amp; Komputer (Windows, Mac, Chromebook)
              </div>
              <ol className="text-xs text-slate-600 space-y-2.5 pl-2 list-decimal list-inside">
                <li className="leading-relaxed">
                  Buka aplikasi ini di <strong>Google Chrome</strong> atau <strong>Microsoft Edge</strong> di laptop Anda.
                </li>
                <li className="leading-relaxed">
                  Lihat ke bilah alamat (URL bar) di bagian atas kanan. Klik icon <strong>Install / Pasang Aplikasi</strong> (icon layar dengan tanda panah ke bawah atau icon komputer).
                </li>
                <li className="leading-relaxed">
                  Atau klik <strong>Menu Titik Tiga (⋮)</strong> di pojok kanan atas browser &gt; pilih <strong>"Simpan dan Bagikan" / "Aplikasi"</strong> &gt; pilih <strong>"Install Sahabat SPANJU"</strong>.
                </li>
                <li className="leading-relaxed">
                  Klik <strong>"Install"</strong>. Shortcut aplikasi dengan logo <strong>PASS TEMENAN</strong> akan otomatis terpasang di Desktop &amp; Start Menu laptop Anda.
                </li>
              </ol>
            </div>
          )}

          {/* Key Advantages */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div className="text-[11px] text-slate-700 leading-tight">
                <strong>Ringan &amp; Cepat</strong><br />Hemat kuota &amp; memori
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <div className="text-[11px] text-slate-700 leading-tight">
                <strong>Logo Resmi</strong><br />PASS TEMENAN SPANJU
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            Tersedia untuk Android, iOS, Windows &amp; Mac
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
