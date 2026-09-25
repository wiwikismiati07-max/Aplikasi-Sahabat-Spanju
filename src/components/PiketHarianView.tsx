import React, { useState } from 'react';
import {
  ClipboardList,
  Printer,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Upload,
  Camera,
  Check,
  X,
  Layers,
  Sparkles,
  Link2,
} from 'lucide-react';
import { PiketRecord, SiswaMaster } from '../types';
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

interface PiketHarianViewProps {
  piketList: PiketRecord[];
  onAddPiket: (data: Omit<PiketRecord, 'id' | 'createdAt'>) => void;
  onUpdatePiket: (id: string, data: Partial<PiketRecord>) => void;
  onDeletePiket: (id: string) => void;
  siswaList: SiswaMaster[];
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const PiketHarianView: React.FC<PiketHarianViewProps> = ({
  piketList,
  onAddPiket,
  onUpdatePiket,
  onDeletePiket,
  siswaList,
  onOpenMenu,
  isAdmin,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<string>('');

  // Form Fields
  const [hariTanggal, setHariTanggal] = useState(getTodayIndoDate());
  const [waktu, setWaktu] = useState(getCurrentWibTime());
  const [namaAnggota, setNamaAnggota] = useState('');
  const [kelas, setKelas] = useState('');
  const [hasilTemuan, setHasilTemuan] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tandaTanganUrl, setTandaTanganUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Picker & Print Modals
  const [isStudentPickerOpen, setIsStudentPickerOpen] = useState(false);
  const [printingRecord, setPrintingRecord] = useState<PiketRecord | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setHariTanggal(getTodayIndoDate());
    setWaktu(getCurrentWibTime());
    setNamaAnggota('');
    setKelas('');
    setHasilTemuan('');
    setLinkFoto('');
    setKeterangan('');
    setTandaTanganUrl('');
    setIsFormOpen(false);
  };

  const handleEditClick = (record: PiketRecord) => {
    setEditingId(record.id);
    setHariTanggal(record.hariTanggal);
    setWaktu(record.waktu);
    setNamaAnggota(record.namaAnggota);
    setKelas(record.kelas);
    setHasilTemuan(record.hasilTemuan);
    setLinkFoto(record.linkFoto);
    setKeterangan(record.keterangan);
    setTandaTanganUrl(record.tandaTanganUrl || '');
    setIsFormOpen(true);
  };

  const handleTimemarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // Create a canvas to apply Timemark watermark stamp
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Draw original image
          ctx.drawImage(img, 0, 0);

          // Draw Timemark stamp box at bottom
          const bannerHeight = Math.max(img.height * 0.12, 70);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
          ctx.fillRect(0, img.height - bannerHeight, img.width, bannerHeight);

          // Stamp text
          ctx.fillStyle = '#ffffff';
          const fontSize = Math.max(img.width * 0.024, 18);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.fillText(`PIKET HARIAN SAHABAT SPANJU - SMPN 7 PASURUAN`, 24, img.height - bannerHeight + fontSize * 1.3);

          ctx.font = `${fontSize * 0.8}px sans-serif`;
          ctx.fillStyle = '#10b981';
          ctx.fillText(`${hariTanggal} • ${waktu}`, 24, img.height - bannerHeight + fontSize * 2.5);

          // Convert to base64
          const stampedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          // Upload to ImgBB via standard API or direct URL fallback
          const base64Data = stampedDataUrl.split(',')[1];
          const formData = new FormData();
          formData.append('image', base64Data);

          try {
            // Use ImgBB free API key
            const res = await fetch('https://api.imgbb.com/1/upload?key=52e1fc1636ebff2a3fef39ff5213d2f9', {
              method: 'POST',
              body: formData,
            });
            const json = await res.json();
            if (json?.data?.url) {
              setLinkFoto(json.data.url);
            } else {
              setLinkFoto(stampedDataUrl);
            }
          } catch {
            setLinkFoto(stampedDataUrl);
          }
          setIsUploadingPhoto(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAnggota || !hasilTemuan) {
      alert('Mohon lengkapi nama anggota dan hasil temuan harian.');
      return;
    }

    if (editingId) {
      onUpdatePiket(editingId, {
        hariTanggal,
        waktu,
        namaAnggota,
        kelas,
        hasilTemuan,
        linkFoto,
        keterangan,
        tandaTanganUrl,
      });
    } else {
      onAddPiket({
        hariTanggal,
        waktu,
        namaAnggota,
        kelas,
        hasilTemuan,
        linkFoto,
        keterangan,
        tandaTanganUrl,
        namaPenandatangan: 'Wiwik Ismiati, S.Pd',
        jabatanPenandatangan: 'Koordinator TPPK / Guru BK',
      });
    }
    resetForm();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <ClipboardList className="w-8 h-8 text-sky-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Patroli &amp; Pembiasaan Harian
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Piket Harian Sahabat SPANJU
            </h1>
            <p className="text-xs text-sky-100 max-w-xl">
              Pencatatan pembiasaan 5S, keamanan lingkungan sekolah, foto kegiatan timemark, dan tanda tangan digital petugas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-sky-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-sky-900 hover:bg-sky-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-700" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      </div>

      {/* Form Modal (Create / Edit) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Sticky Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-sky-600 to-blue-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Laporan Piket Harian' : 'Input Laporan Piket Harian'}
                </h3>
                <p className="text-xs text-sky-100 mt-0.5">
                  Lengkapi data hasil patroli harian dan foto kegiatan
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              {/* Date & Time Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CalendarDatePicker
                  value={hariTanggal}
                  onChange={setHariTanggal}
                  label="Hari / Tanggal"
                  isLocked={editingId !== null}
                />
                <RealTimeTimePicker
                  value={waktu}
                  onChange={setWaktu}
                  label="Waktu Pelaksanaan"
                  isLocked={editingId !== null}
                />
              </div>

              {/* Nama Anggota Harian (Student Picker) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Anggota Harian
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={namaAnggota}
                    onChange={(e) => setNamaAnggota(e.target.value)}
                    placeholder="Pilih dari Master Siswa atau ketik manual..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setIsStudentPickerOpen(true)}
                    className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
                  >
                    Pilih Siswa
                  </button>
                </div>
              </div>

              {/* Kelas / Lokasi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Kelas / Lokasi Patroli
                </label>
                <input
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  placeholder="Contoh: Selasar Kelas 7, Kantin, Gerbang Depan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>

              {/* Hasil Temuan Harian */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hasil Temuan Harian
                </label>
                <textarea
                  rows={3}
                  required
                  value={hasilTemuan}
                  onChange={(e) => setHasilTemuan(e.target.value)}
                  placeholder="Deskripsikan situasi pembiasaan pagi, ketertiban, dan interaksi siswa..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>

              {/* Link Foto Kegiatan with Timemark / ImgBB */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-sky-600" />
                    Link Foto Kegiatan (ImgBB / URL Luar)
                  </label>
                  {linkFoto && (
                    <a
                      href={linkFoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      Buka Foto <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={linkFoto}
                    onChange={(e) => setLinkFoto(e.target.value)}
                    placeholder="https://i.ibb.co/... atau tempel tautan foto luar"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-800"
                  />

                  {/* Upload with Timemark Button */}
                  <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{isUploadingPhoto ? 'Memproses...' : 'Upload Timemark'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTimemarkUpload}
                      disabled={isUploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[10px] text-slate-500">
                  Foto otomatis diberi stempel Timemark SPANJU dan diunggah ke ImgBB sehingga hanya tautan ringan yang disimpan di database Supabase.
                </p>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan Tambahan
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Catatan pendukung atau nama saksi pembiasaan..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 text-slate-800"
                />
              </div>

              {/* Tanda Tangan Touchscreen */}
              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Digital Petugas Piket"
                  initialSignature={tandaTanganUrl}
                  onSave={setTandaTanganUrl}
                  onClear={() => setTandaTanganUrl('')}
                />
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {editingId ? 'Perbarui Laporan' : 'Simpan Laporan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Picker Modal */}
      <StudentPickerModal
        isOpen={isStudentPickerOpen}
        onClose={() => setIsStudentPickerOpen(false)}
        siswaList={siswaList}
        title="Pilih Siswa untuk Anggota Piket Harian"
        onSelect={(s) => {
          setNamaAnggota(s.nama);
          setKelas(`Kelas ${s.kelas}`);
        }}
      />

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          <span>Daftar Rekapitulasi Piket Harian ({piketList.length})</span>
          <span>UPT SMPN 7 Pasuruan</span>
        </div>

        {piketList.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada catatan piket harian. Klik tombol &ldquo;Buat Laporan Baru&rdquo; di atas.
          </div>
        ) : (
          piketList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    PH
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.hariTanggal}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Pukul: {item.waktu} &bull; Lokasi: {item.kelas || 'Area Sekolah'}
                    </span>
                  </div>
                </div>

                {/* Actions: Edit, Print, Delete */}
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
                    className="p-1.5 bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-700 rounded-lg text-xs font-medium transition-colors"
                    title="Cetak Laporan Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeletingLabel(`catatan piket tanggal ${item.hariTanggal}`);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Content Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Nama Anggota Harian
                  </span>
                  <span className="font-semibold text-slate-800">{item.namaAnggota}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Foto Kegiatan
                  </span>
                  {item.linkFoto ? (
                    <a
                      href={item.linkFoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      Lihat Foto Timemark <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Tidak ada lampiran foto</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Hasil Temuan Harian
                  </span>
                  <p className="text-slate-700 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {item.hasilTemuan}
                  </p>
                </div>

                {item.keterangan && (
                  <div className="sm:col-span-2 text-[11px] text-slate-500">
                    <strong>Keterangan:</strong> {item.keterangan}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Report Print Modal */}
      {printingRecord && (
        <OfficialReportModal
          isOpen={!!printingRecord}
          onClose={() => setPrintingRecord(null)}
          judulDokumen="LAPORAN PIKET HARIAN"
          tandaTanganUrl={printingRecord.tandaTanganUrl}
          namaPenandatangan={printingRecord.namaPenandatangan || 'Wiwik Ismiati, S.Pd'}
          jabatanPenandatangan={printingRecord.jabatanPenandatangan || 'Koordinator TPPK / Guru BK'}
          nipPenandatangan="19831116 200904 2 003"
          namaKepalaSekolah="Nur Fadilah, S.Pd,.M.Pd"
          nipKepalaSekolah="19860410 201001 2 030"
          tanggalDokumen={`Pasuruan, ${printingRecord.hariTanggal.split(',')[1] || printingRecord.hariTanggal}`}
        >
          <div className="space-y-4">
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold w-40 text-slate-700">Hari / Tanggal</td>
                  <td className="py-1.5">: {printingRecord.hariTanggal}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Waktu Pelaksanaan</td>
                  <td className="py-1.5">: {printingRecord.waktu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Nama Anggota Harian</td>
                  <td className="py-1.5">: {printingRecord.namaAnggota}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Kelas / Lokasi</td>
                  <td className="py-1.5">: {printingRecord.kelas || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Hasil Temuan Harian</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.hasilTemuan}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Foto Kegiatan</td>
                  <td className="py-1.5">
                    : {printingRecord.linkFoto ? printingRecord.linkFoto : 'Terlampir dalam sistem digital'}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Keterangan</td>
                  <td className="py-1.5">: {printingRecord.keterangan || '-'}</td>
                </tr>
              </tbody>
            </table>

            {printingRecord.linkFoto && (
              <div className="mt-4 text-center">
                <div className="text-[11px] font-semibold text-slate-500 mb-1">
                  Dokumentasi Foto Pembiasaan Piket:
                </div>
                <img
                  src={printingRecord.linkFoto}
                  alt="Foto Piket"
                  className="max-h-48 mx-auto rounded-lg border border-slate-300 shadow-xs"
                />
              </div>
            )}
          </div>
        </OfficialReportModal>
      )}

      <ConfirmDeleteModal
        isOpen={!!deletingId}
        message={`Apakah Anda yakin ingin menghapus ${deletingLabel}?`}
        onConfirm={() => {
          if (deletingId) {
            onDeletePiket(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
