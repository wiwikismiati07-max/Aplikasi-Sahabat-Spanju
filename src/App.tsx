import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  UserCheck,
  Shield,
  ShieldCheck,
  Layers,
  Sparkles,
  Info,
  Clock,
  LogOut,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  ActiveTab,
  UserProfile,
  KelasZona,
  PiketRecord,
  CeriRecord,
  KebunRecord,
  SerasiRecord,
  ELaporRecord,
  SPDamaiRecord,
  BukuTamuRecord,
  SiswaMaster,
  GuruMaster,
  MediaEdukasiItem,
  SurveiKepuasanRecord,
} from './types';
import {
  initialKelasZona,
  initialPiket,
  initialCeri,
  initialKebun,
  initialSerasi,
  initialELapor,
  initialSPDamai,
  initialBukuTamu,
  initialSiswa,
  initialGuru,
  initialMedia,
  initialSurvei,
} from './data/initialData';
import { fetchTableData, saveTableData, bulkReplaceTableData, deleteTableData } from './lib/api';

// Components
import { Sidebar } from './components/Sidebar';
import { LoginModal } from './components/LoginModal';
import { InfografisWelcomeModal } from './components/InfografisWelcomeModal';
import { PilihanMenuAppView } from './components/PilihanMenuAppView';
import { ZonaHijauAnalyticsView } from './components/ZonaHijauAnalyticsView';
import { PiketHarianView } from './components/PiketHarianView';
import { SabtuBeliTehCeriView } from './components/SabtuBeliTehCeriView';
import { KebunLuasBerseriView } from './components/KebunLuasBerseriView';
import { SenandungSerasiView } from './components/SenandungSerasiView';
import { ELaporView } from './components/ELaporView';
import { SPDamaiView } from './components/SPDamaiView';
import { BukuTamuView } from './components/BukuTamuView';
import { MediaEdukasiView } from './components/MediaEdukasiView';
import { MasterSiswaView, MasterGuruView } from './components/MasterDataViews';
import { BaganAlurSOPView } from './components/BaganAlurSOPView';
import { InfografisSpanjuView } from './components/InfografisSpanjuView';
import { TutorialHeyzineView } from './components/TutorialHeyzineView';
import { HotlineView } from './components/HotlineView';
import { SurveiKepuasanSection } from './components/SurveiKepuasanSection';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  // Current active navigation tab (Default to 'bagan_alur' for Bagan & Alur Penanganan)
  const [activeTab, setActiveTab] = useState<ActiveTab>('bagan_alur');

  // Sidebar & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isInfografisOpen, setIsInfografisOpen] = useState(false);

  // Current User Session (Default Admin: Wiwik Ismiati, S.Pd)
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user_admin',
    nama: 'WIWIK ISMIATI, S.Pd',
    role: 'admin',
    jabatan: 'Koordinator TPPK / Guru BK',
    nip: '19831116 200904 2 003',
  });

  // State Collections with localStorage + Supabase fallbacks
  const [kelasList, setKelasList] = useState<KelasZona[]>(() => {
    const saved = localStorage.getItem('spanju_kelas_v1');
    return saved ? JSON.parse(saved) : initialKelasZona;
  });

  const [piketList, setPiketList] = useState<PiketRecord[]>(() => {
    const saved = localStorage.getItem('spanju_piket_v1');
    return saved ? JSON.parse(saved) : initialPiket;
  });

  const [ceriList, setCeriList] = useState<CeriRecord[]>(() => {
    const saved = localStorage.getItem('spanju_ceri_v1');
    return saved ? JSON.parse(saved) : initialCeri;
  });

  const [kebunList, setKebunList] = useState<KebunRecord[]>(() => {
    const saved = localStorage.getItem('spanju_kebun_v1');
    return saved ? JSON.parse(saved) : initialKebun;
  });

  const [serasiList, setSerasiList] = useState<SerasiRecord[]>(() => {
    const saved = localStorage.getItem('spanju_serasi_v1');
    return saved ? JSON.parse(saved) : initialSerasi;
  });

  const [eLaporList, setELaporList] = useState<ELaporRecord[]>(() => {
    const saved = localStorage.getItem('spanju_elapor_v1');
    return saved ? JSON.parse(saved) : initialELapor;
  });

  const [spDamaiList, setSPDamaiList] = useState<SPDamaiRecord[]>(() => {
    const saved = localStorage.getItem('spanju_spdamai_v1');
    return saved ? JSON.parse(saved) : initialSPDamai;
  });

  const [tamuList, setTamuList] = useState<BukuTamuRecord[]>(() => {
    const saved = localStorage.getItem('spanju_tamu_v1');
    return saved ? JSON.parse(saved) : initialBukuTamu;
  });

  const [siswaList, setSiswaList] = useState<SiswaMaster[]>(() => {
    const saved = localStorage.getItem('spanju_siswa_v1');
    return saved ? JSON.parse(saved) : initialSiswa;
  });

  const [guruList, setGuruList] = useState<GuruMaster[]>(() => {
    const saved = localStorage.getItem('spanju_guru_v1');
    return saved ? JSON.parse(saved) : initialGuru;
  });

  const [mediaList, setMediaList] = useState<MediaEdukasiItem[]>(() => {
    const saved = localStorage.getItem('spanju_media_v1');
    return saved ? JSON.parse(saved) : initialMedia;
  });

  const [surveiList, setSurveiList] = useState<SurveiKepuasanRecord[]>(() => {
    const saved = localStorage.getItem('spanju_survei_v1');
    return saved ? JSON.parse(saved) : initialSurvei;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('spanju_kelas_v1', JSON.stringify(kelasList));
  }, [kelasList]);

  useEffect(() => {
    localStorage.setItem('spanju_piket_v1', JSON.stringify(piketList));
  }, [piketList]);

  useEffect(() => {
    localStorage.setItem('spanju_ceri_v1', JSON.stringify(ceriList));
  }, [ceriList]);

  useEffect(() => {
    localStorage.setItem('spanju_kebun_v1', JSON.stringify(kebunList));
  }, [kebunList]);

  useEffect(() => {
    localStorage.setItem('spanju_serasi_v1', JSON.stringify(serasiList));
  }, [serasiList]);

  useEffect(() => {
    localStorage.setItem('spanju_elapor_v1', JSON.stringify(eLaporList));
  }, [eLaporList]);

  useEffect(() => {
    localStorage.setItem('spanju_spdamai_v1', JSON.stringify(spDamaiList));
  }, [spDamaiList]);

  useEffect(() => {
    localStorage.setItem('spanju_tamu_v1', JSON.stringify(tamuList));
  }, [tamuList]);

  useEffect(() => {
    localStorage.setItem('spanju_siswa_v1', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('spanju_guru_v1', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('spanju_media_v1', JSON.stringify(mediaList));
  }, [mediaList]);

  useEffect(() => {
    localStorage.setItem('spanju_survei_v1', JSON.stringify(surveiList));
  }, [surveiList]);

  // Try loading cloud data from Supabase asynchronously on initial mount
  useEffect(() => {
    async function loadCloudData() {
      try {
        const cloudPiket = await fetchTableData<PiketRecord>('piket_harian');
        if (cloudPiket && cloudPiket.length > 0) setPiketList(cloudPiket);

        const cloudCeri = await fetchTableData<CeriRecord>('sabtu_beli_teh_ceri');
        if (cloudCeri && cloudCeri.length > 0) setCeriList(cloudCeri);

        const cloudKebun = await fetchTableData<KebunRecord>('kebun_luas_berseri');
        if (cloudKebun && cloudKebun.length > 0) setKebunList(cloudKebun);

        const cloudSerasi = await fetchTableData<SerasiRecord>('senandung_serasi');
        if (cloudSerasi && cloudSerasi.length > 0) setSerasiList(cloudSerasi);

        const cloudELapor = await fetchTableData<ELaporRecord>('e_lapor');
        if (cloudELapor && cloudELapor.length > 0) setELaporList(cloudELapor);

        const cloudSPDamai = await fetchTableData<SPDamaiRecord>('sp_damai');
        if (cloudSPDamai && cloudSPDamai.length > 0) setSPDamaiList(cloudSPDamai);

        const cloudTamu = await fetchTableData<BukuTamuRecord>('buku_tamu');
        if (cloudTamu && cloudTamu.length > 0) setTamuList(cloudTamu);

        const cloudSiswa = await fetchTableData<SiswaMaster>('master_siswa');
        if (cloudSiswa && cloudSiswa.length > 0) setSiswaList(cloudSiswa);

        const cloudGuru = await fetchTableData<GuruMaster>('master_guru');
        if (cloudGuru && cloudGuru.length > 0) setGuruList(cloudGuru);

        const cloudSurvei = await fetchTableData<SurveiKepuasanRecord>('survei_kepuasan');
        if (cloudSurvei && cloudSurvei.length > 0) setSurveiList(cloudSurvei);
      } catch {
        // Fallback to local storage
      }
    }
    loadCloudData();
  }, []);

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'operator';

  // Handler helpers
  const handleUpdateKelas = (kelasName: string, updated: Partial<KelasZona>) => {
    setKelasList((prev) =>
      prev.map((k) => (k.kelas === kelasName ? { ...k, ...updated } : k))
    );
  };

  const handleAddPiket = async (data: Omit<PiketRecord, 'id' | 'createdAt'>) => {
    const newItem: PiketRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setPiketList((prev) => [newItem, ...prev]);
    saveTableData('piket_harian', newItem);
  };

  const handleUpdatePiket = (id: string, data: Partial<PiketRecord>) => {
    setPiketList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeletePiket = (id: string) => {
    setPiketList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddCeri = (data: Omit<CeriRecord, 'id' | 'createdAt'>) => {
    const newItem: CeriRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setCeriList((prev) => [newItem, ...prev]);
    saveTableData('sabtu_beli_teh_ceri', newItem);
  };

  const handleUpdateCeri = (id: string, data: Partial<CeriRecord>) => {
    setCeriList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeleteCeri = (id: string) => {
    setCeriList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddKebun = (data: Omit<KebunRecord, 'id' | 'createdAt'>) => {
    const newItem: KebunRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setKebunList((prev) => [newItem, ...prev]);
    saveTableData('kebun_luas_berseri', newItem);
  };

  const handleUpdateKebun = (id: string, data: Partial<KebunRecord>) => {
    setKebunList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeleteKebun = (id: string) => {
    setKebunList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSerasi = (data: Omit<SerasiRecord, 'id' | 'createdAt'>) => {
    const newItem: SerasiRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setSerasiList((prev) => [newItem, ...prev]);
    saveTableData('senandung_serasi', newItem);
  };

  const handleUpdateSerasi = (id: string, data: Partial<SerasiRecord>) => {
    setSerasiList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeleteSerasi = (id: string) => {
    setSerasiList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddELapor = (data: Omit<ELaporRecord, 'id' | 'createdAt'>) => {
    const newItem: ELaporRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setELaporList((prev) => [newItem, ...prev]);
    saveTableData('e_lapor', newItem);
  };

  const handleUpdateELapor = (id: string, data: Partial<ELaporRecord>) => {
    setELaporList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeleteELapor = (id: string) => {
    setELaporList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSPDamai = (data: Omit<SPDamaiRecord, 'id' | 'createdAt'>) => {
    const newItem: SPDamaiRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setSPDamaiList((prev) => [newItem, ...prev]);
    saveTableData('sp_damai', newItem);
  };

  const handleUpdateSPDamai = (id: string, data: Partial<SPDamaiRecord>) => {
    setSPDamaiList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeleteSPDamai = (id: string) => {
    setSPDamaiList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddTamu = (data: Omit<BukuTamuRecord, 'id' | 'createdAt'>) => {
    const newItem: BukuTamuRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setTamuList((prev) => [newItem, ...prev]);
    saveTableData('buku_tamu', newItem);
  };

  const handleUpdateTamu = (id: string, data: Partial<BukuTamuRecord>) => {
    setTamuList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  const handleDeleteTamu = (id: string) => {
    setTamuList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddSiswa = (siswa: SiswaMaster) => {
    setSiswaList((prev) => [siswa, ...prev]);
    saveTableData('master_siswa', siswa);
  };

  const handleImportBulkSiswa = (imported: SiswaMaster[], replaceAll = false) => {
    if (replaceAll) {
      setSiswaList(imported);
      bulkReplaceTableData('master_siswa', imported);
    } else {
      setSiswaList((prev) => [...imported, ...prev]);
      imported.forEach((s) => saveTableData('master_siswa', s));
    }
  };

  const handleClearAllSiswa = () => {
    setSiswaList([]);
    bulkReplaceTableData('master_siswa', []);
  };

  const handleDeleteSiswa = (id: string) => {
    setSiswaList((prev) => prev.filter((s) => s.id !== id));
    deleteTableData('master_siswa', id);
  };

  const handleAddGuru = (guru: GuruMaster) => {
    setGuruList((prev) => [guru, ...prev]);
    saveTableData('master_guru', guru);
  };

  const handleImportBulkGuru = (imported: GuruMaster[], replaceAll = false) => {
    if (replaceAll) {
      setGuruList(imported);
      bulkReplaceTableData('master_guru', imported);
    } else {
      setGuruList((prev) => [...imported, ...prev]);
      imported.forEach((g) => saveTableData('master_guru', g));
    }
  };

  const handleClearAllGuru = () => {
    setGuruList([]);
    bulkReplaceTableData('master_guru', []);
  };

  const handleDeleteGuru = (id: string) => {
    setGuruList((prev) => prev.filter((g) => g.id !== id));
    deleteTableData('master_guru', id);
  };

  const handleAddMedia = (data: Omit<MediaEdukasiItem, 'id'>) => {
    const newItem: MediaEdukasiItem = { ...data, id: String(Date.now()) };
    setMediaList((prev) => [newItem, ...prev]);
    saveTableData('media_edukasi', newItem);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddSurvei = (data: Omit<SurveiKepuasanRecord, 'id' | 'createdAt'>) => {
    const newItem: SurveiKepuasanRecord = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setSurveiList((prev) => [newItem, ...prev]);
    saveTableData('survei_kepuasan', newItem);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              onClick={() => setActiveTab('zona_hijau')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Official Seal / Logo PASS TEMENAN */}
              <div className="w-11 h-11 rounded-2xl bg-white p-0.5 border border-emerald-300 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                <img
                  src="/pwa-192x192.png"
                  alt="Logo PASS TEMENAN"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800">
                    APLIKASI SAHABAT SPANJU
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan SMP Negeri 7 Pasuruan
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    PASS TEMENAN
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Dashboard Manajemen Aplikasi Terintegrasi &amp; Penguatan Karakter Ramah Anak
                </p>
              </div>
            </div>
          </div>

          {/* Right: Install PWA, Infografis Button, Tahun Ajaran, Zona Hijau, Pilihan Menu, User Capsule, Keluar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Install PWA Button (HP & Laptop) */}
            <PWAInstallButton variant="navbar" />

            {/* Infografis SPANJU button */}
            <button
              type="button"
              onClick={() => setIsInfografisOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Infografis SPANJU</span>
            </button>

            {/* Tahun Ajaran badge */}
            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Tahun Ajaran 2026/2027</span>
            </div>

            {/* Zona Hijau Aman badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zona Hijau Aman</span>
            </div>

            {/* Pilihan Menu Aplikasi button (Solid Blue) */}
            <button
              type="button"
              onClick={() => setActiveTab('menu_utama')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Pilihan Menu Aplikasi</span>
            </button>

            {/* User Profile Capsule */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-slate-800">
                  {currentUser.role === 'admin' ? 'Administrator / Operator Sekolah' : (currentUser.nama || currentUser.name)}
                  <span className="text-slate-400 font-normal text-[10px] ml-1">
                    (@{currentUser.role === 'admin' ? 'admin' : 'user'})
                  </span>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                {currentUser.role.toUpperCase()}
              </span>
            </div>

            {/* Keluar Button */}
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Keluar / Ganti Akun"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-76 flex-shrink-0">
          <div className="sticky top-20 bg-white rounded-3xl border border-slate-200 shadow-xs p-2 overflow-hidden">
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tab: ActiveTab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentUser={currentUser}
              onOpenLogin={() => setIsLoginModalOpen(true)}
            />
          </div>
        </div>

        {/* Mobile Slide-over Sidebar Drawer */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative w-80 max-w-full bg-white h-full shadow-2xl z-10 flex flex-col p-4 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    7
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase">
                      Sahabat SPANJU
                    </h3>
                    <p className="text-[10px] text-slate-500">SMPN 7 Pasuruan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeTab={activeTab}
                  onSelectTab={(tab: ActiveTab) => {
                    setActiveTab(tab);
                    setIsSidebarOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  currentUser={currentUser}
                  onOpenLogin={() => {
                    setIsSidebarOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Dynamic View Content */}
        <main className="flex-1 min-w-0">
          {(activeTab === 'menu_utama' || activeTab === 'menu') && (
            <PilihanMenuAppView
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              surveiList={surveiList}
              onSubmitSurvei={handleAddSurvei}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'zona_hijau' && (
            <ZonaHijauAnalyticsView
              kelasList={kelasList}
              onUpdateKelas={handleUpdateKelas}
              guruList={guruList}
              siswaList={siswaList}
              eLaporList={eLaporList}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'piket_harian' && (
            <PiketHarianView
              piketList={piketList}
              onAddPiket={handleAddPiket}
              onUpdatePiket={handleUpdatePiket}
              onDeletePiket={handleDeletePiket}
              siswaList={siswaList}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'sabtu_beli_teh_ceri' && (
            <SabtuBeliTehCeriView
              ceriList={ceriList}
              onAddCeri={handleAddCeri}
              onUpdateCeri={handleUpdateCeri}
              onDeleteCeri={handleDeleteCeri}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'kebun_luas_berseri' && (
            <KebunLuasBerseriView
              kebunList={kebunList}
              onAddKebun={handleAddKebun}
              onUpdateKebun={handleUpdateKebun}
              onDeleteKebun={handleDeleteKebun}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'senandung_serasi' && (
            <SenandungSerasiView
              serasiList={serasiList}
              onAddSerasi={handleAddSerasi}
              onUpdateSerasi={handleUpdateSerasi}
              onDeleteSerasi={handleDeleteSerasi}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'e_lapor' && (
            <ELaporView
              eLaporList={eLaporList}
              onAddELapor={handleAddELapor}
              onUpdateELapor={handleUpdateELapor}
              onDeleteELapor={handleDeleteELapor}
              siswaList={siswaList}
              currentUser={currentUser}
              onOpenMenu={() => setActiveTab('menu_utama')}
            />
          )}

          {activeTab === 'sp_damai' && (
            <SPDamaiView
              spDamaiList={spDamaiList}
              onAddSPDamai={handleAddSPDamai}
              onUpdateSPDamai={handleUpdateSPDamai}
              onDeleteSPDamai={handleDeleteSPDamai}
              siswaList={siswaList}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'buku_tamu' && (
            <BukuTamuView
              tamuList={tamuList}
              onAddTamu={handleAddTamu}
              onUpdateTamu={handleUpdateTamu}
              onDeleteTamu={handleDeleteTamu}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'media_edukasi' && (
            <MediaEdukasiView
              mediaList={mediaList}
              onAddMedia={handleAddMedia}
              onDeleteMedia={handleDeleteMedia}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'master_siswa' && (
            <MasterSiswaView
              siswaList={siswaList}
              onAddSiswa={handleAddSiswa}
              onImportBulkSiswa={handleImportBulkSiswa}
              onClearAllSiswa={handleClearAllSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'master_guru' && (
            <MasterGuruView
              guruList={guruList}
              onAddGuru={handleAddGuru}
              onImportBulkGuru={handleImportBulkGuru}
              onClearAllGuru={handleClearAllGuru}
              onDeleteGuru={handleDeleteGuru}
              onOpenMenu={() => setActiveTab('menu_utama')}
              isAdmin={isAdmin}
            />
          )}

          {activeTab === 'bagan_alur' && (
            <BaganAlurSOPView
              onOpenMenu={() => setActiveTab('menu_utama')}
              onProceedToLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {activeTab === 'infografis' && (
            <InfografisSpanjuView
              onOpenMenu={() => setActiveTab('menu_utama')}
              onProceedToLogin={() => setIsLoginModalOpen(true)}
            />
          )}

          {activeTab === 'tutorial' && (
            <TutorialHeyzineView onOpenMenu={() => setActiveTab('menu_utama')} />
          )}

          {activeTab === 'survey_kepuasan' && (
            <SurveiKepuasanSection
              surveiList={surveiList}
              onSubmitSurvei={handleAddSurvei}
              currentUser={currentUser}
              isCompactBanner={false}
            />
          )}

          {activeTab === 'hotline' && (
            <HotlineView onOpenMenu={() => setActiveTab('menu_utama')} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-500">
          <div>
            <div className="font-bold text-slate-800">
              APLIKASI SAHABAT SPANJU &bull; UPT SMP NEGERI 7 PASURUAN
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Komunitas PASS TEMENAN (Sekolah Aman, Harmonis, Anti Bullying dan Tindak Kekerasan)
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Jl. Ki Hajar Dewantara No. 27, Tembokrejo, Kec. Purworejo, Kota Pasuruan, Jawa Timur 67118
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Database Cloud Multi-User Aktif
            </span>
            <a
              href="https://sites.google.com/view/berandapasstemenanspanju/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Arsip Kegiatan Google Sites</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Login / Portal Selection Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(user: UserProfile, redirectTab?: string) => {
          setCurrentUser(user);
          if (redirectTab) {
            setActiveTab(redirectTab as ActiveTab);
          } else {
            setActiveTab('menu_utama');
          }
          setIsLoginModalOpen(false);
        }}
      />

      {/* Infografis Welcome Modal */}
      <InfografisWelcomeModal
        isOpen={isInfografisOpen}
        onClose={() => setIsInfografisOpen(false)}
        onProceedToLogin={() => {
          setIsInfografisOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
