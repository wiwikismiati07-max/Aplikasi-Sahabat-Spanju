import React, { useState } from 'react';
import {
  AlertTriangle,
  Printer,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  X,
  UserCheck,
  Eye,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { ELaporRecord, SiswaMaster, UserProfile } from '../types';
import { CalendarDatePicker, RealTimeTimePicker } from './DateTimeWidgets';
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
  onOpenLogin,
}) => {
  const isAdminOrOperator = currentUser.role === 'admin' || currentUser.role === 'operator';

  if (!isAdminOrOperator) {
    return (
      <div className="w-full space-y-6 animate-in fade-in duration-200">
        {/* Banner Locked */}
        <div className="bg-gradient-to-r from-rose-800 via-rose-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-rose-600/30">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
              <Lock className="w-9 h-9 text-rose-200 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 border border-rose-300/30 text-rose-100 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                <span>Menu Dikunci Khusus Operator &amp; Admin</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                Aplikasi E-Lapor Perundungan &amp; Kekerasan
              </h1>
              <p className="text-xs sm:text-sm text-rose-100 max-w-2xl mt-1">
                Akses terbatas untuk perlindungan privasi data aduan, identitas korban, dan kerahasiaan penanganan kasus di UPT SMP Negeri 7 Pasuruan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-rose-50 active:bg-rose-100 text-rose-900 rounded-2xl text-xs font-bold shadow-lg transition-all cursor-pointer flex-shrink-0"
          >
            <Layers className="w-4 h-4 text-rose-700" />
            <span>Kembali ke Pilihan Menu</span>
          </button>
        </div>

        {/* Lock Explanation Card */}
        <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-800">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-rose-50/80 border border-rose-200">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-700 flex-shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm sm:text-base font-black text-rose-900 uppercase tracking-tight">
                Akses Terkunci Untuk Peran: <span className="underline decoration-rose-400">{currentUser.role.toUpperCase()}</span> ({currentUser.nama || 'Pengguna'})
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-medium">
                Sesuai regulasi kerahasiaan informasi Tim TPPK (Pencegahan dan Penanganan Kekerasan), modul <strong>E-Lapor Kekerasan &amp; Perundungan</strong> hanya dapat diakses dan dikelola oleh akun <strong>Administrator Sekolah &amp; Operator TPPK</strong>. Pengguna yang masuk sebagai <strong>Siswa, Guru, maupun Orang Tua</strong> tidak diberikan izin untuk membuka formulir maupun rekapitulasi aduan ini demi menjaga keamanan dan pencegahan kebocoran data sensitif.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Siapa Yang Memiliki Hak Akses Modul Ini?
              </h4>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside font-medium leading-relaxed">
                <li>
                  <strong className="text-slate-900">Operator Sekolah / Admin BK:</strong> Memverifikasi, menginvestigasi, serta mencatat alur penyelesaian kasus perundungan.
                </li>
                <li>
                  <strong className="text-slate-900">Koordinator TPPK SPANJU:</strong> Mengatur respon cepat, mediasi, dan penerbitan laporan resmi sekolah.
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Modul Publik Yang Bebas Diakses
              </h4>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Untuk keperluan umum dan aduan umum, Anda dapat mengakses menu:
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside font-medium">
                <li><strong>Hotline Siaga 24 Jam &amp; Konseling:</strong> Kontak langsung tim siaga.</li>
                <li><strong>Survey Kepuasan Layanan:</strong> Evaluasi &amp; saran kemudahan sistem.</li>
                <li><strong>Infografis &amp; Bagan SOP:</strong> Alur tolak ukur resmi sekolah.</li>
              </ul>
            </div>
          </div>

          {/* Role Status & Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600 font-medium flex items-center gap-2">
              <span>Status Login Aktif:</span>
              <span className="font-bold text-rose-800 uppercase px-3 py-1 bg-rose-100 border border-rose-200 rounded-lg text-[11px]">
                {currentUser.role} &bull; {currentUser.nama || 'Pengguna'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {onOpenLogin && (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-700/20"
                >
                  <KeyRound className="w-4 h-4 text-emerald-200" />
                  <span>Login Sebagai Admin / Operator</span>
                </button>
              )}
              <button
                type="button"
                onClick={onOpenMenu}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer text-center"
              >
                Ke Menu Utama
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<string>('');

  // Form Fields
  const [hariTanggal, setHariTanggal] = useState('Senin, 21 September 2026');
  const [waktuKejadian, setWaktuKejadian] = useState('10.00 WIB');
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

  // Student Picker Modals
  const [pickerTarget, setPickerTarget] = useState<'siswa1' | 'siswa2' | null>(null);

  // Print Modal
  const [printingRecord, setPrintingRecord] = useState<ELaporRecord | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setHariTanggal('Senin, 21 September 2026');
    setWaktuKejadian('10.00 WIB');
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
    setIsFormOpen(false);
  };

  const handleEditClick = (record: ELaporRecord) => {
    setEditingId(record.id);
    setHariTanggal(record.hariTanggal);
    setWaktuKejadian(record.waktuKejadian);
    setNamaSiswa(record.namaSiswa);
    setKelas(record.kelas);
    setNamaSiswa2(record.namaSiswa2 || '');
    setKelas2(record.kelas2 || '');
    setKronologiKejadian(record.kronologiKejadian);
    setKegiatanPenyadaran(record.kegiatanPenyadaran);
    setKegiatanPencegahan(record.kegiatanPencegahan);
    setKegiatanPenangananRespon(record.kegiatanPenangananRespon);
    setKegiatanPelaporan(record.kegiatanPelaporan);
    setTindakLanjut(record.tindakLanjut);
    setKeterangan(record.keterangan);
    setStatus(record.status);
    setKategoriKasus(record.kategoriKasus);
    setTandaTanganUrl(record.tandaTanganUrl || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa || !kronologiKejadian) {
      alert('Mohon lengkapi nama siswa dan kronologi kejadian.');
      return;
    }

    if (editingId) {
      onUpdateELapor(editingId, {
        hariTanggal,
        waktuKejadian,
        namaSiswa,
        kelas,
        namaSiswa2,
        kelas2,
        kronologiKejadian,
        kegiatanPenyadaran,
        kegiatanPencegahan,
        kegiatanPenangananRespon,
        kegiatanPelaporan,
        tindakLanjut,
        keterangan,
        status,
        kategoriKasus,
        tandaTanganUrl,
      });
    } else {
      const kode = `SPJ-${new Date().getFullYear()}-${String(eLaporList.length + 1).padStart(3, '0')}`;
      onAddELapor({
        kodeLaporan: kode,
        hariTanggal,
        waktuKejadian,
        namaSiswa,
        kelas,
        namaSiswa2,
        kelas2,
        kronologiKejadian,
        kegiatanPenyadaran,
        kegiatanPencegahan,
        kegiatanPenangananRespon,
        kegiatanPelaporan,
        tindakLanjut,
        keterangan,
        status,
        kategoriKasus,
        tandaTanganUrl,
        namaPenandatangan: 'WIWIK ISMIATI, S.Pd',
        jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
        namaPetugas: 'WIWIK ISMIATI, S.Pd',
      });
    }
    resetForm();
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
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-100 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Layanan Perlindungan &amp; TPPK
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              E-Lapor Perundungan &amp; Kekerasan
            </h1>
            <p className="text-xs text-rose-100 max-w-xl">
              Sistem pelaporan resmi dan penanganan terpadu 4 mekanisme (Penyadaran, Pencegahan, Respon, Pelaporan) di UPT SMPN 7 Pasuruan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-rose-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-rose-900 hover:bg-rose-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-rose-700" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-600 to-red-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Berita Acara E-Lapor' : 'Formulir Aduan & Laporan Insiden'}
                </h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Data pelapor dan korban dilindungi penuh oleh Satgas TPPK
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CalendarDatePicker
                  value={hariTanggal}
                  onChange={setHariTanggal}
                  label="Hari / Tanggal Kejadian"
                />
                <RealTimeTimePicker
                  value={waktuKejadian}
                  onChange={setWaktuKejadian}
                  label="Waktu Kejadian"
                />
              </div>

              {/* Status & Kategori Kasus */}
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status Penanganan Kasus
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ELaporRecord['status'])}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800 font-semibold"
                  >
                    <option value="Investigasi">Investigasi (Penyelidikan Fakta)</option>
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
                      className="text-[11px] font-bold text-sky-700 hover:text-sky-900 bg-white border border-sky-300 px-2 py-0.5 rounded-lg shadow-2xs"
                    >
                      Pilih Siswa
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Nama Siswa</label>
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
                      className="text-[11px] font-bold text-rose-700 hover:text-rose-900 bg-white border border-rose-300 px-2 py-0.5 rounded-lg shadow-2xs"
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
                  Kronologi Kejadian / Konflik
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

              {/* 4 Mekanisme Penanganan SPANJU */}
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
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
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Tanda Tangan Touchscreen */}
              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Petugas Konselor / Tim TPPK"
                  initialSignature={tandaTanganUrl}
                  onSave={setTandaTanganUrl}
                  onClear={() => setTandaTanganUrl('')}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Perbarui Laporan' : 'Simpan & Kirim Aduan'}
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
        title={pickerTarget === 'siswa1' ? 'Pilih Siswa I (Pihak Pertama)' : 'Pilih Siswa II (Pihak Kedua)'}
        onSelect={(s) => {
          if (pickerTarget === 'siswa1') {
            setNamaSiswa(s.nama);
            setKelas(s.kelas);
          } else if (pickerTarget === 'siswa2') {
            setNamaSiswa2(s.nama);
            setKelas2(s.kelas);
          }
        }}
      />

      {/* Content View Based on Roles:
          - Non-Admin (Siswa / Guru / Orangtua): View is PROTECTED (shows Privacy & Confidentiality Box).
          - Admin / Operator: Full list of reports, edit, delete, print. */}
      {!isAdminOrOperator ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <div className="max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900 uppercase">
              Panel Perlindungan &amp; Kerahasiaan Data Aduan Resmi
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sesuai dengan Kode Etik Bimbingan Konseling dan Kebijakan Perlindungan Anak Satgas TPPK UPT SMPN 7 Pasuruan, seluruh rincian laporan perundungan bersifat <strong>rahasia dan konfidensial</strong>.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Data laporan hanya dapat diakses, ditinjau, dan ditindaklanjuti oleh Administrator Sekolah dan Tim Guru Satgas TPPK. Anda tetap dapat mengirimkan laporan baru melalui tombol di atas.
            </p>
          </div>
        </div>
      ) : (
        /* Admin View: Full Reports List */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            <span>Daftar Berita Acara Kasus TPPK ({eLaporList.length})</span>
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <Lock className="w-3 h-3" /> Akses Khusus Admin &amp; Satgas
            </span>
          </div>

          {eLaporList.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
              Belum ada data laporan kasus yang tercatat. Klik tombol &ldquo;Buat Laporan Baru&rdquo; di atas.
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
                      <div className="flex items-center gap-2">
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
                      className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-lg text-xs font-medium transition-colors"
                      title="Edit Laporan"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintingRecord(item)}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
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
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
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

      {/* Official Report Print Modal without date in title */}
      {printingRecord && (
        <OfficialReportModal
          isOpen={!!printingRecord}
          onClose={() => setPrintingRecord(null)}
          judulDokumen="BERITA ACARA E-LAPOR PERUNDUNGAN DAN KEKERASAN"
          tandaTanganUrl={printingRecord.tandaTanganUrl}
          namaPenandatangan="WIWIK ISMIATI, S.Pd"
          jabatanPenandatangan="Koordinator TPPK / Guru BK"
          nipPenandatangan="19831116 200904 2 003"
          namaKepalaSekolah="NUR FADILAH, S.Pd., M.Pd"
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
