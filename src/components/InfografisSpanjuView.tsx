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
  Printer,
  Download,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { KopSurat } from './KopSurat';

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
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  const infografisImgUrl = '/infografis-sahabat-spanju.jpg';
  const logoPassTemenan =
    'https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(infografisImgUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Infografis-Sahabat-SPANJU-UPTD-SMPN-7-Pasuruan.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch {
      const link = document.createElement('a');
      link.href = infografisImgUrl;
      link.download = 'Infografis-Sahabat-SPANJU-UPTD-SMPN-7-Pasuruan.jpg';
      link.target = '_blank';
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }
  };

  return (
    <div
      className={`w-full transition-all duration-200 animate-in fade-in ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-white flex flex-col h-screen overflow-hidden'
          : 'bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden'
      }`}
    >
      {/* Toast Notification on Download */}
      {downloadSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold">Infografis Berhasil Disimpan!</p>
            <p className="text-[11px] text-emerald-100">File gambar telah diunduh ke galeri / folder unduhan Anda.</p>
          </div>
        </div>
      )}

      {/* 1. TOP HEADER BAR */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-200/90 bg-white flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block flex-shrink-0" />
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wide">
            UPTD SMP NEGERI 7 PASURUAN
          </span>
          <span className="text-slate-300 font-light hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm text-slate-500 font-normal hidden sm:inline">
            Dokumen Resmi Alur &amp; Layanan Terpadu
          </span>
        </div>

        {/* Action Controls: Cetak, Simpan, Zoom, Fullscreen, Close */}
        <div className="flex items-center gap-2">
          {/* Tombol Cetak Dokumen */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Cetak Infografis / Simpan PDF (A4)"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Cetak</span>
          </button>

          {/* Tombol Simpan Gambar */}
          <button
            type="button"
            onClick={handleDownloadImage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Simpan File Gambar Infografis ke Perangkat"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Simpan</span>
          </button>

          {/* Zoom Controls Pill */}
          <div className="bg-slate-100/90 border border-slate-200/90 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-slate-600">
            <button
              type="button"
              onClick={handleZoomOut}
              className="hover:text-slate-900 cursor-pointer p-0.5 rounded transition-colors"
              title="Perkecil"
            >
              <Search className="w-3.5 h-3.5 -scale-x-100" />
            </button>
            <span className="text-xs font-bold text-slate-700 min-w-[38px] text-center font-mono">
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

          {/* Fullscreen Toggle */}
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

          {/* Back to Menu */}
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
        {/* PASS TEMENAN LOGO */}
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

        {/* Badge: APLIKASI SAHABAT SPANJU */}
        <div className="border-2 border-emerald-500 bg-white text-emerald-800 px-6 py-1.5 rounded-full shadow-xs flex items-center gap-2 text-sm sm:text-base font-black tracking-wide uppercase mt-1 mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>APLIKASI SAHABAT SPANJU</span>
        </div>

        {/* Subtitle */}
        <p className="text-slate-600 font-medium italic text-xs sm:text-sm text-center max-w-xl mb-5">
          (Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan)
        </p>

        {/* Infografis Image Card Container */}
        <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-transform mb-5">
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

        {/* Dedicated Quick Action Toolbar Below Infografis */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-between gap-3 bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-emerald-200 shadow-md mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Dokumen Infografis Resmi
              </span>
              <span className="text-[11px] text-slate-500 block">
                Bisa dicetak (Kertas A4 / PDF) &amp; disimpan ke galeri perangkat
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Infografis</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadImage}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Simpan Gambar</span>
            </button>
          </div>
        </div>

        {/* Action bar below Infografis */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-3 py-2 text-center text-xs text-slate-500">
          <span>Format file: JPG Resolusi Tinggi</span>
          <span>•</span>
          <span>Dukungan Cetak: Kertas A4 Portrait / PDF</span>
          <span>•</span>
          <button
            type="button"
            onClick={handlePrint}
            className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
          >
            Klik di sini untuk langsung mencetak
          </button>
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            title="Cetak Infografis"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            title="Simpan File Gambar Infografis"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Simpan</span>
          </button>

          <button
            type="button"
            onClick={onProceedToLogin ? onProceedToLogin : onOpenMenu}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-white" />
            <span>Masuk Aplikasi</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* 4. PRINTABLE OFFICIAL INFOGRAFIS REPORT FOR A4 / PDF PRINT */}
      <div id="printable-infografis-report" className="hidden print:block p-8 bg-white text-black font-sans">
        <KopSurat />
        <div className="text-center my-4">
          <h2 className="text-base font-black tracking-wider uppercase underline">
            INFOGRAFIS RESMI ALUR DAN MEKANISME TERPADU
          </h2>
          <p className="text-xs font-bold text-slate-800 uppercase tracking-wide mt-1">
            PROGRAM SAHABAT SPANJU (SEKOLAH AMAN, HARMONIS, ANTI BULLYING DAN TINDAK KEKERASAN)
          </p>
          <p className="text-[11px] text-slate-600 italic">
            UPTD SMP NEGERI 7 PASURUAN &bull; Permendikbudristek No. 46 Tahun 2023 &bull; Tahun Ajaran 2026/2027
          </p>
        </div>

        {/* Infografis Image Centered for Print */}
        <div className="w-full flex justify-center my-2 border border-slate-300 rounded-xl overflow-hidden p-2 bg-white">
          <img
            src={infografisImgUrl}
            alt="Infografis Sahabat SPANJU UPTD SMPN 7 Pasuruan"
            className="w-full max-h-[730px] object-contain mx-auto block"
          />
        </div>

        {/* Official Sign-off Block */}
        <div className="mt-4 pt-3 border-t border-slate-300 text-xs">
          <div className="flex justify-between items-start">
            <div className="text-left w-64">
              <p className="font-semibold text-slate-700">Mengetahui / Memvalidasi,</p>
              <p className="font-bold text-slate-900 mt-0.5">Koordinator TPPK &amp; Guru BK</p>
              <div className="h-16 flex items-center">
                <span className="text-[10px] text-slate-400 italic">[Tertanda Sah SPANJU]</span>
              </div>
              <p className="font-bold text-slate-950 underline">Wiwik Ismiati, S.Pd</p>
              <p className="text-[11px] text-slate-700">NIP. 19831116 200904 2 003</p>
            </div>

            <div className="text-right w-64">
              <p className="font-semibold text-slate-700">Pasuruan, 25 September 2026</p>
              <p className="font-bold text-slate-900 mt-0.5">Kepala UPT SMPN 7 Pasuruan</p>
              <div className="h-16 flex items-center justify-end">
                <span className="text-[10px] text-slate-400 italic">[Tertanda Sah Sekolah]</span>
              </div>
              <p className="font-bold text-slate-950 underline">Nur Fadilah, S.Pd,.M.Pd</p>
              <p className="text-[11px] text-slate-700">NIP. 19860410 201001 2 030</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 mt-4 pt-2 border-t border-dashed border-slate-300">
            Dokumen Infografis Sahabat SPANJU dicetak dari Sistem Layanan Terpadu Pencegahan &amp; Penanganan Kekerasan UPT SMPN 7 Pasuruan
          </div>
        </div>
      </div>
    </div>
  );
};
