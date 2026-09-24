import React, { useState, useMemo } from 'react';
import {
  X,
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
  Globe,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface PilihanMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  currentActiveTab?: ActiveTab;
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

export const PilihanMenuModal: React.FC<PilihanMenuModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  currentActiveTab,
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

  if (!isOpen) return null;

  const handleSelect = (card: MenuAppCard) => {
    if (card.isExternalLink && card.externalUrl) {
      window.open(card.externalUrl, '_blank', 'noopener,noreferrer');
    } else if (card.id !== 'arsip_google_sites') {
      onSelectTab(card.id as ActiveTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-white px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                  POPUP PILIHAN MENU
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase hidden sm:inline">
                  Sahabat SPANJU &bull; SMPN 7 Pasuruan
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Pilih Modul &amp; Aplikasi Sekolah
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Tutup Popup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white/80 backdrop-blur-xs px-5 py-3 sm:px-6 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sticky top-[73px] z-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveCategory('semua')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'semua'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Semua ({allCards.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('prioritas')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'master'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Master &amp; Setup
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari modul aplikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Modal Body: Cards Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              Tidak ada modul aplikasi yang sesuai dengan kata kunci pencarian.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredCards.map((card) => {
                const Icon = card.icon;
                const isActive = currentActiveTab === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelect(card)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                      isActive
                        ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-white hover:bg-slate-50/90 border-slate-200/90 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    {/* Badge top-right */}
                    {card.badge && (
                      <span className="absolute top-3 right-3 text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors">
                        {card.badge}
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl ${card.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="pr-12">
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                          {card.title}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5 line-clamp-1">
                          {card.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                      <span className={isActive ? 'text-blue-700 flex items-center gap-1' : 'text-slate-500 group-hover:text-slate-800'}>
                        {isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Sedang Dibuka</span>
                          </>
                        ) : (
                          'Buka Modul Ini &rarr;'
                        )}
                      </span>

                      {card.isExternalLink && (
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="text-[11px]">
            Total <strong>{allCards.length} Modul &amp; Inovasi</strong> tersedia di Sahabat SPANJU
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
