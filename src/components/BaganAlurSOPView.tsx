import React, { useState } from 'react';
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowRight,
  X,
  FileText,
  Sliders,
  GitBranch,
  ShieldAlert,
} from 'lucide-react';

interface BaganAlurSOPViewProps {
  onOpenMenu: () => void;
  onProceedToLogin?: () => void;
}

interface DiagramItem {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  sourceUrl: string;
  description: string;
  keyPoints: string[];
}

export const BaganAlurSOPView: React.FC<BaganAlurSOPViewProps> = ({
  onOpenMenu,
  onProceedToLogin,
}) => {
  // State for active filter/tab or viewing all
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>('all');

  // Zoom levels per diagram
  const [zoomLevels, setZoomLevels] = useState<Record<string, number>>({
    alur_penanganan: 1,
    struktur_tolak_ukur: 1,
    alur_penilaian: 1,
    respon_tindak_lanjut: 1,
  });

  // Fullscreen modal preview
  const [fullscreenImage, setFullscreenImage] = useState<{
    title: string;
    url: string;
  } | null>(null);

  const diagrams: DiagramItem[] = [
    {
      id: 'alur_penanganan',
      number: 1,
      title: 'Alur Penanganan Kekerasan dan Perundungan',
      subtitle:
        'Bagan standar operasional (SOP) untuk penanganan kasus kekerasan dan perundungan di sekolah.',
      badge: 'SOP Resmi PPKSP',
      imageUrl: 'https://i.ibb.co.com/4ntsk04H/ALUR-PENANGANAN-PASS-TEMENAN.png',
      sourceUrl: 'https://i.ibb.co.com/4ntsk04H/ALUR-PENANGANAN-PASS-TEMENAN.png',
      description:
        'Alur terintegrasi pencegahan dan penanganan kekerasan siswa di lingkungan UPT SMP Negeri 7 Pasuruan bersama Konselor Sebaya PASS TEMENAN dan Tim TPPK.',
      keyPoints: [
        'Penerimaan Laporan & Perlindungan Identitas',
        'Verifikasi & Klasifikasi Tingkat Kasus',
        'Mediasi Restorative Justice SP Damai',
        'Pemulihan Karakter & Pendampingan Pembiasaan',
      ],
    },
    {
      id: 'struktur_tolak_ukur',
      number: 2,
      title: 'Bagan Struktur Tolak Ukur E-Pass Temenan',
      subtitle:
        'Struktur indikator, parameter tolak ukur, dan instrumen pembiasaan ramah anak Sahabat SPANJU.',
      badge: 'Struktur Tolak Ukur',
      imageUrl:
        'https://i.ibb.co/S4FX6Djd/Bagan-Struktur-Tolak-Ukur-E-Pass-Temenan-Spanju.png',
      sourceUrl: 'https://ibb.co.com/Tx9BwDfb',
      description:
        'Kerangka kerja pengukuran budaya sekolah ramah anak yang menghubungkan 5 indikator utama dengan kegiatan pembiasaan dan evaluasi 24 rombel.',
      keyPoints: [
        'Indikator Utama Zero Bullying & Toleransi',
        'Matriks Pembiasaan Harian, Mingguan & Bulanan',
        'Korelasi Nilai Karakter Profil Pelajar Pancasila',
        'Tolak Ukur Penilaian Kelas Berpredikat Zona Hijau',
      ],
    },
    {
      id: 'alur_penilaian',
      number: 3,
      title: 'Alur Penilaian Tolak Ukur & Bagan Keputusan',
      subtitle:
        'Mekanisme penilaian berjenjang, klasifikasi tingkat kasus, dan penetapan keputusan mediasi.',
      badge: 'Bagan Keputusan',
      imageUrl:
        'https://i.ibb.co/XHSRvkR/Alur-Penilaian-Tolak-Ukur-Bagan-Keputusan.png',
      sourceUrl: 'https://ibb.co.com/FpgTjqT',
      description:
        'Alur logika pengambilan keputusan mulai dari telaah aduan, penilaian bobot pelanggaran, penentuan rekomendasi sanksi edukatif, hingga kesepakatan damai.',
      keyPoints: [
        'Skrining Tingkat Keparahan (Ringan, Sedang, Berat)',
        'Kriteria Rekomendasi Restorative vs Rujukan Eksternal',
        'Alur Musyawarah Mufakat Bersama Wali Murid',
        'Validasi Penyelesaian oleh Kepala Sekolah',
      ],
    },
    {
      id: 'respon_tindak_lanjut',
      number: 4,
      title: 'Diagram Alur Respon Tindak Lanjut Laporan',
      subtitle:
        'Diagram respon cepat pelaporan insiden, tindak lanjut restorative justice, dan pemulihan karakter.',
      badge: 'Respon Cepat 1x24 Jam',
      imageUrl:
        'https://i.ibb.co/spq7dvH0/Diagram-Alur-Penilaian-Respon-Laporan.png',
      sourceUrl: 'https://ibb.co.com/NgKRd6S8',
      description:
        'SOP tindak lanjut respon berbatas waktu memastikan setiap aduan tertangani dalam waktu kurang dari 24 jam dengan pencatatan digital terkunci aman.',
      keyPoints: [
        'Respon Awal Maksimal 1x24 Jam Kerja',
        'Investigasi Lapangan & Pemanggilan Pihak Terlibat',
        'Penandatanganan SP Damai Touchscreen Terkunci',
        'Monitoring Berkala 30 Hari Pasca Kasus',
      ],
    },
  ];

  const handleZoom = (id: string, delta: number) => {
    setZoomLevels((prev) => {
      const current = prev[id] || 1;
      const next = Math.min(Math.max(current + delta, 0.5), 2.5);
      return { ...prev, [id]: next };
    });
  };

  const handleResetZoom = (id: string) => {
    setZoomLevels((prev) => ({ ...prev, [id]: 1 }));
  };

  const filteredDiagrams =
    selectedDiagramId === 'all'
      ? diagrams
      : diagrams.filter((d) => d.id === selectedDiagramId);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. TOP BANNER: DOKUMENTASI SOP & BAGAN (MATCHES SCREENSHOT EXACTLY) */}
      <div className="bg-[#3730a3] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
            <span>DOKUMENTASI SOP &amp; BAGAN</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
            Bagan &amp; Alur Penanganan
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-indigo-100/90 mt-2 max-w-2xl leading-relaxed">
            Kumpulan Standar Operasional Prosedur (SOP), diagram alur, dan struktur tolak ukur program Sahabat SPANJU.
          </p>
        </div>

        {/* Action Button: Kembali ke Menu */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="inline-flex items-center justify-center px-6 py-2.5 bg-white/20 hover:bg-white/25 active:bg-white/30 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all border border-white/20 cursor-pointer self-start md:self-auto flex-shrink-0"
        >
          <span>Kembali ke Menu</span>
        </button>
      </div>

      {/* QUICK JUMP FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedDiagramId('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            selectedDiagramId === 'all'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          Semua Bagan ({diagrams.length})
        </button>
        {diagrams.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDiagramId(d.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedDiagramId === d.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {d.number}. {d.title}
          </button>
        ))}
      </div>

      {/* 2. DIAGRAM SECTIONS (1 TO 4) */}
      <div className="space-y-10">
        {filteredDiagrams.map((diagram) => {
          const currentZoom = zoomLevels[diagram.id] || 1;

          return (
            <div
              key={diagram.id}
              id={diagram.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-5"
            >
              {/* Header Row: Number Capsule, Titles, and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Number Capsule */}
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-lg flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {diagram.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {diagram.title}
                      </h2>
                      <span className="hidden md:inline-flex text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {diagram.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      {diagram.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {/* Direct link button */}
                  <a
                    href={diagram.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                    title="Buka Tautan Asli"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Buka Resolusi Asli</span>
                  </a>

                  {/* Print / Save button */}
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Simpan Gambar</span>
                  </button>
                </div>
              </div>

              {/* Viewer Toolbar */}
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center gap-2 text-slate-600 font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-[11px] sm:text-xs text-slate-600">
                    {diagram.description}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => handleZoom(diagram.id, -0.25)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                    title="Perkecil"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] font-bold w-11 text-center text-slate-700">
                    {Math.round(currentZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => handleZoom(diagram.id, 0.25)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                    title="Perbesar"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetZoom(diagram.id)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 cursor-pointer"
                    title="Reset Ukuran"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-3.5 w-px bg-slate-200 mx-0.5" />
                  <button
                    type="button"
                    onClick={() =>
                      setFullscreenImage({
                        title: diagram.title,
                        url: diagram.imageUrl,
                      })
                    }
                    className="p-1 hover:bg-slate-100 rounded-lg text-indigo-600 font-bold cursor-pointer"
                    title="Layar Penuh"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Diagram Display Container */}
              <div className="w-full bg-[#f8fbfa] border border-slate-200 rounded-2xl p-3 sm:p-6 overflow-hidden flex items-center justify-center">
                <div
                  style={{
                    transform: `scale(${currentZoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  className="w-full flex items-center justify-center max-w-full"
                >
                  <img
                    src={diagram.imageUrl}
                    alt={diagram.title}
                    className="max-w-full h-auto object-contain rounded-xl shadow-md border border-slate-200 bg-white"
                    crossOrigin="anonymous"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if direct image encounters network block
                      const target = e.currentTarget;
                      if (!target.src.includes('error-fallback')) {
                        target.src = diagram.imageUrl;
                      }
                    }}
                  />
                </div>
              </div>

              {/* Diagram Key Points Footer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
                {diagram.keyPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] font-semibold text-slate-700 leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col p-3 sm:p-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="font-bold text-sm sm:text-base">
                {fullscreenImage.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={fullscreenImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"
                title="Buka Tautan Asli"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setFullscreenImage(null)}
                className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
            <img
              src={fullscreenImage.url}
              alt={fullscreenImage.title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              crossOrigin="anonymous"
            />
          </div>
        </div>
      )}
    </div>
  );
};
