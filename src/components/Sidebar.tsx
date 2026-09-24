import React, { useRef } from 'react';
import {
  LayoutGrid,
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
  GitFork,
  BookOpen,
  PhoneCall,
  Download,
  Upload,
  LogOut,
  ClipboardCheck,
  ChevronRight,
  Shield,
  Sparkles,
  X,
  Layers,
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';

import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
  onSelectTab?: (tab: ActiveTab) => void;
  currentUser: UserProfile;
  onLogout?: () => void;
  onOpenLogin?: () => void;
  onOpenMenuModal?: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenLogin,
  onOpenMenuModal,
  onExportBackup,
  onImportBackup,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleItemClick = (id: ActiveTab) => {
    if (onSelectTab) onSelectTab(id);
    else if (onTabChange) onTabChange(id);
    if (onCloseMobile) onCloseMobile();
  };

  const menuItems = [
    {
      id: 'menu_utama' as ActiveTab,
      label: 'Pilihan Menu Aplikasi',
      subtitle: 'Akses 1-Klik Seluruh Modul',
      icon: LayoutGrid,
      badge: 'Semua',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'survey_kepuasan' as ActiveTab,
      label: 'Survey Kepuasan Laporan',
      subtitle: 'Evaluasi & Masukan Responden',
      icon: ClipboardCheck,
      badge: 'Survey',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'infografis' as ActiveTab,
      label: 'Infografis Sahabat SPANJU',
      subtitle: 'Poster Digital & Komunitas',
      icon: Sparkles,
      badge: 'Resmi',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
    {
      id: 'bagan_alur' as ActiveTab,
      label: 'Bagan & Tolak Ukur',
      subtitle: 'Alur SOP Penanganan Kasus',
      icon: Layers,
      badge: 'Bagan',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      id: 'hotline' as ActiveTab,
      label: 'Hotline & Layanan',
      subtitle: '(0343) 426845 / 085168700953',
      icon: PhoneCall,
      badge: 'Hotline',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'zona_hijau' as ActiveTab,
      label: 'Zona Hijau & Analitik',
      subtitle: 'Grafik Kasus & Pivot 24 Kelas (7A–9H)',
      icon: ShieldCheck,
      badge: '24 Kelas',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'piket_harian' as ActiveTab,
      label: 'Piket Harian',
      subtitle: 'Temuan Harian & Foto Kegiatan',
      icon: ClipboardList,
    },
    {
      id: 'sabtu_beli_teh_ceri' as ActiveTab,
      label: 'Sabtu Beli Teh Ceri',
      subtitle: 'Cerita, Ide & Temuan 1 Minggu',
      icon: Coffee,
    },
    {
      id: 'kebun_luas_berseri' as ActiveTab,
      label: 'Kebun Luas Berseri',
      subtitle: 'Evaluasi Inovasi & RTL Sekolah',
      icon: Trees,
    },
    {
      id: 'senandung_serasi' as ActiveTab,
      label: 'Senandung Serasi',
      subtitle: 'Apresiasi & Literasi Ramah Anak',
      icon: Music2,
    },
    {
      id: 'e_lapor' as ActiveTab,
      label: 'E-Lapor Perundungan',
      subtitle: 'Pengaduan & Investigasi Kasus',
      icon: AlertTriangle,
      badge: 'KONFIDENSIAL',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    },
    {
      id: 'sp_damai' as ActiveTab,
      label: 'SP Damai Siswa',
      subtitle: 'Surat Perjanjian Mediasi & Tuntas',
      icon: Handshake,
    },
    {
      id: 'buku_tamu' as ActiveTab,
      label: 'Buku Tamu Digital',
      subtitle: 'Pencatatan Tamu & Kunjungan Resmi',
      icon: BookUser,
    },
    {
      id: 'media_edukasi' as ActiveTab,
      label: 'Media Edukasi Digital',
      subtitle: 'Video, Modul & Materi Edukatif',
      icon: Film,
    },
    {
      id: 'master_siswa' as ActiveTab,
      label: 'Master Data Siswa',
      subtitle: 'Database Siswa 24 Kelas',
      icon: Users2,
    },
    {
      id: 'master_guru' as ActiveTab,
      label: 'Master Data Guru',
      subtitle: 'Direktori Guru & Tenaga Kependidikan',
      icon: GraduationCap,
    },
    {
      id: 'tutorial' as ActiveTab,
      label: 'Tutorial Manual Book',
      subtitle: 'Buku Panduan Aplikasi Interaktif',
      icon: BookOpen,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-76 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding matching screenshot */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl p-0.5 border border-emerald-200 shadow-sm flex items-center justify-center flex-shrink-0 overflow-hidden bg-white">
              <img
                src="https://i.ibb.co.com/pBbfS44d/LOGO-PASS-TEMENAN.jpg"
                alt="Logo PASS TEMENAN"
                className="w-full h-full object-cover rounded-xl"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight text-slate-900 uppercase">
                SAHABAT SPANJU
              </div>
              <div className="text-[10px] font-extrabold text-emerald-700 tracking-wider uppercase">
                SMPN 7 PASURUAN
              </div>
              <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">
                PASS TEMENAN
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Profile Card (Blue outline / card matching screenshot) */}
        <div className="p-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between p-2.5 rounded-2xl border border-blue-200 bg-blue-50/40">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-200 flex items-center justify-center flex-shrink-0 text-blue-600">
                <Shield className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    @{currentUser.role === 'admin' ? 'admin' : (currentUser.name || 'tamu').toLowerCase().replace(/\s+/g, '')}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                    {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {currentUser.role === 'admin' ? 'Administrator / Operator Sekolah' : currentUser.name}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => (onLogout ? onLogout() : onOpenLogin?.())}
              title="Ganti Peran / Keluar"
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section Header: MENU SAHABAT SPANJU + 18 Modul badge */}
        <div className="px-4 pt-3 pb-1 flex items-center justify-between text-xs flex-shrink-0">
          <div
            onClick={onOpenMenuModal}
            className={`flex items-center gap-1.5 font-bold text-emerald-800 text-[11px] uppercase tracking-wider ${
              onOpenMenuModal ? 'cursor-pointer hover:text-emerald-950' : ''
            }`}
            title="Klik untuk membuka Popup Pilihan Menu"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>MENU SAHABAT SPANJU</span>
          </div>
          {onOpenMenuModal ? (
            <button
              type="button"
              onClick={onOpenMenuModal}
              className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
              title="Buka Popup Pilihan Menu"
            >
              18 Modul &bull; Popup
            </button>
          ) : (
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              18 Modul
            </span>
          )}
        </div>

        {/* Scrollable Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'menu_utama' && activeTab === 'menu');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer group ${
                  isActive
                    ? 'border-2 border-emerald-500 bg-emerald-50/50 shadow-2xs'
                    : 'border border-transparent hover:border-slate-200 hover:bg-slate-50/80 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-500 group-hover:text-emerald-700 group-hover:bg-emerald-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-emerald-950 font-extrabold' : 'text-slate-800'
                      }`}
                    >
                      {item.label}
                    </div>
                    {item.subtitle && (
                      <div className="text-[10px] text-slate-500 truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${
                        item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* PWA Install Button for Handphone & Laptop */}
        <PWAInstallButton variant="sidebar" />

        {/* Footer: Backup & Sync and Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3 text-emerald-600" />
              BACKUP &amp; SINKRONISASI
            </span>
            <button
              onClick={onLogout || onOpenLogin}
              className="text-[10px] text-blue-600 border border-blue-200 bg-blue-50/60 hover:bg-blue-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> Keluar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onExportBackup}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Backup JSON</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Upload JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImportBackup}
              className="hidden"
            />
          </div>

          <div className="text-[10px] text-center text-slate-400 pt-1">
            SMPN 7 Pasuruan &bull; E-Governance Sekolah Ramah
          </div>
        </div>
      </aside>
    </>
  );
};
