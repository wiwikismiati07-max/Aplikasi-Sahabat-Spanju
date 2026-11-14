import React, { useState } from 'react';
import {
  AlertTriangle,
  Printer,
  Trash2,
  Edit,
  ShieldCheck,
  Lock,
  Unlock,
  Layers,
  X,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  Send,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  FileCheck2,
} from 'lucide-react';
import { ELaporRecord, SiswaMaster, UserProfile } from '../types';
import {
  CalendarDatePicker,
  RealTimeTimePicker,
  getTodayIndoDate,
  getCurrentWibTime,
} from './DateTimeWidgets';
import { TouchSignaturePad } from './TouchSignaturePad';
import { StudentPickerModal } from './StudentPickerModal';
import { OfficialReportModal } from './OfficialReportModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface ELaporViewProps {
  eLaporList: ELaporRecord[];
  onAddELapor: (data: Omit<ELaporRecord, 'id' | 'createdAt'>) => void;
  onUpdateELapor: (id: string, data: Partial<ELaporRecord>) => void;
  onDeleteELapor: (id: string) => void;
  siswaList: SiswaMaster[];
  currentUser: UserProfile;
  onOpenMenu: () => void;
  onOpenLogin?: () => void;
}

export const ELaporView: React.FC<ELaporViewProps> = ({
  eLaporList,
  onAddELapor,
  onUpdateELapor,
  onDeleteELapor,
  siswaList,
  currentUser,
  onOpenMenu,
}) => {
  // Results vault ALWAYS starts locked; only Operator/Admin can unlock it with credentials
  const [isResultsUnlocked, setIsResultsUnlocked] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockUsername, setUnlockUsername] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showUnlockPassword, setShowUnlockPassword] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  // Public Beranda Inline Form State (Always open & unlocked for everyone)
  const [hariTanggal, setHariTanggal] = useState(getTodayIndoDate());
  const [waktuKejadian, setWaktuKejadian] = useState(getCurrentWibTime());
  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('7A');
  const [namaSiswa2, setNamaSiswa2] = useState('');
  const [kelas2, setKelas2] = useState('');
  const [kronologiKejadian, setKronologiKejadian] = useState('');
  const [kegiatanPenyadaran, setKegiatanPenyadaran] = useState('');
  const [kegiatanPencegahan, setKegiatanPencegahan] = useState('');
  const [kegiatanPenangananRespon, setKegiatanPenangananRespon] = useState('');
  const [kegiatanPelaporan, setKegiatanPelaporan] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [status, setStatus] = useState<ELaporRecord['status']>('Investigasi');
  const [kategoriKasus, setKategoriKasus] = useState<ELaporRecord['kategoriKasus']>('Verbal');
  const [tandaTanganUrl, setTandaTanganUrl] = useState('');
  const [showPilarSection, setShowPilarSection] = useState(true);

  // Submission feedback banner
  const [submitSuccessCode, setSubmitSuccessCode] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // Edit Modal State (Operator only, after unlocking results)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHariTanggal, setEditHariTanggal] = useState('');
  const [editWaktuKejadian, setEditWaktuKejadian] = useState('');
  const [editNamaSiswa, setEditNamaSiswa] = useState('');
  const [editKelas, setEditKelas] = useState('');
  const [editNamaSiswa2, setEditNamaSiswa2] = useState('');
  const [editKelas2, setEditKelas2] = useState('');
  const [editKronologi, setEditKronologi] = useState('');
  const [editPenyadaran, setEditPenyadaran] = useState('');
  const [editPencegahan, setEditPencegahan] = useState('');
  const [editRespon, setEditRespon] = useState('');
  const [editPelaporan, setEditPelaporan] = useState('');
  const [editTindakLanjut, setEditTindakLanjut] = useState('');
  const [editKeterangan, setEditKeterangan] = useState('');
  const [editStatus, setEditStatus] = useState<ELaporRecord['status']>('Investigasi');
  const [editKategori, setEditKategori] = useState<ELaporRecord['kategoriKasus']>('Verbal');
  const [editTandaTanganUrl, setEditTandaTanganUrl] = useState('');

  // Student Picker Modal (supports both inline form and edit modal)
  const [pickerTarget, setPickerTarget] = useState<'siswa1' | 'siswa2' | 'edit_siswa1' | 'edit_siswa2' | null>(null);

  // Delete & Print Modals
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<string>('');
  const [printingRecord, setPrintingRecord] = useState<ELaporRecord | null>(null);

  const resetInlineForm = () => {
    setHariTanggal(getTodayIndoDate());
    setWaktuKejadian(getCurrentWibTime());
    setNamaSiswa('');
    setKelas('7A');
    setNamaSiswa2('');
    setKelas2('');
    setKronologiKejadian('');
    setKegiatanPenyadaran('');
    setKegiatanPencegahan('');
    setKegiatanPenangananRespon('');
    setKegiatanPelaporan('');
    setTindakLanjut('');
    setKeterangan('');
    setStatus('Investigasi');
    setKategoriKasus('Verbal');
    setTandaTanganUrl('');
    setFormError('');
  };

  const handlePublicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!namaSiswa.trim() || !kronologiKejadian.trim()) {
      setFormError('Mohon lengkapi Nama Siswa (Pihak Pertama) dan Kronologi Kejadian sebelum mengirim aduan.');
      return;
    }

    const kode = `SPJ-${new Date().getFullYear()}-${String(eLaporList.length + 1).padStart(3, '0')}`;
    const pelaporLabel = currentUser.nama || currentUser.name || 'Pelapor Warga Sekolah';

    onAddELapor({
      kodeLaporan: kode,
      hariTanggal,
      waktuKejadian,
      namaSiswa: namaSiswa.trim(),
      kelas: kelas.trim() || '-',
      namaSiswa2: namaSiswa2.trim(),
      kelas2: kelas2.trim(),
      kronologiKejadian: kronologiKejadian.trim(),
      kegiatanPenyadaran: kegiatanPenyadaran.trim(),
      kegiatanPencegahan: kegiatanPencegahan.trim(),
      kegiatanPenangananRespon: kegiatanPenangananRespon.trim(),
      kegiatanPelaporan: kegiatanPelaporan.trim() || `Aduan dikirim melalui Beranda E-Lapor oleh ${pelaporLabel}`,
      tindakLanjut: tindakLanjut.trim(),
      keterangan: keterangan.trim(),
      status,
      kategoriKasus,
      tandaTanganUrl,
      namaPenandatangan: 'Wiwik Ismiati, S.Pd',
      jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
      namaPetugas: 'Wiwik Ismiati, S.Pd',
    });

    resetInlineForm();
    setSubmitSuccessCode(kode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditClick = (record: ELaporRecord) => {
    setEditingId(record.id);
    setEditHariTanggal(record.hariTanggal);
    setEditWaktuKejadian(record.waktuKejadian);
    setEditNamaSiswa(record.namaSiswa);
    setEditKelas(record.kelas);
    setEditNamaSiswa2(record.namaSiswa2 || '');
    setEditKelas2(record.kelas2 || '');
    setEditKronologi(record.kronologiKejadian);
    setEditPenyadaran(record.kegiatanPenyadaran || '');
    setEditPencegahan(record.kegiatanPencegahan || '');
    setEditRespon(record.kegiatanPenangananRespon || '');
    setEditPelaporan(record.kegiatanPelaporan || '');
    setEditTindakLanjut(record.tindakLanjut || '');
    setEditKeterangan(record.keterangan || '');
    setEditStatus(record.status);
    setEditKategori(record.kategoriKasus);
    setEditTandaTanganUrl(record.tandaTanganUrl || '');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    if (!editNamaSiswa.trim() || !editKronologi.trim()) {
      return;
    }

    onUpdateELapor(editingId, {
      hariTanggal: editHariTanggal,
      waktuKejadian: editWaktuKejadian,
      namaSiswa: editNamaSiswa.trim(),
      kelas: editKelas.trim() || '-',
      namaSiswa2: editNamaSiswa2.trim(),
      kelas2: editKelas2.trim(),
      kronologiKejadian: editKronologi.trim(),
      kegiatanPenyadaran: editPenyadaran.trim(),
      kegiatanPencegahan: editPencegahan.trim(),
      kegiatanPenangananRespon: editRespon.trim(),
      kegiatanPelaporan: editPelaporan.trim(),
      tindakLanjut: editTindakLanjut.trim(),
      keterangan: editKeterangan.trim(),
      status: editStatus,
      kategoriKasus: editKategori,
      tandaTanganUrl: editTandaTanganUrl,
    });
    setEditingId(null);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');

    const u = unlockUsername.trim().toLowerCase();
    const p = unlockPassword.trim();

    if ((u === 'admin' || u === 'operator') && p === 'admin123') {
      setIsResultsUnlocked(true);
      setIsUnlockModalOpen(false);
      setUnlockUsername('');
      setUnlockPassword('');
      setUnlockError('');
    } else {
      setUnlockError(
        'Akses ditolak! Hanya Operator / Admin TPPK yang memiliki kunci valid untuk membuka hasil kirim aduan.'
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-700 via-red-700 to-rose-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <AlertTriangle className="w-8 h-8 text-rose-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-300/30 text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Formulir Terbuka • Hasil Aduan Terkunci Operator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              E-Lapor Perundungan &amp; Kekerasan
            </h1>
            <p className="text-xs text-rose-100 max-w-2xl">
              Siapapun (Siswa, Guru, Orang Tua, Tamu) dapat mengisi dan mengirim aduan langsung di beranda ini tanpa terkunci. Hasil kirim aduan tetap terkunci aman dan hanya Operator TPPK yang dapat membuka kunci.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-rose-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>

          {!isResultsUnlocked ? (
            <button
              type="button"
              onClick={() => {
                setUnlockError('');
                setIsUnlockModalOpen(true);
              }}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-rose-700" />
              <span>Buka Kunci Hasil (Operator)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsResultsUnlocked(false)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Kunci Kembali Hasil</span>
            </button>
          )}
        </div>
      </div>

      {/* Submission Success Banner */}
      {submitSuccessCode && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 shadow-sm flex items-start justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-emerald-900 uppercase">
                Aduan Berhasil Dikirim &amp; Tersimpan Aman!
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Kode Laporan Anda: <strong className="font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">{submitSuccessCode}</strong>. Demi perlindungan pelapor dan korban, hasil kirim aduan otomatis dikunci dan hanya dapat dibuka oleh <strong>Operator / Admin TPPK</strong> untuk segera ditindaklanjuti.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSubmitSuccessCode(null)}
            className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-lg cursor-pointer"
            title="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* INLINE UNLOCKED COMPLAINT INPUT FORM ON E-LAPOR BERANDA */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-rose-600 to-red-700 text-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider mb-1">
              <Unlock className="w-3 h-3" />
              <span>Formulir Aduan Terbuka Untuk Umum</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold">
              Formulir Aduan &amp; Laporan Insiden
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">
              Data pelapor dan korban dilindungi penuh oleh Satgas TPPK UPT SMPN 7 Pasuruan
            </p>
          </div>
          <button
            type="button"
            onClick={resetInlineForm}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bersihkan Form</span>
          </button>
        </div>

        <form onSubmit={handlePublicSubmit} className="p-5 sm:p-6 space-y-5">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CalendarDatePicker
              value={hariTanggal}
              onChange={setHariTanggal}
              label="Hari / Tanggal Kejadian"
              isLocked={false}
            />
            <RealTimeTimePicker
              value={waktuKejadian}
              onChange={setWaktuKejadian}
              label="Waktu Kejadian"
              isLocked={false}
            />
          </div>

          {/* Kategori & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Kasus
              </label>
              <select
                value={kategoriKasus}
                onChange={(e) =>
                  setKategoriKasus(e.target.value as ELaporRecord['kategoriKasus'])
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
              >
                <option value="Verbal">Verbal (Ejekan / Julukan Menghina)</option>
                <option value="Siber">Siber (Media Sosial / Pesan Menyakitkan)</option>
                <option value="Fisik">Fisik (Kontak Fisik / Dorongan)</option>
                <option value="Sosial/Relasional">Sosial/Relasional (Pengucilan Teman)</option>
                <option value="Lainnya">Lainnya / Non-Kekerasan</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Status Penanganan Kasus
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" /> Otomatis Terkunci Setelah Dikirim
                </span>
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ELaporRecord['status'])}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800 font-semibold"
              >
                <option value="Investigasi">Investigasi (Aduan Baru / Penyelidikan Fakta)</option>
                <option value="Mediasi">Mediasi (Proses Rekonsiliasi)</option>
                <option value="Selesai">Selesai (Kasus Tuntas Saling Memaafkan)</option>
                <option value="Terpantau Aman">Terpantau Aman (Zero Conflict)</option>
              </select>
            </div>
          </div>

          {/* Dual Identity Input: Pihak Pertama (Blue) & Pihak Kedua (Red) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Siswa I (Biru / Sky) */}
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 uppercase">
                  Identitas Siswa I (Pihak Pertama)
                </span>
                <button
                  type="button"
                  onClick={() => setPickerTarget('siswa1')}
                  className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white border border-sky-300 px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer"
                >
                  Pilih Siswa
                </button>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                  Nama Siswa <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  placeholder="Klik 'Pilih Siswa' atau ketik nama..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-sky-300 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Kelas</label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: 7A"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-sky-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            {/* Siswa II (Merah / Rose) */}
            <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 uppercase">
                  Identitas Siswa II (Pihak Kedua)
                </span>
                <button
                  type="button"
                  onClick={() => setPickerTarget('siswa2')}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white border border-rose-300 px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer"
                >
                  Pilih Siswa
                </button>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Nama Siswa</label>
                <input
                  type="text"
                  value={namaSiswa2}
                  onChange={(e) => setNamaSiswa2(e.target.value)}
                  placeholder="Pihak terkait / terlapor..."
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-300 rounded-lg text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Kelas</label>
                <input
                  type="text"
                  value={kelas2}
                  onChange={(e) => setKelas2(e.target.value)}
                  placeholder="Contoh: 7B"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-300 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Kronologi Kejadian */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Kronologi Kejadian / Konflik <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={kronologiKejadian}
              onChange={(e) => setKronologiKejadian(e.target.value)}
              placeholder="Deskripsikan urutan peristiwa, lokasi, serta saksi yang mengetahui..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
            />
          </div>

          {/* 4 Mekanisme Penanganan SPANJU (Expandable / Optional for Public Reporters) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <button
              type="button"
              onClick={() => setShowPilarSection(!showPilarSection)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mekanisme Kegiatan Penanganan SPANJU (4 Pilar) — Opsional bagi Pelapor
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dapat diisi pelapor atau dilengkapi kemudian oleh Operator / Tim TPPK setelah membuka kunci hasil aduan.
                </p>
              </div>
              {showPilarSection ? (
                <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
              )}
            </button>

            {showPilarSection && (
              <div className="space-y-4 pt-2 border-t border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      1. Kegiatan Penyadaran
                    </label>
                    <textarea
                      rows={2}
                      value={kegiatanPenyadaran}
                      onChange={(e) => setKegiatanPenyadaran(e.target.value)}
                      placeholder="Upaya konseling refleksi empati & budi pekerti..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      2. Kegiatan Pencegahan
                    </label>
                    <textarea
                      rows={2}
                      value={kegiatanPencegahan}
                      onChange={(e) => setKegiatanPencegahan(e.target.value)}
                      placeholder="Langkah antisipatif agar tidak terulang kembali..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      3. Kegiatan Penanganan Respon
                    </label>
                    <textarea
                      rows={2}
                      value={kegiatanPenangananRespon}
                      onChange={(e) => setKegiatanPenangananRespon(e.target.value)}
                      placeholder="Tindakan mediasi kekeluargaan / BK / TPPK..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      4. Kegiatan Pelaporan
                    </label>
                    <textarea
                      rows={2}
                      value={kegiatanPelaporan}
                      onChange={(e) => setKegiatanPelaporan(e.target.value)}
                      placeholder="Pencatatan berita acara & koordinasi kepala sekolah..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Tindak Lanjut & Keterangan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tindak Lanjut Kasus
                    </label>
                    <input
                      type="text"
                      value={tindakLanjut}
                      onChange={(e) => setTindakLanjut(e.target.value)}
                      placeholder="Contoh: Kesepakatan SP Damai & pemantauan berkala..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Keterangan Tambahan
                    </label>
                    <input
                      type="text"
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      placeholder="Catatan kerahasiaan atau status siswa..."
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
                    />
                  </div>
                </div>

                {/* Tanda Tangan Touchscreen */}
                <div className="pt-1">
                  <TouchSignaturePad
                    label="Tanda Tangan Pelapor / Petugas Konselor / Tim TPPK"
                    initialSignature={tandaTanganUrl}
                    onSave={setTandaTanganUrl}
                    onClear={() => setTandaTanganUrl('')}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
              <span>
                Setelah dikirim, laporan akan langsung dikunci dalam arsip TPPK dan hanya Operator yang dapat membuka kuncinya.
              </span>
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-rose-600/20 cursor-pointer transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Simpan &amp; Kirim Aduan</span>
            </button>
          </div>
        </form>
      </div>

      {/* LOCKED / UNLOCKED SUBMITTED COMPLAINTS RESULTS SECTION */}
      {!isResultsUnlocked ? (
        <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-extrabold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              <span>Hasil Kirim Aduan Terkunci • Khusus Operator</span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase">
                Arsip Hasil Kirim Aduan &amp; Berita Acara TPPK Terkunci
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Sesuai kebijakan kerahasiaan Satgas TPPK UPT SMPN 7 Pasuruan, seluruh hasil kirim aduan yang masuk otomatis <strong>dikunci secara permanen</strong> dari tampilan umum. Hanya <strong>Operator / Admin TPPK</strong> yang memiliki kredensial kunci untuk membuka dan menindaklanjuti daftar aduan ini.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>
                Saat ini tersimpan aman: <strong className="text-slate-900">{eLaporList.length} Laporan Aduan Terkunci</strong>
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setUnlockError('');
                  setIsUnlockModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Buka Kunci Hasil Aduan (Operator)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked View: Full Reports List for Operator */
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                <Unlock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-emerald-950 uppercase">
                  Hasil Kirim Aduan Terbuka ({eLaporList.length} Laporan)
                </h3>
                <p className="text-xs text-emerald-800">
                  Mode Operator Aktif — Anda dapat meninjau, mengedit, mencetak berita acara, atau mengunci kembali daftar aduan.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsResultsUnlocked(false)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex-shrink-0"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kunci Kembali Hasil Aduan</span>
            </button>
          </div>

          {eLaporList.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Belum ada data laporan kasus yang tercatat. Silakan isi formulir aduan di atas.
            </div>
          ) : (
            eLaporList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      EL
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{item.kodeLaporan}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            item.status === 'Selesai' || item.status === 'Terpantau Aman'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          Kategori: {item.kategoriKasus}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {item.hariTanggal} &bull; Pukul: {item.waktuKejadian}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      title="Edit Laporan"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintingRecord(item)}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      title="Cetak Berita Acara Resmi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeletingLabel(`laporan kasus ${item.kodeLaporan}`);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                      title="Hapus Laporan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Identity comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-sky-800 block">
                      Pihak Pertama (Siswa I)
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{item.namaSiswa}</span>
                    <span className="text-xs text-sky-700 block font-medium">Kelas {item.kelas}</span>
                  </div>

                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-rose-800 block">
                      Pihak Kedua (Siswa II)
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{item.namaSiswa2 || '-'}</span>
                    <span className="text-xs text-rose-700 block font-medium">
                      {item.kelas2 ? `Kelas ${item.kelas2}` : '-'}
                    </span>
                  </div>
                </div>

                {/* Kronologi */}
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Kronologi Kejadian
                  </span>
                  <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {item.kronologiKejadian}
                  </p>
                </div>

                {/* 4 Pillars Summary */}
                <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {item.kegiatanPenangananRespon && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <strong className="text-[10px] text-slate-500 uppercase block">Respon Penanganan:</strong>
                      <span className="text-slate-700">{item.kegiatanPenangananRespon}</span>
                    </div>
                  )}
                  {item.tindakLanjut && (
                    <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-200">
                      <strong className="text-[10px] text-emerald-800 uppercase block">Tindak Lanjut:</strong>
                      <span className="text-emerald-950 font-medium">{item.tindakLanjut}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* OPERATOR UNLOCK MODAL */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide">
                    Buka Kunci Hasil Aduan
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Verifikasi Khusus Operator / Admin TPPK
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUnlockModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/15 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUnlockSubmit} className="p-5 space-y-4">
              {unlockError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
                  {unlockError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Operator / Admin
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={unlockUsername}
                  onChange={(e) => setUnlockUsername(e.target.value)}
                  placeholder="Masukkan username operator/admin..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-700 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password Kunci Operator
                </label>
                <div className="relative">
                  <input
                    type={showUnlockPassword ? 'text' : 'password'}
                    required
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 pr-10 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-700 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showUnlockPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUnlockModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Buka Kunci Sekarang</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL FOR UNLOCKED REPORTS (OPERATOR ONLY) */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-600 to-red-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Edit Berita Acara E-Lapor</h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Perbarui tindak lanjut penanganan kasus oleh Operator / Satgas TPPK
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CalendarDatePicker
                  value={editHariTanggal}
                  onChange={setEditHariTanggal}
                  label="Hari / Tanggal Kejadian"
                  isLocked={true}
                />
                <RealTimeTimePicker
                  value={editWaktuKejadian}
                  onChange={setEditWaktuKejadian}
                  label="Waktu Kejadian"
                  isLocked={true}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori Kasus
                  </label>
                  <select
                    value={editKategori}
                    onChange={(e) =>
                      setEditKategori(e.target.value as ELaporRecord['kategoriKasus'])
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
                  >
                    <option value="Verbal">Verbal (Ejekan / Julukan Menghina)</option>
                    <option value="Siber">Siber (Media Sosial / Pesan Menyakitkan)</option>
                    <option value="Fisik">Fisik (Kontak Fisik / Dorongan)</option>
                    <option value="Sosial/Relasional">Sosial/Relasional (Pengucilan Teman)</option>
                    <option value="Lainnya">Lainnya / Non-Kekerasan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Penanganan Kasus
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ELaporRecord['status'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800 font-semibold"
                  >
                    <option value="Selesai">Selesai (Kasus Tuntas Saling Memaafkan)</option>
                    <option value="Terpantau Aman">Terpantau Aman (Zero Conflict)</option>
                    <option value="Mediasi">Mediasi (Proses Rekonsiliasi)</option>
                    <option value="Investigasi">Investigasi (Penyelidikan Fakta)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-900 uppercase">
                      Identitas Siswa I (Pihak Pertama)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerTarget('edit_siswa1')}
                      className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white border border-sky-300 px-2 py-0.5 rounded-lg cursor-pointer"
                    >
                      Pilih Siswa
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={editNamaSiswa}
                    onChange={(e) => setEditNamaSiswa(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-sky-300 rounded-lg text-slate-800"
                  />
                  <input
                    type="text"
                    value={editKelas}
                    onChange={(e) => setEditKelas(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-sky-300 rounded-lg text-slate-800"
                  />
                </div>

                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 uppercase">
                      Identitas Siswa II (Pihak Kedua)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerTarget('edit_siswa2')}
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white border border-rose-300 px-2 py-0.5 rounded-lg cursor-pointer"
                    >
                      Pilih Siswa
                    </button>
                  </div>
                  <input
                    type="text"
                    value={editNamaSiswa2}
                    onChange={(e) => setEditNamaSiswa2(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-300 rounded-lg text-slate-800"
                  />
                  <input
                    type="text"
                    value={editKelas2}
                    onChange={(e) => setEditKelas2(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-rose-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kronologi Kejadian / Konflik
                </label>
                <textarea
                  rows={3}
                  required
                  value={editKronologi}
                  onChange={(e) => setEditKronologi(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mekanisme Kegiatan Penanganan SPANJU (4 Pilar):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      1. Kegiatan Penyadaran
                    </label>
                    <textarea
                      rows={2}
                      value={editPenyadaran}
                      onChange={(e) => setEditPenyadaran(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      2. Kegiatan Pencegahan
                    </label>
                    <textarea
                      rows={2}
                      value={editPencegahan}
                      onChange={(e) => setEditPencegahan(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      3. Kegiatan Penanganan Respon
                    </label>
                    <textarea
                      rows={2}
                      value={editRespon}
                      onChange={(e) => setEditRespon(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                      4. Kegiatan Pelaporan
                    </label>
                    <textarea
                      rows={2}
                      value={editPelaporan}
                      onChange={(e) => setEditPelaporan(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tindak Lanjut Kasus
                  </label>
                  <input
                    type="text"
                    value={editTindakLanjut}
                    onChange={(e) => setEditTindakLanjut(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Keterangan Tambahan
                  </label>
                  <input
                    type="text"
                    value={editKeterangan}
                    onChange={(e) => setEditKeterangan(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Petugas Konselor / Tim TPPK"
                  initialSignature={editTandaTanganUrl}
                  onSave={setEditTandaTanganUrl}
                  onClear={() => setEditTandaTanganUrl('')}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Perbarui Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Picker Modal */}
      <StudentPickerModal
        isOpen={!!pickerTarget}
        onClose={() => setPickerTarget(null)}
        siswaList={siswaList}
        title={
          pickerTarget === 'siswa1' || pickerTarget === 'edit_siswa1'
            ? 'Pilih Siswa I (Pihak Pertama)'
            : 'Pilih Siswa II (Pihak Kedua)'
        }
        onSelect={(s) => {
          if (pickerTarget === 'siswa1') {
            setNamaSiswa(s.nama);
            setKelas(s.kelas);
          } else if (pickerTarget === 'siswa2') {
            setNamaSiswa2(s.nama);
            setKelas2(s.kelas);
          } else if (pickerTarget === 'edit_siswa1') {
            setEditNamaSiswa(s.nama);
            setEditKelas(s.kelas);
          } else if (pickerTarget === 'edit_siswa2') {
            setEditNamaSiswa2(s.nama);
            setEditKelas2(s.kelas);
          }
        }}
      />

      {/* Official Report Print Modal without date in title */}
      {printingRecord && (
        <OfficialReportModal
          isOpen={!!printingRecord}
          onClose={() => setPrintingRecord(null)}
          judulDokumen="BERITA ACARA E-LAPOR PERUNDUNGAN DAN KEKERASAN"
          tandaTanganUrl={printingRecord.tandaTanganUrl}
          namaPenandatangan="Wiwik Ismiati, S.Pd"
          jabatanPenandatangan="Koordinator TPPK / Guru BK"
          nipPenandatangan="19831116 200904 2 003"
          namaKepalaSekolah="Nur Fadilah, S.Pd,.M.Pd"
          nipKepalaSekolah="19860410 201001 2 030"
          tanggalDokumen={`Pasuruan, ${printingRecord.hariTanggal.split(',')[1] || printingRecord.hariTanggal}`}
        >
          <div className="space-y-4">
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold w-44 text-slate-700">Kode Laporan</td>
                  <td className="py-1.5">: {printingRecord.kodeLaporan}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Hari / Tanggal Kejadian</td>
                  <td className="py-1.5">: {printingRecord.hariTanggal}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Waktu Kejadian</td>
                  <td className="py-1.5">: {printingRecord.waktuKejadian}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Pihak Pertama (Siswa I)</td>
                  <td className="py-1.5">: {printingRecord.namaSiswa} (Kelas {printingRecord.kelas})</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Pihak Kedua (Siswa II)</td>
                  <td className="py-1.5">
                    : {printingRecord.namaSiswa2 ? `${printingRecord.namaSiswa2} (Kelas ${printingRecord.kelas2 || '-'})` : '-'}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Kronologi Konflik</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.kronologiKejadian}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Kategori Kasus</td>
                  <td className="py-1.5">: {printingRecord.kategoriKasus}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Mekanisme Penanganan</td>
                  <td className="py-1.5 align-top leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      {printingRecord.kegiatanPenyadaran && <li><strong>Penyadaran:</strong> {printingRecord.kegiatanPenyadaran}</li>}
                      {printingRecord.kegiatanPencegahan && <li><strong>Pencegahan:</strong> {printingRecord.kegiatanPencegahan}</li>}
                      {printingRecord.kegiatanPenangananRespon && <li><strong>Penanganan Respon:</strong> {printingRecord.kegiatanPenangananRespon}</li>}
                      {printingRecord.kegiatanPelaporan && <li><strong>Pelaporan:</strong> {printingRecord.kegiatanPelaporan}</li>}
                    </ul>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Tindak Lanjut Kasus</td>
                  <td className="py-1.5">: {printingRecord.tindakLanjut}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Status Penyelesaian</td>
                  <td className="py-1.5 font-bold text-emerald-700">: {printingRecord.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </OfficialReportModal>
      )}

      <ConfirmDeleteModal
        isOpen={!!deletingId}
        message={`Apakah Anda yakin ingin menghapus ${deletingLabel}?`}
        onConfirm={() => {
          if (deletingId) {
            onDeleteELapor(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
