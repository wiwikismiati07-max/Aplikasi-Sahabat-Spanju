import React, { useState } from 'react';
import {
  ClipboardCheck,
  Send,
  Sparkles,
  FileText,
  User,
  Users,
  MessageSquare,
  BarChart3,
  Trash2,
  Edit,
  X,
  Lock,
  ArrowRight,
  RotateCcw,
  Download,
} from 'lucide-react';
import { SurveiKepuasanRecord, UserProfile } from '../types';

interface SurveiKepuasanSectionProps {
  surveiList: SurveiKepuasanRecord[];
  onSubmitSurvei: (data: Omit<SurveiKepuasanRecord, 'id' | 'createdAt'>) => void;
  onUpdateSurvei?: (id: string, data: Partial<SurveiKepuasanRecord>) => void;
  onDeleteSurvei?: (id: string) => void;
  currentUser: UserProfile;
  isCompactBanner?: boolean;
  onOpenFullSurvey?: () => void;
  onBackToMenu?: () => void;
}

export const SurveiKepuasanSection: React.FC<SurveiKepuasanSectionProps> = ({
  surveiList,
  onSubmitSurvei,
  onUpdateSurvei,
  onDeleteSurvei,
  currentUser,
  isCompactBanner = false,
  onOpenFullSurvey,
  onBackToMenu,
}) => {
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'operator';

  // Active view tab in full mode: 'form' | 'rekap'
  const [activeTab, setActiveTab] = useState<'form' | 'rekap'>('form');

  // Form State
  const [namaLengkap, setNamaLengkap] = useState('');
  const [status, setStatus] = useState<'Siswa' | 'Guru' | 'Orang tua' | 'Tamu'>('Siswa');
  const [jawaban, setJawaban] = useState<Record<string, 'setuju' | 'netral' | 'tidak_setuju'>>({
    q1: 'setuju',
    q2: 'setuju',
    q3: 'setuju',
    q4: 'setuju',
    q5: 'setuju',
    q6: 'setuju',
    q7: 'setuju',
    q8: 'setuju',
  });
  const [saranPerbaikan, setSaranPerbaikan] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Edit State (Admin only)
  const [editingItem, setEditingItem] = useState<SurveiKepuasanRecord | null>(null);

  // Signer Modal for Word Export
  const [isSignerModalOpen, setIsSignerModalOpen] = useState(false);
  const [selectedSigner, setSelectedSigner] = useState<'wiwik' | 'eki' | 'both'>('wiwik');

  const questions = [
    { id: 'q1', text: 'Menu laporan kekerasan dan perundungan di aplikasi mudah ditemukan' },
    { id: 'q2', text: 'Proses pengisian formulir laporan singkat dan tidak membingungkan' },
    { id: 'q3', text: 'Laporan anonim (rahasia) membuat saya merasa aman untuk melapor' },
    { id: 'q4', text: 'Saya percaya identitas dan data laporan saya terlindungi dengan baik oleh sistem' },
    { id: 'q5', text: 'Tim TPPK Sekolah / Guru BK memberikan respon cepat (maksimal 1x24 jam) setelah laporan masuk' },
    { id: 'q6', text: 'Status penanganan laporan dapat dipantau secara jelas dan transparan melalui aplikasi' },
    { id: 'q7', text: 'Tindak lanjut kasus yang dilaporkan melalui aplikasi diselesaikan dengan adil dan tuntas' },
    { id: 'q8', text: 'Adanya fitur ini di aplikasi sahabat spanju membuat saya / anak saya merasa lebih aman di sekolah' },
  ];

  // Compact Banner View
  if (isCompactBanner) {
    return (
      <div className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-emerald-700/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Survey Resmi &bull; 1-Klik
            </div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">
              Survey Kepuasan Layanan Kekerasan &amp; Perundungan
            </h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Berikan penilaian Anda atas efektivitas, kemudahan, dan rasa aman fitur Laporan Sahabat SPANJU demi sekolah yang ramah anak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenFullSurvey}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Isi Survey Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap.trim()) {
      alert('Mohon isi nama lengkap atau inisial Anda.');
      return;
    }

    onSubmitSurvei({
      namaLengkap,
      status,
      jawaban,
      saranPerbaikan,
      q1: jawaban.q1,
      q2: jawaban.q2,
      q3: jawaban.q3,
      q4: jawaban.q4,
      q5: jawaban.q5,
      q6: jawaban.q6,
      q7: jawaban.q7,
      q8: jawaban.q8,
    });

    setIsSubmittedSuccess(true);
    setNamaLengkap('');
    setSaranPerbaikan('');
    setTimeout(() => setIsSubmittedSuccess(false), 4000);
  };

  // Export to Word (.doc) with official letterhead
  const handleExportWord = () => {
    let tppkBlock = '';
    if (selectedSigner === 'wiwik') {
      tppkBlock = `
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 11pt;">Koordinator TPPK / Guru BK,</p>
          <div style="height: 60px;"></div>
          <p style="margin: 0; font-weight: bold; text-decoration: underline; font-size: 11pt;">WIWIK ISMIATI, S.Pd</p>
          <p style="margin: 0; font-size: 10pt;">NIP. 19831116 200904 2 003</p>
        </div>
      `;
    } else if (selectedSigner === 'eki') {
      tppkBlock = `
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 11pt;">Guru BK / Tim TPPK,</p>
          <div style="height: 60px;"></div>
          <p style="margin: 0; font-weight: bold; text-decoration: underline; font-size: 11pt;">EKI FEBRIANI, S.Pd</p>
          <p style="margin: 0; font-size: 10pt;">NIP. 19940214 202221 2 014</p>
        </div>
      `;
    } else {
      tppkBlock = `
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 11pt;">Tim TPPK / Guru BK,</p>
          <div style="height: 60px;"></div>
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">1. WIWIK ISMIATI, S.Pd (NIP. 19831116 200904 2 003)</p>
          <p style="margin: 0; font-weight: bold; font-size: 10pt;">2. EKI FEBRIANI, S.Pd (NIP. 19940214 202221 2 014)</p>
        </div>
      `;
    }

    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Laporan Hasil Survey Kepuasan - SMPN 7 Pasuruan</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.3; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th, td { border: 1px solid #000; padding: 6px; font-size: 10pt; }
          th { background-color: #f2f2f2; }
          .kop { text-align: center; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 16px; }
        </style>
      </head>
      <body>
        <div class="kop">
          <p style="margin: 0; font-size: 12pt; font-weight: bold;">PEMERINTAH KOTA PASURUAN</p>
          <p style="margin: 0; font-size: 14pt; font-weight: bold;">DINAS PENDIDIKAN DAN KEBUDAYAAN</p>
          <p style="margin: 0; font-size: 16pt; font-weight: bold;">UPT SMP NEGERI 7</p>
          <p style="margin: 0; font-size: 9pt;">Jalan Simpang Slamet Riadi Nomor 2, Telepon (0343) 426845</p>
          <p style="margin: 0; font-size: 9pt;">Pos-el: smp7pas@yahoo.co.id | Laman: www.smpn7pasuruan.sch.id | Pasuruan 67128</p>
        </div>

        <h3 style="text-align: center; text-transform: uppercase; margin-bottom: 4px;">REKAPITULASI HASIL SURVEY KEPUASAN LAYANAN ANTI-PERUNDUNGAN</h3>
        <p style="text-align: center; font-size: 10pt; margin-top: 0;">APLIKASI SAHABAT SPANJU - TAHUN AJARAN 2026/2027</p>

        <p><strong>Total Responden:</strong> ${surveiList.length} orang</p>

        <table>
          <thead>
            <tr>
              <th style="width: 30px;">No</th>
              <th>Nama Responden</th>
              <th>Status</th>
              <th>Waktu</th>
              <th>Masukan & Saran Perbaikan</th>
            </tr>
          </thead>
          <tbody>
            ${surveiList
              .map(
                (item, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td><strong>${item.namaLengkap}</strong></td>
                <td>${item.status}</td>
                <td>${item.createdAt}</td>
                <td>${item.saranPerbaikan || '-'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <br><br>
        <table style="border: none; width: 100%;">
          <tr style="border: none;">
            <td style="border: none; width: 50%; vertical-align: top;">
              ${tppkBlock}
            </td>
            <td style="border: none; width: 50%; text-align: center; vertical-align: top;">
              <p style="margin: 0; font-size: 11pt;">Pasuruan, 24 September 2026</p>
              <p style="margin: 0; font-size: 11pt;">Mengetahui,</p>
              <p style="margin: 0; font-size: 11pt;">Kepala UPT SMP Negeri 7 Pasuruan,</p>
              <div style="height: 60px;"></div>
              <p style="margin: 0; font-weight: bold; text-decoration: underline; font-size: 11pt;">NUR FADILAH, S.Pd., M.Pd</p>
              <p style="margin: 0; font-size: 10pt;">NIP. 19860410 201001 2 030</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Survey_Kepuasan_SPANJU.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsSignerModalOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header with Back Button */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToMenu && (
            <button
              type="button"
              onClick={onBackToMenu}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
              title="Kembali ke Menu Utama"
            >
              &larr;
            </button>
          )}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Survey Kepuasan Pengguna
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
              Layanan Penanganan Kekerasan &amp; Perundungan (Bullying)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Aplikasi Sahabat SPANJU &bull; UPT SMP Negeri 7 Pasuruan bersama PASS TEMENAN
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all ${
              activeTab === 'form'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formulir Survey
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rekap')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'rekap'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Rekapitulasi ({surveiList.length})</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Formulir Survey */}
      {activeTab === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="mb-6 p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs text-slate-700 leading-relaxed">
            <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Tujuan Survey Kepuasan
            </div>
            Survei ini bertujuan untuk mengukur efektivitas, kemudahan, dan rasa aman pengguna dalam memanfaatkan fitur Laporan Kekerasan &amp; Perundungan di aplikasi Sahabat SPANJU. Masukan Anda sangat penting untuk menciptakan lingkungan sekolah yang lebih aman dan harmonis.
          </div>

          {isSubmittedSuccess && (
            <div className="mb-6 p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <span>Terima kasih! Tanggapan survey Anda telah berhasil disimpan.</span>
              <button
                onClick={() => setIsSubmittedSuccess(false)}
                className="text-emerald-700 hover:text-emerald-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Responden Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap / Inisial Responden <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                    placeholder="Contoh: Budi Santoso / Siswa 7A"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Status Responden <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Siswa', 'Guru', 'Orang tua', 'Tamu'] as const).map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setStatus(roleOption)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all text-center ${
                        status === roleOption
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {roleOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">
                <span>Butir Pertanyaan Survey</span>
                <span className="hidden sm:inline text-slate-400 font-normal">
                  Pilih salah satu (Setuju / Netral / Tidak Setuju)
                </span>
              </div>

              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-800 leading-snug">
                      {q.text}
                    </span>
                  </div>

                  {/* 3 Choices */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setJawaban((prev) => ({ ...prev, [q.id]: 'setuju' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        jawaban[q.id] === 'setuju'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      👍 Setuju
                    </button>
                    <button
                      type="button"
                      onClick={() => setJawaban((prev) => ({ ...prev, [q.id]: 'netral' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        jawaban[q.id] === 'netral'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      😐 Netral
                    </button>
                    <button
                      type="button"
                      onClick={() => setJawaban((prev) => ({ ...prev, [q.id]: 'tidak_setuju' }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        jawaban[q.id] === 'tidak_setuju'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      👎 Tidak Setuju
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions & Feedback */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Masukan dan Saran Perbaikan
              </label>
              <textarea
                rows={3}
                value={saranPerbaikan}
                onChange={(e) => setSaranPerbaikan(e.target.value)}
                placeholder="Apa saran Anda agar fitur laporan kekerasan dan perundungan ini bisa lebih baik dan responsif ke depannya?"
                className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Jawaban Survey</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Rekapitulasi & Daftar Responden */}
      {activeTab === 'rekap' && (
        <div className="space-y-6">
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Responden
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">{surveiList.length}</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                Siswa
              </div>
              <div className="text-2xl font-black text-sky-900 mt-1">
                {surveiList.filter((s) => s.status === 'Siswa').length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                Guru &amp; Tendik
              </div>
              <div className="text-2xl font-black text-emerald-900 mt-1">
                {surveiList.filter((s) => s.status === 'Guru').length}
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                Orang Tua / Tamu
              </div>
              <div className="text-2xl font-black text-amber-900 mt-1">
                {surveiList.filter((s) => s.status === 'Orang tua' || s.status === 'Tamu').length}
              </div>
            </div>
          </div>

          {/* Action Bar: Export to Word */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Unduh Laporan Rekapitulasi Resmi</div>
              <div className="text-[11px] text-slate-500">
                Format dokumen Microsoft Word (.doc) berkop resmi UPT SMPN 7 Pasuruan
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSignerModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Unduh Word (.doc)</span>
            </button>
          </div>

          {/* Daftar Masukan & Saran Responden */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Daftar Masukan &amp; Saran Responden ({surveiList.length})
              </div>
              {!isAdmin && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" /> Hapus / Edit Khusus Admin
                </span>
              )}
            </div>

            {surveiList.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                Belum ada data survey yang masuk.
              </div>
            ) : (
              <div className="space-y-3">
                {surveiList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.namaLengkap}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                            item.status === 'Siswa'
                              ? 'bg-sky-100 text-sky-800'
                              : item.status === 'Guru'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'Orang tua'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10px] text-slate-400">&bull; {item.createdAt}</span>
                      </div>

                      {item.saranPerbaikan ? (
                        <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                          &ldquo;{item.saranPerbaikan}&rdquo;
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">
                          (Tidak memberikan catatan saran tambahan)
                        </p>
                      )}
                    </div>

                    {/* Admin Actions: Edit & Delete */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 bg-white hover:bg-amber-50 text-amber-600 border border-slate-200 rounded-lg transition-colors"
                          title="Edit Masukan"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus masukan dari ${item.namaLengkap}?`)) {
                              if (onDeleteSurvei) onDeleteSurvei(item.id);
                            }
                          }}
                          className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 rounded-lg transition-colors"
                          title="Hapus Masukan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal for Admin */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">Edit Responden Survey (Admin)</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Responden</label>
                <input
                  type="text"
                  value={editingItem.namaLengkap}
                  onChange={(e) => setEditingItem({ ...editingItem, namaLengkap: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingItem.status}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      status: e.target.value as 'Siswa' | 'Guru' | 'Orang tua' | 'Tamu',
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="Siswa">Siswa</option>
                  <option value="Guru">Guru</option>
                  <option value="Orang tua">Orang tua</option>
                  <option value="Tamu">Tamu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Saran Perbaikan</label>
                <textarea
                  rows={3}
                  value={editingItem.saranPerbaikan}
                  onChange={(e) => setEditingItem({ ...editingItem, saranPerbaikan: e.target.value })}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onUpdateSurvei) {
                    onUpdateSurvei(editingItem.id, editingItem);
                  }
                  setEditingItem(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signer Selection Modal for Word Export */}
      {isSignerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800">Pilih Penandatangan Dokumen Word</h3>
              <button
                onClick={() => setIsSignerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-700 mb-1">
                Pilih Pejabat TPPK / Guru BK:
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="signer"
                  checked={selectedSigner === 'wiwik'}
                  onChange={() => setSelectedSigner('wiwik')}
                  className="text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800">1. WIWIK ISMIATI, S.Pd</div>
                  <div className="text-[10px] text-slate-500">NIP. 19831116 200904 2 003 (Koordinator TPPK)</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="signer"
                  checked={selectedSigner === 'eki'}
                  onChange={() => setSelectedSigner('eki')}
                  className="text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800">2. EKI FEBRIANI, S.Pd</div>
                  <div className="text-[10px] text-slate-500">NIP. 19940214 202221 2 014 (Guru BK / Tim TPPK)</div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <input
                  type="radio"
                  name="signer"
                  checked={selectedSigner === 'both'}
                  onChange={() => setSelectedSigner('both')}
                  className="text-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800">3. Keduanya (Wiwik &amp; Eki)</div>
                  <div className="text-[10px] text-slate-500">Format bertingkat nomor 1 dan 2</div>
                </div>
              </label>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
              Mengetahui Kepala UPT SMP Negeri 7 Pasuruan:
              <div className="font-bold uppercase text-slate-900 mt-0.5">NUR FADILAH, S.Pd., M.Pd</div>
              <div className="text-slate-500">NIP. 19860410 201001 2 030</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSignerModalOpen(false)}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExportWord}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Word (.doc) Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
