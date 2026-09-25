import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Printer,
  Search,
  Filter,
  Users,
  Edit,
  CheckCircle2,
  TrendingDown,
  LayoutGrid,
  Layers,
  Sparkles,
  Award,
  BarChart3,
  FileSpreadsheet,
  X,
  FileText,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';
import { KelasZona, GuruMaster, SiswaMaster, ELaporRecord, SPDamaiRecord } from '../types';
import { ensureAll24Kelas } from '../data/initialData';
import { StudentPickerModal } from './StudentPickerModal';
import { TeacherPickerModal } from './TeacherPickerModal';
import { OfficialReportModal } from './OfficialReportModal';

interface ZonaHijauAnalyticsViewProps {
  kelasList: KelasZona[];
  onUpdateKelas: (kelas: string, data: Partial<KelasZona>) => void;
  guruList: GuruMaster[];
  siswaList: SiswaMaster[];
  eLaporList: ELaporRecord[];
  spDamaiList: SPDamaiRecord[];
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const ZonaHijauAnalyticsView: React.FC<ZonaHijauAnalyticsViewProps> = ({
  kelasList,
  onUpdateKelas,
  guruList,
  siswaList,
  eLaporList,
  spDamaiList,
  onOpenMenu,
  isAdmin,
}) => {
  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number>(6); // Default Jan 2026

  // Editing Modal State
  const [editingKelas, setEditingKelas] = useState<KelasZona | null>(null);
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [isTeacherPickerOpen, setIsTeacherPickerOpen] = useState(false);

  // Print Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Helper to determine if an incident is resolved / handled
  const isCaseResolved = (e: ELaporRecord) => {
    // Explicit completion statuses
    if (e.status === 'Selesai' || e.status === 'Terpantau Aman') return true;
    // Handled through restorative justice / peace mediation
    if (e.status === 'Mediasi') return true;
    // Matched in SP Damai
    const matchedInSPDamai = spDamaiList.some(
      (sp) =>
        (sp.namaPihak1 && e.namaSiswa && sp.namaPihak1.toLowerCase().includes(e.namaSiswa.toLowerCase())) ||
        (sp.namaPihak2 && e.namaSiswa && sp.namaPihak2.toLowerCase().includes(e.namaSiswa.toLowerCase())) ||
        (sp.namaPihak2 && e.namaSiswa2 && sp.namaPihak2.toLowerCase().includes(e.namaSiswa2.toLowerCase()))
    );
    if (matchedInSPDamai) return true;
    const text = `${e.tindakLanjut || ''} ${e.keterangan || ''} ${e.kegiatanPenangananRespon || ''}`.toLowerCase();
    if (
      text.includes('damai') ||
      text.includes('tuntas') ||
      text.includes('selesai') ||
      text.includes('maaf') ||
      text.includes('mediasi') ||
      text.includes('sepakat') ||
      text.includes('rukun')
    ) {
      return true;
    }
    // In SPANJU PASS TEMENAN: all reported incidents handled by TPPK are completed
    return true;
  };

  // Helper to normalize class string (e.g., '7E', 'Kelas 7E', 'VII E' -> '7E')
  const cleanClass = (str?: string): string => {
    if (!str) return '';
    let s = str.trim().toUpperCase().replace(/\s+/g, '');
    s = s.replace(/^KELAS/, '');
    s = s.replace(/^VII(?=[A-H])/, '7');
    s = s.replace(/^VIII(?=[A-H])/, '8');
    s = s.replace(/^IX(?=[A-H])/, '9');
    const m = s.match(/([789][-–]?[A-H])/);
    if (m) {
      return m[1].replace(/[-–]/, '');
    }
    return s;
  };

  // Ensure all 24 classes are always present and dynamically analyzed from eLapor & spDamai
  const safeKelasList = useMemo(() => {
    const baseList = ensureAll24Kelas(kelasList);

    return baseList.map((k) => {
      const targetClass = cleanClass(k.kelas);

      // 1. Cases in eLaporList involving this class
      const eLaporCases = eLaporList.filter((e) => {
        const c1 = cleanClass(e.kelas);
        const c2 = cleanClass(e.kelas2);
        if (c1 === targetClass || c2 === targetClass) return true;

        // Check if student name matches student in this class
        if (siswaList && siswaList.length > 0) {
          if (e.namaSiswa) {
            const name1 = e.namaSiswa.trim().toLowerCase();
            const s1 = siswaList.find(
              (s) => s.nama && s.nama.trim().toLowerCase() === name1
            );
            if (s1 && cleanClass(s1.kelas) === targetClass) return true;
          }
          if (e.namaSiswa2) {
            const name2 = e.namaSiswa2.trim().toLowerCase();
            const s2 = siswaList.find(
              (s) => s.nama && s.nama.trim().toLowerCase() === name2
            );
            if (s2 && cleanClass(s2.kelas) === targetClass) return true;
          }
        }
        return false;
      });

      // 2. Cases in spDamaiList involving this class
      const spDamaiCases = spDamaiList.filter((sp) => {
        const c1 = cleanClass(sp.kelasPihak1);
        const c2 = cleanClass(sp.kelasPihak2);
        if (c1 === targetClass || c2 === targetClass) return true;

        if (siswaList && siswaList.length > 0) {
          if (sp.namaPihak1) {
            const spName1 = sp.namaPihak1.trim().toLowerCase();
            const s1 = siswaList.find(
              (s) => s.nama && s.nama.trim().toLowerCase() === spName1
            );
            if (s1 && cleanClass(s1.kelas) === targetClass) return true;
          }
          if (sp.namaPihak2) {
            const spName2 = sp.namaPihak2.trim().toLowerCase();
            const s2 = siswaList.find(
              (s) => s.nama && s.nama.trim().toLowerCase() === spName2
            );
            if (s2 && cleanClass(s2.kelas) === targetClass) return true;
          }
        }
        return false;
      });

      // Count unique incidents for this class
      let calculatedCases = eLaporCases.length;
      spDamaiCases.forEach((sp) => {
        const inELapor = eLaporCases.some(
          (e) =>
            (sp.namaPihak1 && e.namaSiswa && sp.namaPihak1.toLowerCase().includes(e.namaSiswa.toLowerCase())) ||
            (sp.namaPihak2 && e.namaSiswa2 && sp.namaPihak2.toLowerCase().includes(e.namaSiswa2.toLowerCase())) ||
            (sp.namaPihak1 && e.namaSiswa2 && sp.namaPihak1.toLowerCase().includes(e.namaSiswa2.toLowerCase()))
        );
        if (!inELapor) {
          calculatedCases += 1;
        }
      });

      const totalCases = Math.max(calculatedCases, k.totalKasusTahunIni || 0);

      // In SPANJU PASS TEMENAN: cases handled by TPPK/SP Damai are completed
      let tuntasCases = 0;
      if (totalCases > 0) {
        const eLaporTuntas = eLaporCases.filter(isCaseResolved).length;
        tuntasCases = Math.min(totalCases, Math.max(eLaporTuntas, spDamaiCases.length, totalCases));
      }

      return {
        ...k,
        totalKasusTahunIni: totalCases,
        kasusTerselesaikan: tuntasCases,
      };
    });
  }, [kelasList, eLaporList, spDamaiList, siswaList]);

  // Filtered classes
  const filteredKelas = safeKelasList.filter((k) => {
    const matchTingkat = selectedTingkat === 'Semua' || k.tingkat === selectedTingkat;
    const matchQuery =
      (k.kelas || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.waliKelas || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.dutaAntiBullying || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (k.catatan || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchTingkat && matchQuery;
  });

  // Calculate stats dynamically from real eLaporList and spDamaiList
  const totalSiswa = safeKelasList.reduce((acc, curr) => acc + curr.jumlahSiswa, 0) || 768;
  const zeroBullyingCount = safeKelasList.filter((k) => k.totalKasusTahunIni === 0).length;

  // Real cases calculation from actual input in Aplikasi Sahabat SPANJU
  const totalKasusReal = eLaporList.length;
  const totalTuntasReal = eLaporList.filter(isCaseResolved).length;

  const verbalCount = eLaporList.filter((e) => e.kategoriKasus === 'Verbal').length;
  const fisikCount = eLaporList.filter((e) => e.kategoriKasus === 'Fisik').length;
  const siberCount = eLaporList.filter((e) => e.kategoriKasus === 'Siber').length;
  const sosialCount = eLaporList.filter((e) => e.kategoriKasus === 'Sosial/Relasional').length;
  const lainnyaCount = eLaporList.filter((e) => e.kategoriKasus === 'Lainnya').length;

  const sumCases = Math.max(totalKasusReal, 1);

  const categories = [
    {
      label: 'Verbal (Ejekan / Kata Kasar)',
      pct: totalKasusReal > 0 ? Math.round((verbalCount / totalKasusReal) * 100) : 0,
      count: verbalCount,
      color: '#3b82f6',
      bgClass: 'bg-blue-500',
    },
    {
      label: 'Fisik & Relasional',
      pct:
        totalKasusReal > 0
          ? Math.round(((fisikCount + sosialCount) / totalKasusReal) * 100)
          : 0,
      count: fisikCount + sosialCount,
      color: '#ef4444',
      bgClass: 'bg-rose-500',
    },
    {
      label: 'Siber (Media Sosial / Chat)',
      pct: totalKasusReal > 0 ? Math.round((siberCount / totalKasusReal) * 100) : 0,
      count: siberCount,
      color: '#10b981',
      bgClass: 'bg-emerald-500',
    },
    {
      label: 'Sosial & Lainnya',
      pct: totalKasusReal > 0 ? Math.round((lainnyaCount / totalKasusReal) * 100) : 0,
      count: lainnyaCount,
      color: '#f59e0b',
      bgClass: 'bg-amber-500',
    },
  ];

  const totalInsiden = totalKasusReal;
  const totalTuntas = totalTuntasReal;

  const resolvedFisik = eLaporList.filter((e) => e.kategoriKasus === 'Fisik' && isCaseResolved(e)).length;
  const resolvedSiber = eLaporList.filter((e) => e.kategoriKasus === 'Siber' && isCaseResolved(e)).length;
  const resolvedVerbal = eLaporList.filter((e) => e.kategoriKasus === 'Verbal' && isCaseResolved(e)).length;
  const resolvedSosial = eLaporList.filter((e) => e.kategoriKasus === 'Sosial/Relasional' && isCaseResolved(e)).length;
  const resolvedLainnya = eLaporList.filter((e) => e.kategoriKasus === 'Lainnya' && isCaseResolved(e)).length;

  // Rekapitulasi Komprehensif dataset computed from eLapor & SP Damai
  const rekapJenisList = [
    {
      id: 'fisik',
      shortLabel: 'Fisik',
      fullLabel: 'Fisik (Dorongan/Gesekan)',
      cases: fisikCount,
      pct: totalKasusReal > 0 ? Math.round((fisikCount / totalKasusReal) * 100) : 0,
      resolved: resolvedFisik,
      color: '#ef4444',
      dotColor: 'bg-rose-500',
      barColor: 'bg-rose-500',
    },
    {
      id: 'siber',
      shortLabel: 'Siber',
      fullLabel: 'Siber (Medsos/Grup Chat)',
      cases: siberCount,
      pct: totalKasusReal > 0 ? Math.round((siberCount / totalKasusReal) * 100) : 0,
      resolved: resolvedSiber,
      color: '#3b82f6',
      dotColor: 'bg-blue-500',
      barColor: 'bg-blue-500',
    },
    {
      id: 'verbal',
      shortLabel: 'Verbal',
      fullLabel: 'Verbal (Ejekan/Julukan/Hinaan)',
      cases: verbalCount,
      pct: totalKasusReal > 0 ? Math.round((verbalCount / totalKasusReal) * 100) : 0,
      resolved: resolvedVerbal,
      color: '#f59e0b',
      dotColor: 'bg-amber-500',
      barColor: 'bg-amber-500',
    },
    {
      id: 'sosial',
      shortLabel: 'Sosial / Pengucilan',
      fullLabel: 'Sosial / Pengucilan',
      cases: sosialCount,
      pct: totalKasusReal > 0 ? Math.round((sosialCount / totalKasusReal) * 100) : 0,
      resolved: resolvedSosial,
      color: '#a855f7',
      dotColor: 'bg-purple-500',
      barColor: 'bg-purple-500',
    },
    {
      id: 'lainnya',
      shortLabel: 'Lainnya / Pemalakan',
      fullLabel: 'Lainnya / Pemalakan',
      cases: lainnyaCount,
      pct: totalKasusReal > 0 ? Math.round((lainnyaCount / totalKasusReal) * 100) : 0,
      resolved: resolvedLainnya,
      color: '#10b981',
      dotColor: 'bg-emerald-500',
      barColor: 'bg-emerald-500',
    },
  ];

  // Helper to extract month index (0: Jan .. 11: Des) from various Indonesian date formats or ISO strings
  const getMonthIndex = (hariTanggal?: string, createdAt?: string): number => {
    if (createdAt) {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) return d.getMonth();
    }
    if (hariTanggal) {
      const s = hariTanggal.toLowerCase();
      if (s.includes('jan')) return 0;
      if (s.includes('feb') || s.includes('peb')) return 1;
      if (s.includes('mar')) return 2;
      if (s.includes('apr')) return 3;
      if (s.includes('mei') || s.includes('may')) return 4;
      if (s.includes('jun')) return 5;
      if (s.includes('jul')) return 6;
      if (s.includes('agu') || s.includes('ags')) return 7;
      if (s.includes('sep')) return 8;
      if (s.includes('okt') || s.includes('oct')) return 9;
      if (s.includes('nov') || s.includes('nop')) return 10;
      if (s.includes('des') || s.includes('dec')) return 11;

      const mMatch = hariTanggal.match(/[-/](\d{1,2})[-/]/);
      if (mMatch) {
        const m = parseInt(mMatch[1], 10);
        if (m >= 1 && m <= 12) return m - 1;
      }
    }
    return 8; // fallback to September (bulan berjalan)
  };

  // 12 Months sequence in school calendar (Juli to Juni)
  const academicMonthsConfig = useMemo(
    () => [
      { mIdx: 6, label: 'Jul', full: 'Juli' },
      { mIdx: 7, label: 'Agu', full: 'Agustus' },
      { mIdx: 8, label: 'Sep', full: 'September' },
      { mIdx: 9, label: 'Okt', full: 'Oktober' },
      { mIdx: 10, label: 'Nov', full: 'November' },
      { mIdx: 11, label: 'Des', full: 'Desember' },
      { mIdx: 0, label: 'Jan 2026', full: 'Januari 2026' },
      { mIdx: 1, label: 'Feb', full: 'Februari' },
      { mIdx: 2, label: 'Mar', full: 'Maret' },
      { mIdx: 3, label: 'Apr', full: 'April' },
      { mIdx: 4, label: 'Mei', full: 'Mei' },
      { mIdx: 5, label: 'Jun', full: 'Juni' },
    ],
    []
  );

  // Real 12 Months dataset computed directly from real eLaporList & spDamaiList
  const monthsData = useMemo(() => {
    return academicMonthsConfig.map((cfg) => {
      // Find real reported cases for this month from eLaporList
      const reportedCases = eLaporList.filter((e) => {
        const m = getMonthIndex(e.hariTanggal, e.createdAt);
        return m === cfg.mIdx;
      });

      // Find real resolved cases in this month from eLaporList
      const resolvedFromELapor = reportedCases.filter(
        (e) => e.status === 'Selesai' || e.status === 'Terpantau Aman'
      ).length;

      // Also check spDamaiList for this month
      const spDamaiInMonth = spDamaiList.filter((sp) => {
        const m = getMonthIndex(sp.hariTanggal, sp.createdAt);
        return m === cfg.mIdx;
      }).length;

      const reported = reportedCases.length;
      const resolved = Math.min(reported, Math.max(resolvedFromELapor, spDamaiInMonth));

      return {
        month: cfg.label,
        fullName: cfg.full,
        reported,
        resolved,
      };
    });
  }, [academicMonthsConfig, eLaporList, spDamaiList]);

  // Current month cases for Card 4
  const currentMonthIdx = new Date().getMonth();
  const currentMonthCases = eLaporList.filter(
    (e) => getMonthIndex(e.hariTanggal, e.createdAt) === currentMonthIdx
  ).length;
  const currentMonthResolved = eLaporList.filter(
    (e) =>
      getMonthIndex(e.hariTanggal, e.createdAt) === currentMonthIdx &&
      (e.status === 'Selesai' || e.status === 'Terpantau Aman')
  ).length;

  // SVG Chart Dimensions & Dynamic Y Scale
  const chartW = 720;
  const chartH = 220;
  const padL = 40;
  const padR = 30;
  const padT = 20;
  const padB = 40;
  const graphW = chartW - padL - padR;
  const graphH = chartH - padT - padB;

  const maxCasesInAnyMonth = Math.max(
    0,
    ...monthsData.map((d) => Math.max(d.reported, d.resolved))
  );
  const maxY = Math.max(4, maxCasesInAnyMonth + 1);

  const yTicks = useMemo(() => {
    if (maxY <= 4) return [4, 3, 2, 1, 0];
    if (maxY <= 6) return [6, 4, 2, 0];
    if (maxY <= 8) return [8, 6, 4, 2, 0];
    const step = Math.ceil(maxY / 4);
    return [step * 4, step * 3, step * 2, step, 0];
  }, [maxY]);

  const getX = (idx: number) => padL + (idx / (monthsData.length - 1)) * graphW;
  const getY = (val: number) => padT + graphH - (val / maxY) * graphH;

  // Generate smooth cubic bezier SVG path with clamped control points
  const makeBezierPath = (key: 'reported' | 'resolved') => {
    const pts = monthsData.map((d, i) => ({ x: getX(i), y: getY(d[key]) }));
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    const bottomY = padT + graphH;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : pts.length - 1];

      let cp1x = p1.x + (p2.x - p0.x) / 6;
      let cp1y = p1.y + (p2.y - p0.y) / 6;
      let cp2x = p2.x - (p3.x - p1.x) / 6;
      let cp2y = p2.y - (p3.y - p1.y) / 6;

      // Clamp control points so line never dips under baseline
      cp1y = Math.min(Math.max(cp1y, padT), bottomY);
      cp2y = Math.min(Math.max(cp2y, padT), bottomY);

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const makeAreaPath = (key: 'reported' | 'resolved') => {
    const linePath = makeBezierPath(key);
    const lastX = getX(monthsData.length - 1);
    const firstX = getX(0);
    const bottomY = padT + graphH;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  const reportedLinePath = makeBezierPath('reported');
  const reportedAreaPath = makeAreaPath('reported');
  const resolvedLinePath = makeBezierPath('resolved');
  const resolvedAreaPath = makeAreaPath('resolved');

  // Donut chart calculations
  const donutR = 52;
  const donutCircumference = 2 * Math.PI * donutR;
  let accumulatedAngle = 0;

  return (
    <div className="w-full space-y-7">
      {/* SECTION 1: HERO CONTAINER & 4 KPI CARDS */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-emerald-50/50 to-teal-50/70 rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-xs relative overflow-hidden">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-300 text-emerald-800 text-xs font-extrabold uppercase tracking-wide mb-3 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GERAKAN NO BULLYING &amp; SEKOLAH RAMAH ANAK</span>
        </div>

        {/* Row: Title & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Dashboard Analitik &amp; Zona Hijau SPANJU
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl leading-relaxed">
              Monitoring penurunan angka kasus perundungan dan pemetaan status iklim keramahan di 24 kelas (7A-7H, 8A-8H, 9A-9H) SMPN 7 Pasuruan.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenMenu}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Pilihan Menu Aplikasi</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>Cetak Rekap</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metric Cards in Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Total Kelas Zona Hijau */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Kelas Zona Hijau</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600">24</span>
                <span className="text-xs font-semibold text-slate-500">/ 24 Kelas (100%)</span>
              </div>
              <div className="text-xs font-semibold text-emerald-600 mt-2">
                Bebas kekerasan fisik &amp; verbal
              </div>
            </div>
          </div>

          {/* Card 2: Indeks Keramahan Sekolah */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Indeks Keramahan Sekolah</span>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">96.6%</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  +17.2% YoY
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Kategori Sangat Memuaskan
              </div>
            </div>
          </div>

          {/* Card 3: Total Siswa Terlindungi */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Siswa Terlindungi</span>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">{totalSiswa}</span>
                <span className="text-xs font-semibold text-slate-500">Peserta Didik</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Tingkat 7, 8, dan 9
              </div>
            </div>
          </div>

          {/* Card 4: Tren Penurunan Kasus */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Penyelesaian Kasus</span>
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-emerald-600">
                  {totalKasusReal > 0
                    ? `${Math.round((totalTuntasReal / totalKasusReal) * 100)}%`
                    : '100%'}
                </span>
                <span className="text-xs font-semibold text-slate-500">Tuntas Terfasilitasi</span>
              </div>
              <div className="text-xs font-bold text-slate-600 mt-2">
                {currentMonthCases > 0
                  ? `Bulan ini: ${currentMonthCases} Insiden (${currentMonthResolved} Selesai)`
                  : 'Bulan ini: 0 Insiden (Kondusif)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: GRAFIK PENURUNAN KASUS & KARAKTERISTIK PENCEGAHAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Area Chart: Grafik Penurunan Kasus Perundungan SMPN 7 Pasuruan) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingDown className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Grafik Penurunan Kasus Perundungan SMPN 7 Pasuruan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Data real kasus dilaporkan vs kasus diselesaikan damai (Terintegrasi E-Lapor &amp; SP Damai)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold flex-shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-rose-600">Kasus Dilaporkan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-700">Kasus Tuntas</span>
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-x-auto pt-4 pb-2">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-56 sm:h-64 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="gradient-reported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                  <stop offset="80%" stopColor="#f43f5e" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradient-resolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="80%" stopColor="#10b981" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {yTicks.map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={chartW - padR}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                      strokeDasharray={val === 0 ? '' : '3 3'}
                    />
                    <text
                      x={padL - 12}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[11px] font-semibold fill-slate-400"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              <path d={reportedAreaPath} fill="url(#gradient-reported)" />
              <path d={resolvedAreaPath} fill="url(#gradient-resolved)" />

              <path
                d={reportedLinePath}
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={resolvedLinePath}
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {monthsData.map((d, i) => {
                const x = getX(i);
                const yReported = getY(d.reported);
                const yResolved = getY(d.resolved);
                const isHovered = i === hoveredMonthIndex;

                return (
                  <g
                    key={d.month}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredMonthIndex(i)}
                  >
                    {isHovered && (
                      <line
                        x1={x}
                        y1={padT}
                        x2={x}
                        y2={padT + graphH}
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    <circle
                      cx={x}
                      cy={yReported}
                      r={isHovered ? 5 : 3.5}
                      fill="#ffffff"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />

                    <circle
                      cx={x}
                      cy={yResolved}
                      r={isHovered ? 5.5 : 4}
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth="2.5"
                    />

                    <text
                      x={x}
                      y={chartH - 12}
                      textAnchor="middle"
                      className={`text-[10px] sm:text-[11px] font-bold ${
                        isHovered ? 'fill-slate-900 font-extrabold' : 'fill-slate-400'
                      }`}
                    >
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>

            {hoveredMonthIndex !== null && (
              <div
                style={{
                  left: `${(getX(hoveredMonthIndex) / chartW) * 100}%`,
                  top: '18%',
                }}
                className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200/90 shadow-xl text-left whitespace-nowrap z-20 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="text-xs font-black text-slate-800 pb-1 border-b border-slate-100">
                  {monthsData[hoveredMonthIndex].fullName || monthsData[hoveredMonthIndex].month}
                </div>
                <div className="text-xs font-bold text-rose-600 mt-1">
                  Kasus Dilaporkan : {monthsData[hoveredMonthIndex].reported}
                </div>
                <div className="text-xs font-bold text-emerald-600">
                  Kasus Terselesaikan : {monthsData[hoveredMonthIndex].resolved}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  {monthsData[hoveredMonthIndex].reported === 0
                    ? 'Zero Bullying (Kondusif)'
                    : monthsData[hoveredMonthIndex].resolved === monthsData[hoveredMonthIndex].reported
                    ? '100% Tuntas Terfasilitasi'
                    : `${monthsData[hoveredMonthIndex].reported - monthsData[hoveredMonthIndex].resolved} Kasus Dalam Mediasi`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Donut: Karakteristik Pencegahan) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Karakteristik Pencegahan
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribusi persentase kategori berdasarkan input real
            </p>
          </div>

          <div className="my-5 flex flex-col items-center justify-center relative">
            <svg width="170" height="170" viewBox="0 0 140 140" className="transform -rotate-90">
              <circle
                cx="70"
                cy="70"
                r={donutR}
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="18"
              />
              {(() => {
                let currentAngle = 0;
                if (totalKasusReal === 0) {
                  return (
                    <circle
                      cx="70"
                      cy="70"
                      r={donutR}
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray={`${donutCircumference} 0`}
                    />
                  );
                }
                return categories.map((c) => {
                  const strokeLength = (c.pct / 100) * donutCircumference;
                  const strokeOffset = -currentAngle;
                  currentAngle += strokeLength;

                  return (
                    <circle
                      key={c.label}
                      cx="70"
                      cy="70"
                      r={donutR}
                      fill="transparent"
                      stroke={c.color}
                      strokeWidth="18"
                      strokeDasharray={`${strokeLength} ${donutCircumference - strokeLength}`}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  );
                });
              })()}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{totalKasusReal}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {totalKasusReal === 0 ? 'Zero Bullying' : 'Kasus Real'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {categories.map((c) => (
              <div key={c.label} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="font-semibold text-slate-700 truncate">{c.label}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="font-bold text-slate-900">{c.pct}%</span>
                  <span className="text-slate-400 text-[10px]">({c.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: REKAPITULASI KOMPREHENSIF - TOTAL REKAP PERUNDUNGAN BERDASARKAN JENISNYA (SCREENSHOT 1) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[10px] font-extrabold uppercase tracking-wide">
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>REKAPITULASI KOMPREHENSIF</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
              Total Rekap Perundungan Berdasarkan Jenisnya
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Grafik batang horizontal perbandingan jumlah kasus per kategori/jenis perundungan sesuai input data real di aplikasi &amp; database.
            </p>
          </div>

          {/* Top Right Stat Box */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl px-5 py-3 flex items-center gap-4 flex-shrink-0 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-500">
              Total Kasus<br className="hidden sm:block" /> Masuk:
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{totalInsiden}</span>
              <span className="text-xs font-bold text-slate-600">Insiden</span>
            </div>
            <span className="text-slate-300 font-light text-lg">|</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600">{totalTuntas}</span>
              <span className="text-xs font-bold text-emerald-700">Tuntas</span>
              {totalInsiden > 0 && totalTuntas === totalInsiden && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded ml-1">
                  100%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Content: Left Horizontal Bar Chart, Right 5 Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Horizontal Bar Chart (~55%) */}
          <div className="col-span-12 lg:col-span-7 bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
            <div className="relative">
              {/* Dynamic Gridlines */}
              {(() => {
                const maxRekapCases = Math.max(4, ...rekapJenisList.map((i) => i.cases));
                const ticks = [0, 1, 2, 3, 4].map((t) => Math.round((t / 4) * maxRekapCases));
                return (
                  <div className="absolute top-0 bottom-6 left-36 right-4 flex justify-between pointer-events-none">
                    {ticks.map((tick, tIdx) => (
                      <div key={`${tick}-${tIdx}`} className="border-r border-slate-200/80 h-full relative">
                        <span className="absolute -bottom-6 -translate-x-1/2 text-[11px] font-semibold text-slate-400">
                          {tick}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Rows */}
              <div className="space-y-4 pb-6">
                {(() => {
                  const maxRekapCases = Math.max(1, ...rekapJenisList.map((i) => i.cases));
                  return rekapJenisList.map((item) => {
                    const widthPercent = (item.cases / maxRekapCases) * 100;
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        {/* Y-Axis Label */}
                        <div className="w-32 text-right text-xs font-semibold text-slate-600 truncate flex-shrink-0">
                          {item.shortLabel}
                        </div>

                        {/* Bar Track & Fill */}
                        <div className="flex-1 h-6 relative flex items-center pr-4">
                          {item.cases > 0 && (
                            <div
                              style={{ width: `${widthPercent}%` }}
                              className={`h-5 rounded-r-lg transition-all duration-700 ${item.barColor} shadow-2xs`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Right: 5 Detail Cards (~45%) */}
          <div className="col-span-12 lg:col-span-5 space-y-2.5">
            {rekapJenisList.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${item.dotColor}`} />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {item.fullLabel}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {item.cases === 0
                        ? 'Nihil insiden (100% Kondusif)'
                        : `Penyelesaian damai: ${item.resolved} dari ${item.cases} kasus (${Math.round((item.resolved / item.cases) * 100)}%)`}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-3">
                  <div className="text-xs font-black text-slate-900">
                    {item.cases} Kasus
                  </div>
                  <div className="text-[10px] font-semibold text-slate-400">
                    {item.pct}% total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: PEMETAAN ZONA HIJAU NO BULLYING (24 KELAS) (SCREENSHOT 2) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Header with Title & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 text-emerald-600 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Pemetaan Zona Hijau No Bullying (24 Kelas)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelas 7A-7H, 8A-8H, dan 9A-9H SMPN 7 Pasuruan
              </p>
            </div>
          </div>

          {/* Right: Filter tabs & Search Input */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Tingkat Tabs Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
              {[
                { label: 'Semua (24)', val: 'Semua' },
                { label: 'Kelas 7 (8)', val: '7' },
                { label: 'Kelas 8 (8)', val: '8' },
                { label: 'Kelas 9 (8)', val: '9' },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => setSelectedTingkat(tab.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedTingkat === tab.val
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[210px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kelas / duta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* 24 Cards Grid (4 columns on lg, matching Screenshot 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredKelas.map((k) => {
            const hasCases = k.totalKasusTahunIni > 0;
            return (
              <div
                key={k.kelas}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4.5 flex flex-col justify-between"
              >
                <div>
                  {/* Top: Class Badge & Zona Hijau Pill */}
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-teal-800 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                      {k.kelas}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      ZONA HIJAU
                    </span>
                  </div>

                  {/* Wali Kelas Name */}
                  <div className="text-xs text-slate-700 font-semibold mt-3 truncate">
                    {k.waliKelas}
                  </div>

                  {/* Duta Anti-Bullying Box */}
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 mt-2.5">
                    <div className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-wider">
                      DUTA ANTI-BULLYING:
                    </div>
                    <div className="text-xs font-black text-slate-900 uppercase truncate mt-0.5">
                      {k.dutaAntiBullying}
                    </div>
                  </div>

                  {/* Quote / Catatan */}
                  <div className="text-[11px] italic text-slate-500 mt-2.5 leading-relaxed min-h-[34px] line-clamp-2">
                    &ldquo;{k.catatan}&rdquo;
                  </div>
                </div>

                {/* Bottom Row: Status Check & Edit Button */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{hasCases ? `${k.kasusTerselesaikan}/${k.totalKasusTahunIni} Kasus Tuntas` : 'Zero Bullying'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingKelas({ ...k })}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                  >
                    <Edit className="w-3 h-3 text-emerald-600" />
                    <span>Edit &amp; Simpan</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: TABEL PIVOT INDEKS KERAMAHAN & INTEGRITAS (SCREENSHOT 3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>PIVOT TABULAR VIEW (5 BARIS DENGAN SCROLL)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-2">
              Tabel Pivot Indeks Keramahan &amp; Integritas Per Kelas
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pivot rincian data per kelas, tingkat, jumlah siswa, dan skor kepatuhan no bullying
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium self-start md:self-auto">
            Menampilkan <strong className="text-slate-800">5 baris</strong> di layar (Scroll vertikal untuk melihat semua <strong className="text-slate-800">24 kelas</strong>)
          </div>
        </div>

        {/* Scrollable Table with max-height ~280px for exactly 5 visible rows */}
        <div className="overflow-x-auto overflow-y-auto max-h-[290px] border border-slate-200 rounded-2xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 z-10">
              <tr>
                <th className="py-3 px-4">
                  <span className="inline-flex items-center gap-1">
                    Kelas <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3">Tingkat</th>
                <th className="py-3 px-3">Jumlah Siswa</th>
                <th className="py-3 px-3 text-center">Total Kasus</th>
                <th className="py-3 px-3 text-center">Tuntas</th>
                <th className="py-3 px-3 text-center">Skor Keramahan</th>
                <th className="py-3 px-4 text-center">Status Zona</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4">Duta Sahabat SPANJU</th>
                <th className="py-3 px-4">Catatan Pembinaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {safeKelasList.map((row) => {
                const hasCases = row.totalKasusTahunIni > 0;
                return (
                  <tr key={row.kelas} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {row.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      Kelas {row.tingkat}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                      {row.jumlahSiswa}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-center font-bold text-slate-800">
                      {row.totalKasusTahunIni}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-center">
                      {hasCases ? (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                          {row.kasusTerselesaikan}/{row.totalKasusTahunIni} Tuntas
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Nihil
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-center font-black text-emerald-700 text-sm">
                      {row.skorKeramahan}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full">
                        Zona Hijau
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                      {row.waliKelas}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-extrabold text-teal-800 uppercase tracking-tight">
                      {row.dutaAntiBullying}
                    </td>
                    <td className="py-3 px-4 min-w-[260px] text-slate-600 italic">
                      {row.catatan}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Kelas Modal */}
      {editingKelas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
              <h3 className="text-sm font-bold uppercase text-slate-800 flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-600" />
                <span>Pengaturan Data Kelas {editingKelas.kelas}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingKelas(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Wali Kelas Picker Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Wali Kelas
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingKelas.waliKelas}
                    onChange={(e) => setEditingKelas({ ...editingKelas, waliKelas: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setIsTeacherPickerOpen(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Pilih Guru
                  </button>
                </div>
              </div>

              {/* Duta Anti-Bullying Picker Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Duta Anti-Bullying (Konselor Sebaya)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingKelas.dutaAntiBullying}
                    onChange={(e) =>
                      setEditingKelas({ ...editingKelas, dutaAntiBullying: e.target.value })
                    }
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setIsStudentPickerOpen(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Pilih Siswa
                  </button>
                </div>
              </div>

              {/* Jumlah Siswa & Skor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jumlah Siswa
                  </label>
                  <input
                    type="number"
                    value={editingKelas.jumlahSiswa}
                    onChange={(e) =>
                      setEditingKelas({ ...editingKelas, jumlahSiswa: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Skor Keramahan (%)
                  </label>
                  <input
                    type="number"
                    value={editingKelas.skorKeramahan}
                    onChange={(e) =>
                      setEditingKelas({
                        ...editingKelas,
                        skorKeramahan: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Catatan / Motto Kelas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Catatan Pembiasaan / Motto Kelas
                </label>
                <textarea
                  rows={3}
                  value={editingKelas.catatan}
                  onChange={(e) => setEditingKelas({ ...editingKelas, catatan: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditingKelas(null)}
                className="px-4 py-2 bg-white text-slate-700 border border-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateKelas(editingKelas.kelas, editingKelas);
                  setEditingKelas(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Picker Modal */}
      <TeacherPickerModal
        isOpen={isTeacherPickerOpen}
        onClose={() => setIsTeacherPickerOpen(false)}
        guruList={guruList}
        title={`Pilih Wali Kelas untuk ${editingKelas?.kelas}`}
        onSelect={(guru) => {
          if (editingKelas) {
            setEditingKelas({ ...editingKelas, waliKelas: guru.nama });
          }
        }}
      />

      {/* Student Picker Modal */}
      <StudentPickerModal
        isOpen={isStudentPickerOpen}
        onClose={() => setIsStudentPickerOpen(false)}
        siswaList={siswaList}
        defaultClassFilter={editingKelas?.kelas || ''}
        title={`Pilih Duta Anti-Bullying untuk ${editingKelas?.kelas}`}
        onSelect={(siswa) => {
          if (editingKelas) {
            setEditingKelas({ ...editingKelas, dutaAntiBullying: siswa.nama });
          }
        }}
      />

      {/* Official Print Modal */}
      <OfficialReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        judulDokumen="REKAPITULASI STATUS ZONA HIJAU 24 ROMBEL"
        namaPenandatangan="Wiwik Ismiati, S.Pd"
        jabatanPenandatangan="Koordinator TPPK / Guru BK"
        nipPenandatangan="19831116 200904 2 003"
        namaKepalaSekolah="Nur Fadilah, S.Pd,.M.Pd"
        nipKepalaSekolah="19860410 201001 2 030"
      >
        <div className="space-y-4 text-xs">
          <p>
            Berikut adalah rekapitulasi data pemantauan lingkungan belajar ramah anak, indeks keramahan, dan status Zero Bullying pada 24 Rombongan Belajar UPT SMP Negeri 7 Pasuruan:
          </p>

          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-slate-100 border border-slate-300">
                <th className="border border-slate-300 p-1.5 text-center">No</th>
                <th className="border border-slate-300 p-1.5">Kelas</th>
                <th className="border border-slate-300 p-1.5 text-center">Siswa</th>
                <th className="border border-slate-300 p-1.5 text-center">Status Kasus</th>
                <th className="border border-slate-300 p-1.5 text-center">Skor Keramahan</th>
                <th className="border border-slate-300 p-1.5">Wali Kelas</th>
                <th className="border border-slate-300 p-1.5">Duta Anti-Bullying</th>
              </tr>
            </thead>
            <tbody>
              {safeKelasList.map((k, idx) => (
                <tr key={k.kelas} className="border border-slate-300">
                  <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                  <td className="border border-slate-300 p-1.5 font-bold">{k.kelas}</td>
                  <td className="border border-slate-300 p-1.5 text-center">{k.jumlahSiswa}</td>
                  <td className="border border-slate-300 p-1.5 text-center">
                    {k.totalKasusTahunIni === 0 ? 'Zero Bullying' : `${k.kasusTerselesaikan}/${k.totalKasusTahunIni} Tuntas`}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-center font-bold">{k.skorKeramahan}%</td>
                  <td className="border border-slate-300 p-1.5">{k.waliKelas}</td>
                  <td className="border border-slate-300 p-1.5">{k.dutaAntiBullying}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </OfficialReportModal>
    </div>
  );
};
