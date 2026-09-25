import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  ShieldCheck,
  BookmarkCheck,
  LogIn,
  ChevronRight,
  Search,
} from 'lucide-react';

interface InfografisSpanjuViewProps {
  onOpenMenu: () => void;
  onProceedToLogin?: () => void;
}

export const InfografisSpanjuView: React.FC<InfografisSpanjuViewProps> = ({
  onOpenMenu,
  onProceedToLogin,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const infografisImgUrl = '/infografis-sahabat-spanju.jpg';
  const logoPassTemenan =
    'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg';

  return (
    <div
      className={`w-full transition-all duration-200 animate-in fade-in ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-white flex flex-col h-screen overflow-hidden'
          : 'bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden'
      }`}
    >
      {/* 1. TOP HEADER BAR */}
      <div className="px-5 sm:px-6 py-3 border-b border-slate-200/90 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wide">
            UPTD SMP NEGERI 7 PASURUAN
          </span>
          <span className="text-slate-300 font-light">•</span>
          <span className="text-xs sm:text-sm text-slate-500 font-normal hidden sm:inline">
            Dokumen Resmi Alur &amp; Layanan Terpadu
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100/90 border border-slate-200/90 rounded-full px-3 py-1 flex items-center gap-2 text-slate-600">
            <button
              type="button"
              onClick={handleZoomOut}
              className="hover:text-slate-900 cursor-pointer p-0.5 rounded transition-colors"
              title="Perkecil"
            >
              <Search className="w-3.5 h-3.5 -scale-x-100" />
            </button>
            <span className="text-xs font-bold text-slate-700 min-w-[42px] text-center font-mono">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="hover:text-slate-900 cursor-pointer p-0.5 rounded transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer transition-colors"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenMenu}
            className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
            title="Kembali ke Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN BODY CANVAS WITH SOFT MINT GRADIENT */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#dff2ea] via-[#edf7f2] to-[#f8fbf9] p-4 sm:p-8 flex flex-col items-center min-h-[600px]">
        <div className="relative flex items-center justify-center my-3">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-emerald-300/40 blur-xs absolute" />
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-200/60 flex items-center justify-center p-2 relative shadow-xs">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white border-2 border-emerald-400 p-1.5 shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={logoPassTemenan}
                alt="Logo PASS TEMENAN"
                className="w-full h-full object-contain rounded-full"
                crossOrigin="anonymous"
              />
            </div>
          </div>
        </div>

        <div className="border-2 border-emerald-500 bg-white text-emerald-800 px-6 py-1.5 rounded-full shadow-xs flex items-center gap-2 text-sm sm:text-base font-black tracking-wide uppercase mt-1 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>APLIKASI SAHABAT SPANJU</span>
        </div>

        <p className="text-slate-600 font-medium italic text-xs sm:text-sm text-center max-w-xl mb-6">
          (Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan)
        </p>

        <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-transform mb-4">
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out',
            }}
            className="w-full flex items-center justify-center"
          >
            <img
              src={infografisImgUrl}
              alt="SAHABAT SPANJU: Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan"
              className="w-full h-auto object-contain block"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      </div>

      {/* 3. BOTTOM FOOTER BAR */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-600">
          <BookmarkCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            Inovasi Penguatan Karakter &amp; Sekolah Ramah Anak UPT SMPN 7 Pasuruan
          </span>
        </div>

        <button
          type="button"
          onClick={onProceedToLogin ? onProceedToLogin : onOpenMenu}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-white" />
          <span>Masuk ke Login Aplikasi</span>
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
