import React, { useState, useMemo } from 'react';
import {
  Layers,
  CheckCircle2,
  Search,
  ExternalLink,
  ClipboardCheck,
  Sparkles,
  BookOpen,
  PhoneCall,
  ShieldCheck,
  ClipboardList,
  Coffee,
  Trees,
  Music2,
  AlertTriangle,
  Handshake,
  BookUser,
  Film,
  Users2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { ActiveTab, SurveiKepuasanRecord, UserProfile } from '../types';

interface PilihanMenuAppViewProps {
  onSelectTab: (tab: ActiveTab) => void;
  surveiList: SurveiKepuasanRecord[];
  onSubmitSurvei: (data: Omit<SurveiKepuasanRecord, 'id' | 'createdAt'>) => void;
  currentUser: UserProfile;
}

interface MenuAppCard {
  id: ActiveTab | 'arsip_google_sites';
  title: string;
  subtitle: string;
  category: 'prioritas' | 'inovasi' | 'master';
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  isExternalLink?: boolean;
  externalUrl?: string;
}

export const PilihanMenuAppView: React.FC<PilihanMenuAppViewProps> = ({
  onSelectTab,
  currentUser,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allCards: MenuAppCard[] = [
    {
      id: 'survey_kepuasan',
      title: 'SURVEY KEPUASAN LAPORAN',
      subtitle: 'EVALUASI KEMUDAHAN & KEAMANAN SISTEM',
      category: 'prioritas',
      badge: 'Survey Resmi',
      icon: ClipboardCheck,
      iconBg: 'bg-emerald-600',
    },
    {
      id: 'infografis',
      title: 'INFOGRAFIS SAHABAT SPANJU',
      subtitle: 'BAGAN RESMI & ALUR LAYANAN SEKOLAH',
      category: 'master',
      badge: 'Resmi',
      icon: Sparkles,
      iconBg: 'bg-emerald-600',
    },
    {
      id: 'bagan_alur',
      title: 'BAGAN & TOLAK UKUR',
      subtitle: 'SOP PENANGANAN KEKERASAN & PERUNDUNGAN',
      category: 'master',
      badge: 'SOP Resmi',
      icon: Layers,
      iconBg: 'bg-indigo-700',
    },
    {
      id: 'tutorial',
      title: 'TUTORIAL MANUAL BOOK',
      subtitle: 'BUKU PANDUAN FLIPBOOK HEYZINE',
      category: 'master',
      badge: 'Panduan',
      icon: BookOpen,
      iconBg: 'bg-blue-600',
    },
    {
      id: 'hotline',
      title: 'HOTLINE & LAYANAN',
      subtitle: 'KONTAK SIAGA 24 JAM & KONSELING',
      category: 'prioritas',
      badge: 'Hotline',
      icon: PhoneCall,
      iconBg: 'bg-sky-600',
    },
    {
      id: 'zona_hijau',
      title: 'ZONA HIJAU & ANALITIK',
      subtitle: 'MONITORING IKHLAS & PIVOT 24 KELAS',
      category: 'inovasi',
      badge: '24 Rombel',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-700',
    },
    {
      id: 'piket_harian',
      title: 'PIKET HARIAN SISWA',
      subtitle: 'TEMUAN HARIAN & FOTO KEGIATAN',
      category: 'inovasi',
      badge: 'Harian',
      icon: ClipboardList,
      iconBg: 'bg-teal-600',
    },
    {
      id: 'sabtu_beli_teh_ceri',
      title: 'SABTU BELI TEH CERI',
      subtitle: 'CERITA, IDE & TEMUAN 1 MINGGU',
      category: 'inovasi',
      badge: 'Mingguan',
      icon: Coffee,
      iconBg: 'bg-amber-600',
    },
    {
      id: 'kebun_luas_berseri',
      title: 'KEBUN LUAS BERSERI',
      subtitle: 'EVALUASI & INOVASI 1 BULAN',
      category: 'inovasi',
      badge: 'Bulanan',
      icon: Trees,
      iconBg: 'bg-emerald-600',
    },
    {
      id: 'senandung_serasi',
      title: 'SENANDUNG SERASI',
      subtitle: 'SALAM RAMAH & LITERASI KARAKTER',
      category: 'inovasi',
      badge: 'Literasi',
      icon: Music2,
      iconBg: 'bg-indigo-600',
    },
    {
      id: 'e_lapor',
      title: 'E-LAPOR PERUNDUNGAN',
      subtitle: 'ADUAN KONFIDENSIAL & RESPON CEPAT',
      category: 'prioritas',
      badge: 'Konfidensial',
      icon: AlertTriangle,
      iconBg: 'bg-rose-600',
    },
    {
      id: 'sp_damai',
      title: 'SP DAMAI SISWA',
      subtitle: 'SURAT KESEPAKATAN MEDIASI TPPK',
      category: 'prioritas',
      badge: 'Restorative',
      icon: Handshake,
      iconBg: 'bg-cyan-600',
    },
    {
      id: 'buku_tamu',
      title: 'BUKU TAMU DIGITAL',
      subtitle: 'REGISTRASI KUNJUNGAN RESMI DINAS',
      category: 'prioritas',
      badge: 'Kedinasan',
      icon: BookUser,
      iconBg: 'bg-slate-800',
    },
    {
      id: 'media_edukasi',
      title: 'MEDIA EDUKASI DIGITAL',
      subtitle: 'MATERI, PANDUAN & VIDEO KAMPANYE',
      category: 'inovasi',
      badge: 'Edukasi',
      icon: Film,
      iconBg: 'bg-violet-600',
    },
    {
      id: 'master_siswa',
      title: 'MASTER DATA SISWA',
      subtitle: 'KELOLA DATABASE SISWA 24 KELAS',
      category: 'master',
      badge: 'Master',
      icon: Users2,
      iconBg: 'bg-teal-700',
    },
    {
      id: 'master_guru',
      title: 'MASTER DATA GURU',
      subtitle: 'PENDIDIK, WALI KELAS & TIM TPPK',
      category: 'master',
      badge: 'Master',
      icon: GraduationCap,
      iconBg: 'bg-blue-700',
    },
    {
      id: 'arsip_google_sites',
      title: 'ARSIP KEGIATAN SPANJU',
      subtitle: 'PORTAL DOKUMENTASI GOOGLE SITES',
      category: 'inovasi',
      badge: 'Web Portal',
      icon: Globe,
      iconBg: 'bg-slate-900',
      isExternalLink: true,
      externalUrl: 'https://sites.google.com/view/berandapasstemenanspanju/home',
    },
  ];

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      const matchCategory =
        activeCategory === 'semua' || card.category === activeCategory;
      const matchQuery =
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [allCards, activeCategory, searchQuery]);

  const handleCardClick = (card: MenuAppCard) => {
    if (card.isExternalLink && card.externalUrl) {
      window.open(card.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (card.id !== 'arsip_google_sites') {
      onSelectTab(card.id as ActiveTab);
    }
  };

  return (
    <div className="w-full space-y-7 animate-in fade-in duration-150">
      {/* SECTION 1: TOP BANNER (MATCHES SCREENSHOT) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            {/* Pill Capsule: MENU APLIKASI + SIAP SPANJU • SMPN 7 PASURUAN */}
            <div className="inline-flex items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-blue-600 text-white font-black text-[11px] tracking-wide shadow-2xs">
                MENU APLIKASI
              </span>
              <span className="text-slate-500 font-extrabold text-xs tracking-wider uppercase">
                SIAP SPANJU &bull; SMPN 7 PASURUAN
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2.5">
              Daftar Semua Menu Aplikasi
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
              Pilih modul atau inovasi di bawah ini dengan mengklik tombol{' '}
              <strong className="text-slate-900 font-bold">Buka Aplikasi</strong> pada kartu yang diinginkan.
            </p>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-3 flex-shrink-0 self-start lg:self-center">
            {/* Button 1: Bagan & Tolak Ukur */}
            <button
              type="button"
              onClick={() => onSelectTab('bagan_alur')}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-600" />
              <span>Bagan &amp; Tolak Ukur</span>
            </button>

            {/* Button 2: Dashboard Utama */}
            <button
              type="button"
              onClick={() => onSelectTab('zona_hijau')}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Dashboard Utama</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: FILTER PILLS & SEARCH BAR (MATCHES SCREENSHOT) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Scrollable Pill Filter Tabs with Bottom Scroll Hint */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('semua')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'semua'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua Aplikasi ({allCards.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('prioritas')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'prioritas'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Layanan Prioritas
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('inovasi')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'inovasi'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Inovasi Karakter
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('master')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'master'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Master &amp; Setup
            </button>
          </div>

          {/* Subtle scrollbar with < and > indicator */}
          <div className="flex items-center gap-1 mt-1 text-slate-300">
            <ChevronLeft className="w-3 h-3 text-slate-400" />
            <div className="h-1 w-44 bg-slate-200/80 rounded-full" />
            <ChevronRight className="w-3 h-3 text-slate-400" />
          </div>
        </div>

        {/* Right: Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aplikasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {/* SECTION 3: 3-COLUMN CARD GRID (MATCHES SCREENSHOT EXACTLY) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-between text-center group"
            >
              {/* Center Squircle Icon with Floating Badge */}
              <div className="relative mt-2 mb-4">
                {card.badge && (
                  <span className="absolute -top-2.5 -right-4 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs whitespace-nowrap">
                    {card.badge}
                  </span>
                )}
                <div
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-3xl ${card.iconBg} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200`}
                >
                  <Icon className="w-9 h-9 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="w-full px-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase leading-snug group-hover:text-blue-700 transition-colors">
                  {card.title}
                </h2>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1.5 min-h-[32px] flex items-center justify-center">
                  {card.subtitle}
                </div>
              </div>

              {/* Buka Aplikasi Button */}
              <button
                type="button"
                onClick={() => handleCardClick(card)}
                className="w-full mt-5 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-bold shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Buka Aplikasi</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
