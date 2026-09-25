import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Filter,
  Sparkles,
  Award,
  Smile,
  Users,
  Info,
  ChevronDown,
} from 'lucide-react';
import { SurveiKepuasanRecord } from '../types';

interface QuestionDef {
  id: string;
  text: string;
  short?: string;
}

interface GrafikSurveiKepuasanProps {
  surveiList: SurveiKepuasanRecord[];
  questions: QuestionDef[];
}

export const GrafikSurveiKepuasan: React.FC<GrafikSurveiKepuasanProps> = ({
  surveiList,
  questions,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>('Semua');
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  const [hoveredQIndex, setHoveredQIndex] = useState<number | null>(null);

  // Filtered list based on role
  const filteredList = useMemo(() => {
    if (selectedRole === 'Semua') return surveiList;
    if (selectedRole === 'Siswa') return surveiList.filter((s) => s.status === 'Siswa');
    if (selectedRole === 'Guru') return surveiList.filter((s) => s.status === 'Guru');
    if (selectedRole === 'Orang tua / Tamu')
      return surveiList.filter((s) => s.status === 'Orang tua' || s.status === 'Tamu');
    return surveiList;
  }, [surveiList, selectedRole]);

  const totalCount = filteredList.length;

  // Helper to extract answer
  const getAnswer = (item: SurveiKepuasanRecord, qId: string): 'setuju' | 'netral' | 'tidak_setuju' => {
    if (item.jawaban && item.jawaban[qId]) return item.jawaban[qId];
    if ((item as any)[qId]) return (item as any)[qId];
    return 'setuju';
  };

  // Compute breakdown per question
  const questionStats = useMemo(() => {
    return questions.map((q, idx) => {
      let setuju = 0;
      let netral = 0;
      let tidakSetuju = 0;

      filteredList.forEach((item) => {
        const ans = getAnswer(item, q.id);
        if (ans === 'setuju') setuju++;
        else if (ans === 'netral') netral++;
        else if (ans === 'tidak_setuju') tidakSetuju++;
        else setuju++;
      });

      const total = totalCount || 1;
      const pSetuju = Math.round((setuju / total) * 100);
      const pNetral = Math.round((netral / total) * 100);
      const pTidakSetuju = Math.round((tidakSetuju / total) * 100);

      // Skor Kepuasan Mutu (bobot: Setuju=100%, Netral=60%, Tidak Setuju=20%)
      const score = Math.min(
        100,
        Math.round(((setuju * 100 + netral * 60 + tidakSetuju * 20) / (total * 100)) * 100)
      );

      return {
        id: q.id,
        no: idx + 1,
        title: q.short || `Indikator ${idx + 1}`,
        fullText: q.text,
        setuju,
        netral,
        tidakSetuju,
        pSetuju,
        pNetral,
        pTidakSetuju,
        score,
      };
    });
  }, [questions, filteredList, totalCount]);

  // Overall aggregate metrics
  const aggregateMetrics = useMemo(() => {
    if (totalCount === 0) {
      return {
        totalAnswers: 0,
        totalSetuju: 0,
        totalNetral: 0,
        totalTidakSetuju: 0,
        overallIndex: 100,
        pctSetuju: 100,
        pctNetral: 0,
        pctTidakSetuju: 0,
        grade: 'A (Sangat Puas)',
      };
    }

    let totSetuju = 0;
    let totNetral = 0;
    let totTidakSetuju = 0;

    questionStats.forEach((qs) => {
      totSetuju += qs.setuju;
      totNetral += qs.netral;
      totTidakSetuju += qs.tidakSetuju;
    });

    const grandTotal = totSetuju + totNetral + totTidakSetuju || 1;
    const pctSetuju = Number(((totSetuju / grandTotal) * 100).toFixed(1));
    const pctNetral = Number(((totNetral / grandTotal) * 100).toFixed(1));
    const pctTidakSetuju = Number(((totTidakSetuju / grandTotal) * 100).toFixed(1));

    const avgScore = Number(
      (
        questionStats.reduce((acc, q) => acc + q.score, 0) / (questionStats.length || 1)
      ).toFixed(1)
    );

    let grade = 'A (Sangat Baik / Sangat Puas)';
    if (avgScore < 60) grade = 'D (Kurang Memuaskan)';
    else if (avgScore < 75) grade = 'C (Cukup Memuaskan)';
    else if (avgScore < 85) grade = 'B (Baik / Puas)';

    return {
      totalAnswers: grandTotal,
      totalSetuju: totSetuju,
      totalNetral: totNetral,
      totalTidakSetuju: totTidakSetuju,
      overallIndex: avgScore,
      pctSetuju,
      pctNetral,
      pctTidakSetuju,
      grade,
    };
  }, [questionStats, totalCount]);

  // Donut chart math
  const donutR = 54;
  const donutCircumference = 2 * Math.PI * donutR;
  const strokeSetuju = (aggregateMetrics.pctSetuju / 100) * donutCircumference;
  const strokeNetral = (aggregateMetrics.pctNetral / 100) * donutCircumference;
  const strokeTidakSetuju = (aggregateMetrics.pctTidakSetuju / 100) * donutCircumference;

  const offsetSetuju = 0;
  const offsetNetral = -strokeSetuju;
  const offsetTidakSetuju = -(strokeSetuju + strokeNetral);

  if (surveiList.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-5 sm:p-7 space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Bar with Title, Subtitle, and Filter Pills */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grafik &amp; Analitik Mutu Layanan</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Grafik Kepuasan Pengguna Aplikasi Sahabat SPANJU
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Visualisasi persentase kepuasan, indeks mutu 8 indikator pencegahan &amp; penanganan
            perundungan berdasarkan respon {totalCount} responden terpilih.
          </p>
        </div>

        {/* Filter & View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          {/* Role Filter Tabs */}
          <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center text-xs font-semibold text-slate-600 border border-slate-200/70">
            {[
              { id: 'Semua', label: `Semua (${surveiList.length})` },
              {
                id: 'Siswa',
                label: `Siswa (${surveiList.filter((s) => s.status === 'Siswa').length})`,
              },
              {
                id: 'Guru',
                label: `Guru (${surveiList.filter((s) => s.status === 'Guru').length})`,
              },
              {
                id: 'Orang tua / Tamu',
                label: `Ortu (${surveiList.filter((s) => s.status === 'Orang tua' || s.status === 'Tamu').length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRole(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedRole === tab.id
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toggle View: Chart vs Table */}
          <div className="bg-slate-100/90 p-1 rounded-2xl flex items-center text-xs font-semibold text-slate-600 border border-slate-200/70">
            <button
              type="button"
              onClick={() => setActiveTab('chart')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'chart'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grafik</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Tabel Rincian</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Indeks Kepuasan Keseluruhan (IKP) */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white rounded-2xl p-4 border border-emerald-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Indeks Mutu Pelayanan
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {aggregateMetrics.overallIndex}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              Kategori A
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            {aggregateMetrics.grade}
          </p>
        </div>

        {/* Card 2: Tingkat Persetujuan (Puas) */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Setuju / Puas
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700 tracking-tight">
              {aggregateMetrics.pctSetuju}%
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({aggregateMetrics.totalSetuju} respon)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Mayoritas responden sangat mendukung</p>
        </div>

        {/* Card 3: Netral / Cukup */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Netral / Cukup
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700 tracking-tight">
              {aggregateMetrics.pctNetral}%
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({aggregateMetrics.totalNetral} respon)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Penilaian netral &amp; saran pengembangan</p>
        </div>

        {/* Card 4: Tidak Setuju */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Tidak Setuju / Evaluasi
            </span>
            <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-700 tracking-tight">
              {aggregateMetrics.pctTidakSetuju}%
            </span>
            <span className="text-xs font-bold text-slate-500">
              ({aggregateMetrics.totalTidakSetuju} respon)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Area evaluasi &amp; peningkatan berkelanjutan</p>
        </div>
      </div>

      {/* 3. Main Chart Section */}
      {activeTab === 'chart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Horizontal Bar Chart per Question (8 Indikator) - 8 cols */}
          <div className="lg:col-span-8 bg-slate-50/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Grafik Indeks Persetujuan per 8 Indikator Layanan
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Distribusi respon Setuju (hijau), Netral (kuning), dan Tidak Setuju (merah)
                </p>
              </div>

              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Setuju
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Netral
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Tidak Setuju
                </span>
              </div>
            </div>

            {/* Questions Bar List */}
            <div className="space-y-3.5 pt-2">
              {questionStats.map((qs, idx) => {
                const isHovered = hoveredQIndex === idx;
                return (
                  <div
                    key={qs.id}
                    onMouseEnter={() => setHoveredQIndex(idx)}
                    onMouseLeave={() => setHoveredQIndex(null)}
                    className={`p-3 rounded-xl transition-all border ${
                      isHovered
                        ? 'bg-white border-emerald-300 shadow-md transform -translate-y-0.5'
                        : 'bg-white/80 border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {qs.no}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {qs.title}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                            {qs.fullText}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          {qs.score}%
                        </span>
                      </div>
                    </div>

                    {/* Stacked Percentage Progress Bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      {qs.pSetuju > 0 && (
                        <div
                          style={{ width: `${qs.pSetuju}%` }}
                          className="bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 relative group"
                          title={`Setuju: ${qs.setuju} (${qs.pSetuju}%)`}
                        />
                      )}
                      {qs.pNetral > 0 && (
                        <div
                          style={{ width: `${qs.pNetral}%` }}
                          className="bg-amber-400 hover:bg-amber-500 transition-all duration-300 relative group"
                          title={`Netral: ${qs.netral} (${qs.pNetral}%)`}
                        />
                      )}
                      {qs.pTidakSetuju > 0 && (
                        <div
                          style={{ width: `${qs.pTidakSetuju}%` }}
                          className="bg-rose-500 hover:bg-rose-600 transition-all duration-300 relative group"
                          title={`Tidak Setuju: ${qs.tidakSetuju} (${qs.pTidakSetuju}%)`}
                        />
                      )}
                    </div>

                    {/* Sub text values */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-medium">
                          Setuju: {qs.setuju} ({qs.pSetuju}%)
                        </span>
                        <span className="text-amber-700 font-medium">
                          Netral: {qs.netral} ({qs.pNetral}%)
                        </span>
                        {qs.tidakSetuju > 0 && (
                          <span className="text-rose-700 font-medium">
                            Tidak Setuju: {qs.tidakSetuju} ({qs.pTidakSetuju}%)
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-slate-400 text-[10px]">
                        N = {totalCount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Donut Breakdown & Key Insights - 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            {/* Donut Chart Card */}
            <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-200/80 flex flex-col items-center text-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-emerald-600" />
                Proporsi Respon Penilaian
              </h3>
              <p className="text-[11px] text-slate-500 mb-4">
                Total {aggregateMetrics.totalAnswers} penilaian dari {totalCount} responden
              </p>

              {/* Circular SVG Donut */}
              <div className="relative w-44 h-44 flex items-center justify-center my-2">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
                  {/* Background Track */}
                  <circle
                    cx="65"
                    cy="65"
                    r={donutR}
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                  />
                  {/* Setuju Segment */}
                  {aggregateMetrics.pctSetuju > 0 && (
                    <circle
                      cx="65"
                      cy="65"
                      r={donutR}
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="16"
                      strokeDasharray={`${strokeSetuju} ${donutCircumference}`}
                      strokeDashoffset={offsetSetuju}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Netral Segment */}
                  {aggregateMetrics.pctNetral > 0 && (
                    <circle
                      cx="65"
                      cy="65"
                      r={donutR}
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="16"
                      strokeDasharray={`${strokeNetral} ${donutCircumference}`}
                      strokeDashoffset={offsetNetral}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Tidak Setuju Segment */}
                  {aggregateMetrics.pctTidakSetuju > 0 && (
                    <circle
                      cx="65"
                      cy="65"
                      r={donutR}
                      fill="transparent"
                      stroke="#f43f5e"
                      strokeWidth="16"
                      strokeDasharray={`${strokeTidakSetuju} ${donutCircumference}`}
                      strokeDashoffset={offsetTidakSetuju}
                      strokeLinecap="round"
                    />
                  )}
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {aggregateMetrics.overallIndex}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Indeks Mutu
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-600 mt-0.5">
                    Sangat Puas
                  </span>
                </div>
              </div>

              {/* Legend Badges */}
              <div className="w-full space-y-2 mt-4 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    Setuju / Puas
                  </span>
                  <span className="font-bold text-emerald-700 font-mono">
                    {aggregateMetrics.pctSetuju}% ({aggregateMetrics.totalSetuju})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                    Netral / Cukup
                  </span>
                  <span className="font-bold text-amber-700 font-mono">
                    {aggregateMetrics.pctNetral}% ({aggregateMetrics.totalNetral})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
                    Tidak Setuju
                  </span>
                  <span className="font-bold text-rose-700 font-mono">
                    {aggregateMetrics.pctTidakSetuju}% ({aggregateMetrics.totalTidakSetuju})
                  </span>
                </div>
              </div>
            </div>

            {/* Kesimpulan & Tindak Lanjut Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-4 sm:p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Catatan Evaluasi TPPK
                </h4>
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Tingkat kepuasan layanan perundungan mencapai{' '}
                <strong className="text-white font-black">{aggregateMetrics.overallIndex}%</strong>.
                Fitur laporan anonim dan kecepatan respon mediasi di bawah 24 jam dinilai paling
                berdampak tinggi dalam membangun rasa aman murid di sekolah.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 font-bold">
                <th className="py-3 px-3.5 w-12 text-center">No</th>
                <th className="py-3 px-3.5">Indikator Penilaian Layanan</th>
                <th className="py-3 px-3 text-center bg-emerald-50/50 text-emerald-800">Setuju</th>
                <th className="py-3 px-3 text-center bg-amber-50/50 text-amber-800">Netral</th>
                <th className="py-3 px-3 text-center bg-rose-50/50 text-rose-800">Tidak Setuju</th>
                <th className="py-3 px-3 text-center">Skor Mutu</th>
                <th className="py-3 px-3 text-center">Kategori</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questionStats.map((qs) => (
                <tr key={qs.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 text-center font-bold text-slate-500">{qs.no}</td>
                  <td className="py-3 px-3.5">
                    <div className="font-bold text-slate-900">{qs.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{qs.fullText}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-700 bg-emerald-50/30 font-mono">
                    {qs.setuju} ({qs.pSetuju}%)
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-amber-700 bg-amber-50/30 font-mono">
                    {qs.netral} ({qs.pNetral}%)
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-rose-700 bg-rose-50/30 font-mono">
                    {qs.tidakSetuju} ({qs.pTidakSetuju}%)
                  </td>
                  <td className="py-3 px-3 text-center font-black text-slate-900 font-mono text-sm">
                    {qs.score}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        qs.score >= 85
                          ? 'bg-emerald-100 text-emerald-800'
                          : qs.score >= 70
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {qs.score >= 85 ? 'Sangat Baik' : qs.score >= 70 ? 'Cukup' : 'Evaluasi'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
