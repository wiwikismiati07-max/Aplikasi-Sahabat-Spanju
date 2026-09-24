import React, { useState } from 'react';
import {
  BookOpen,
  ExternalLink,
  Layers,
  RefreshCw,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface TutorialHeyzineViewProps {
  onOpenMenu: () => void;
}

export const TutorialHeyzineView: React.FC<TutorialHeyzineViewProps> = ({
  onOpenMenu,
}) => {
  const flipbookUrl = 'https://heyzine.com/flip-book/45802adfc1.html';
  const [key, setKey] = useState<number>(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* 1. TOP HEADER BANNER (MATCHES SCREENSHOT EXACTLY) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          {/* Pill Badge & Subtitle */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-[11px] uppercase tracking-wider shadow-2xs">
              TUTORIAL MANUAL BOOK
            </span>
            <span className="text-slate-400 font-bold">•</span>
            <span className="text-slate-600 font-extrabold text-xs tracking-wider uppercase">
              FLIPBOOK HEYZINE • SMPN 7 PASURUAN
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            Panduan Interaktif &amp; Manual Book
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Buku panduan digital resmi Sahabat SPANJU (Sekolah Aman, Harmonis, Anti Bullying). Baca halaman demi halaman langsung di bawah ini.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto flex-wrap sm:flex-nowrap flex-shrink-0">
          {/* Pilihan Menu Button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all border border-slate-200 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-slate-600" />
            <span>Pilihan Menu</span>
          </button>

          {/* Buka di Tab Baru Button */}
          <a
            href={flipbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#e11d48] hover:bg-rose-700 active:bg-rose-800 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-white" />
            <span>Buka di Tab Baru</span>
          </a>
        </div>
      </div>

      {/* 2. READER STATUS BAR (MATCHES SCREENSHOT EXACTLY) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:px-5 flex items-center justify-between shadow-2xs">
        {/* Left: Green indicator dot + label */}
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-slate-800">
            Heyzine Flipbook Reader Active
          </span>
        </div>

        {/* Right: Refresh & Full Link buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            title="Muat Ulang Flipbook"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Refresh</span>
          </button>
          <a
            href={flipbookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200"
            title="Buka Tautan Lengkap"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>Full Link</span>
          </a>
        </div>
      </div>

      {/* 3. FLIPBOOK VIEWER CONTAINER (MATCHES SCREENSHOT EXACTLY) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Container Header Bar */}
        <div className="bg-[#1e293b] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span>MANUAL BOOK SAHABAT SPANJU – HEYZINE FLIPBOOK</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 truncate max-w-full sm:max-w-md">
            URL: {flipbookUrl}
          </span>
        </div>

        {/* Embedded Iframe */}
        <div className="w-full h-[600px] sm:h-[750px] lg:h-[820px] bg-slate-900 relative">
          <iframe
            key={key}
            src={flipbookUrl}
            title="Manual Book Sahabat SPANJU"
            className="w-full h-full border-0"
            allow="fullscreen; clipboard-write"
            allowFullScreen
          />
        </div>
      </div>

      {/* 4. CHAPTER OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Bab 1: Panduan Pengguna &amp; Login</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Akses multi-peran Siswa, Guru BK, Wali Kelas, Kepala Sekolah, dan Administrator.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle className="w-4 h-4 text-sky-600" />
            <span>Bab 2: Modul Pembiasaan &amp; E-Lapor</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tata cara input Piket Harian, Sabtu Beli Teh Ceri, aduan rahasia E-Lapor, dan SP Damai.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span>Bab 3: Analitik Zona Hijau 24 Kelas</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Pemantauan grafik status aman, cetak Berita Acara resmi, dan evaluasi bulanan.
          </p>
        </div>
      </div>
    </div>
  );
};
