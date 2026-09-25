import React, { useState } from 'react';
import {
  BookUser,
  Printer,
  Plus,
  Trash2,
  Edit,
  Layers,
  Sparkles,
  X,
  Building,
} from 'lucide-react';
import { BukuTamuRecord } from '../types';
import {
  CalendarDatePicker,
  RealTimeTimePicker,
  getTodayIndoDate,
  getCurrentWibTime,
} from './DateTimeWidgets';
import { TouchSignaturePad } from './TouchSignaturePad';
import { OfficialReportModal } from './OfficialReportModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface BukuTamuViewProps {
  tamuList: BukuTamuRecord[];
  onAddTamu: (data: Omit<BukuTamuRecord, 'id' | 'createdAt'>) => void;
  onUpdateTamu: (id: string, data: Partial<BukuTamuRecord>) => void;
  onDeleteTamu: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const BukuTamuView: React.FC<BukuTamuViewProps> = ({
  tamuList,
  onAddTamu,
  onUpdateTamu,
  onDeleteTamu,
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
  const [namaTamu, setNamaTamu] = useState('');
  const [asalInstansi, setAsalInstansi] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [maksudKunjungan, setMaksudKunjungan] = useState('');
  const [tandaTanganUrl, setTandaTanganUrl] = useState('');

  // Print Modal
  const [printingRecord, setPrintingRecord] = useState<BukuTamuRecord | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setHariTanggal(getTodayIndoDate());
    setWaktu(getCurrentWibTime());
    setNamaTamu('');
    setAsalInstansi('');
    setJabatan('');
    setMaksudKunjungan('');
    setTandaTanganUrl('');
    setIsFormOpen(false);
  };

  const handleEditClick = (record: BukuTamuRecord) => {
    setEditingId(record.id);
    setHariTanggal(record.hariTanggal || '');
    setWaktu(record.waktu || record.jamKedatangan || '');
    setNamaTamu(record.namaTamu || record.namaLengkap || '');
    setAsalInstansi(record.asalInstansi || record.instansiAsal || '');
    setJabatan(record.jabatan || '');
    setMaksudKunjungan(record.maksudKunjungan || record.tujuanKunjungan || '');
    setTandaTanganUrl(record.tandaTanganUrl || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTamu || !asalInstansi || !maksudKunjungan) {
      alert('Mohon lengkapi nama tamu, asal instansi, dan maksud kunjungan.');
      return;
    }

    if (editingId) {
      onUpdateTamu(editingId, {
        hariTanggal,
        waktu,
        namaTamu,
        asalInstansi,
        jabatan,
        maksudKunjungan,
        tandaTanganUrl,
      });
    } else {
      onAddTamu({
        hariTanggal,
        waktu,
        namaTamu,
        asalInstansi,
        jabatan,
        maksudKunjungan,
        tandaTanganUrl,
        penerimaTamu: 'Nur Fadilah, S.Pd,.M.Pd',
      });
    }
    resetForm();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <BookUser className="w-8 h-8 text-slate-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-600/50 text-slate-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Registrasi Kunjungan Kedinasan
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Buku Tamu Digital SPANJU
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Pencatatan resmi kunjungan pengawas, dinas pendidikan, instansi mitra, dan orang tua siswa dengan tanda tangan digital langsung di layar sentuh.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-slate-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-700" />
            <span>Registrasi Tamu Baru</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-900 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Data Buku Tamu' : 'Formulir Registrasi Tamu Kedinasan'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  UPT SMP Negeri 7 Pasuruan
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
                  label="Hari / Tanggal Kunjungan"
                  isLocked={editingId !== null}
                />
                <RealTimeTimePicker
                  value={waktu}
                  onChange={setWaktu}
                  label="Waktu Kehadiran"
                  isLocked={editingId !== null}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Tamu (Gelar)
                </label>
                <input
                  type="text"
                  required
                  value={namaTamu}
                  onChange={(e) => setNamaTamu(e.target.value)}
                  placeholder="Contoh: Drs. H. Bambang Subagyo, M.Pd"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Asal Instansi / Lembaga
                  </label>
                  <input
                    type="text"
                    required
                    value={asalInstansi}
                    onChange={(e) => setAsalInstansi(e.target.value)}
                    placeholder="Contoh: Dinas Pendidikan Kota Pasuruan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jabatan
                  </label>
                  <input
                    type="text"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Contoh: Pengawas Sekolah Ahli Madya"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Maksud / Tujuan Kunjungan
                </label>
                <textarea
                  rows={3}
                  required
                  value={maksudKunjungan}
                  onChange={(e) => setMaksudKunjungan(e.target.value)}
                  placeholder="Jelaskan maksud dan agenda kunjungan..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 text-slate-800"
                />
              </div>

              {/* Tanda Tangan Tamu */}
              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Digital Tamu (Layar Sentuh)"
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
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Perbarui Data Tamu' : 'Simpan Kunjungan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          <span>Daftar Kunjungan Tamu Kedinasan ({tamuList.length})</span>
          <span>UPT SMPN 7 Pasuruan</span>
        </div>

        {tamuList.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada catatan kunjungan tamu. Klik tombol &ldquo;Registrasi Tamu Baru&rdquo; di atas.
          </div>
        ) : (
          tamuList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    BT
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.namaTamu}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.asalInstansi} {item.jabatan ? `(${item.jabatan})` : ''}
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
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium transition-colors"
                    title="Cetak Berkas Kunjungan"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeletingLabel(`catatan tamu atas nama ${item.namaTamu}`);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Waktu Kehadiran
                  </span>
                  <span className="text-slate-700 font-medium">
                    {item.hariTanggal} &bull; Pukul: {item.waktu}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Penerima Kunjungan
                  </span>
                  <span className="text-slate-700 font-medium">
                    {item.penerimaTamu || 'Kepala Sekolah & Tim TPPK'}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Maksud / Tujuan Kunjungan
                  </span>
                  <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {item.maksudKunjungan}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Print Modal without date in title */}
      {printingRecord && (
        <OfficialReportModal
          isOpen={!!printingRecord}
          onClose={() => setPrintingRecord(null)}
          judulDokumen="BUKU TAMU KEDINASAN"
          tandaTanganUrl={printingRecord.tandaTanganUrl}
          namaPenandatangan={printingRecord.namaTamu}
          jabatanPenandatangan={printingRecord.jabatan || 'Tamu Kedinasan'}
          nipPenandatangan=""
          namaKepalaSekolah="Nur Fadilah, S.Pd,.M.Pd"
          nipKepalaSekolah="19860410 201001 2 030"
          tanggalDokumen={`Pasuruan, ${printingRecord.hariTanggal.split(',')[1] || printingRecord.hariTanggal}`}
        >
          <div className="space-y-4">
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold w-44 text-slate-700">Hari / Tanggal</td>
                  <td className="py-1.5">: {printingRecord.hariTanggal}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Waktu Kehadiran</td>
                  <td className="py-1.5">: {printingRecord.waktu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Nama Tamu</td>
                  <td className="py-1.5 font-bold">: {printingRecord.namaTamu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Asal Instansi / Lembaga</td>
                  <td className="py-1.5">: {printingRecord.asalInstansi}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Jabatan</td>
                  <td className="py-1.5">: {printingRecord.jabatan || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Maksud / Tujuan Kunjungan</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.maksudKunjungan}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Penerima Tamu</td>
                  <td className="py-1.5">: {printingRecord.penerimaTamu || 'Kepala Sekolah UPT SMPN 7 Pasuruan'}</td>
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
            onDeleteTamu(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
