import React, { useState } from 'react';
import {
  Trees,
  Printer,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  Sparkles,
  X,
  ListPlus,
} from 'lucide-react';
import { KebunRecord, RTLItem } from '../types';
import {
  CalendarDatePicker,
  RealTimeTimePicker,
  getTodayIndoDate,
  getCurrentWibTime,
} from './DateTimeWidgets';
import { TouchSignaturePad } from './TouchSignaturePad';
import { OfficialReportModal } from './OfficialReportModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface KebunLuasBerseriViewProps {
  kebunList: KebunRecord[];
  onAddKebun: (data: Omit<KebunRecord, 'id' | 'createdAt'>) => void;
  onUpdateKebun: (id: string, data: Partial<KebunRecord>) => void;
  onDeleteKebun: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const KebunLuasBerseriView: React.FC<KebunLuasBerseriViewProps> = ({
  kebunList,
  onAddKebun,
  onUpdateKebun,
  onDeleteKebun,
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
  const [evaluasiProgramTerlaksana, setEvaluasiProgramTerlaksana] = useState('');
  const [evaluasiKendalaSolusi, setEvaluasiKendalaSolusi] = useState('');
  const [hasilInovasi, setHasilInovasi] = useState('');
  const [produkKreatif, setProdukKreatif] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tandaTanganUrl, setTandaTanganUrl] = useState('');

  // RTL Table State
  const [rtlList, setRtlList] = useState<RTLItem[]>([
    { id: '1', programKegiatan: 'Sosialisasi Duta SPANJU', pic: 'Wiwik Ismiati, S.Pd', targetPelaksanaan: '24 Rombel', deadline: '30 September 2026' },
  ]);

  // Print Modal
  const [printingRecord, setPrintingRecord] = useState<KebunRecord | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setHariTanggal(getTodayIndoDate());
    setWaktu(getCurrentWibTime());
    setEvaluasiProgramTerlaksana('');
    setEvaluasiKendalaSolusi('');
    setHasilInovasi('');
    setProdukKreatif('');
    setRtlList([{ id: '1', programKegiatan: '', pic: '', targetPelaksanaan: '', deadline: '' }]);
    setKeterangan('');
    setTandaTanganUrl('');
    setIsFormOpen(false);
  };

  const handleEditClick = (record: KebunRecord) => {
    setEditingId(record.id);
    setHariTanggal(record.hariTanggal);
    setWaktu(record.waktu);
    setEvaluasiProgramTerlaksana(record.evaluasiProgramTerlaksana);
    setEvaluasiKendalaSolusi(record.evaluasiKendalaSolusi);
    setHasilInovasi(record.hasilInovasi);
    setProdukKreatif(record.produkKreatif);
    setRtlList(record.rencanaTindakLanjut?.length ? record.rencanaTindakLanjut : []);
    setKeterangan(record.keterangan);
    setTandaTanganUrl(record.tandaTanganUrl || '');
    setIsFormOpen(true);
  };

  const addRtlRow = () => {
    setRtlList((prev) => [
      ...prev,
      { id: String(Date.now()), programKegiatan: '', pic: '', targetPelaksanaan: '', deadline: '' },
    ]);
  };

  const removeRtlRow = (index: number) => {
    setRtlList((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateRtlRow = (index: number, field: keyof RTLItem, val: string) => {
    setRtlList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluasiProgramTerlaksana || !hasilInovasi) {
      alert('Mohon lengkapi evaluasi program dan hasil inovasi bulanan.');
      return;
    }

    if (editingId) {
      onUpdateKebun(editingId, {
        hariTanggal,
        waktu,
        evaluasiProgramTerlaksana,
        evaluasiKendalaSolusi,
        hasilInovasi,
        produkKreatif,
        rencanaTindakLanjut: rtlList,
        keterangan,
        tandaTanganUrl,
      });
    } else {
      onAddKebun({
        hariTanggal,
        waktu,
        evaluasiProgramTerlaksana,
        evaluasiKendalaSolusi,
        hasilInovasi,
        produkKreatif,
        rencanaTindakLanjut: rtlList,
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
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <Trees className="w-8 h-8 text-teal-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/30 text-teal-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Kegiatan Bulanan Evaluasi, Inovasi &amp; Kreatif
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Kebun Luas Berseri
            </h1>
            <p className="text-xs text-teal-100 max-w-xl">
              Evaluasi program bulanan, perumusan kendala &amp; solusi, produk kreatif ramah anak, dan matriks Rencana Tindak Lanjut (RTL).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-teal-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-700" />
            <span>Input Evaluasi Bulanan</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-600 to-emerald-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Notulen Kebun Luas Berseri' : 'Input Evaluasi Bulanan Kebun Luas Berseri'}
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  Kegiatan bulanan evaluasi, berinovasi, dan kreatif bersama TPPK
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

              {/* Evaluasi Kegiatan */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  I. Evaluasi Kegiatan Bulanan
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Program yang Berhasil Terlaksana
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={evaluasiProgramTerlaksana}
                    onChange={(e) => setEvaluasiProgramTerlaksana(e.target.value)}
                    placeholder="Sebutkan kegiatan dan program yang berhasil diselenggarakan..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Kendala Utama &amp; Solusi yang Disepakati
                  </label>
                  <textarea
                    rows={2}
                    value={evaluasiKendalaSolusi}
                    onChange={(e) => setEvaluasiKendalaSolusi(e.target.value)}
                    placeholder="Hambatan yang ditemui serta kesepakatan solusi pemecahannya..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Hasil Inovasi & Produk Kreatif */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  II. Hasil Inovasi &amp; Produk Kreatif
                </h4>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Hasil Inovasi (Rancangan / Metode Baru Bulan Berikutnya)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={hasilInovasi}
                    onChange={(e) => setHasilInovasi(e.target.value)}
                    placeholder="Daftar rancangan/metode baru yang disepakati untuk diterapkan pada bulan berikutnya..."
                    className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Produk Kreatif (Tautan/Lampiran Foto, Media, Dokumen)
                  </label>
                  <input
                    type="text"
                    value={produkKreatif}
                    onChange={(e) => setProdukKreatif(e.target.value)}
                    placeholder="Contoh: Modul Digital, 24 Poster Rombel, Tautan Google Drive materi..."
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Rencana Tindak Lanjut (RTL) Table */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    III. Rencana Tindak Lanjut (RTL)
                  </h4>
                  <button
                    type="button"
                    onClick={addRtlRow}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 bg-white border border-teal-200 px-2.5 py-1 rounded-lg shadow-2xs"
                  >
                    <ListPlus className="w-3.5 h-3.5" /> Tambah Baris
                  </button>
                </div>

                <div className="space-y-2">
                  {rtlList.map((row, idx) => (
                    <div
                      key={row.id || idx}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-white p-2.5 rounded-xl border border-slate-200"
                    >
                      <input
                        type="text"
                        placeholder="Program / Kegiatan"
                        value={row.programKegiatan}
                        onChange={(e) => updateRtlRow(idx, 'programKegiatan', e.target.value)}
                        className="text-xs p-1.5 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="PIC / Penanggung Jawab"
                        value={row.pic}
                        onChange={(e) => updateRtlRow(idx, 'pic', e.target.value)}
                        className="text-xs p-1.5 border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Target Pelaksanaan"
                        value={row.targetPelaksanaan}
                        onChange={(e) => updateRtlRow(idx, 'targetPelaksanaan', e.target.value)}
                        className="text-xs p-1.5 border border-slate-200 rounded-lg"
                      />
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Deadline"
                          value={row.deadline}
                          onChange={(e) => updateRtlRow(idx, 'deadline', e.target.value)}
                          className="flex-1 text-xs p-1.5 border border-slate-200 rounded-lg"
                        />
                        {rtlList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRtlRow(idx)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Peserta hadir atau catatan pleno..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 text-slate-800"
                />
              </div>

              {/* Tanda Tangan */}
              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Pengesahan Pleno Bulanan"
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
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Perbarui Laporan' : 'Simpan Notulen Bulanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          <span>Arsip Pleno Kebun Luas Berseri ({kebunList.length})</span>
          <span>UPT SMPN 7 Pasuruan</span>
        </div>

        {kebunList.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada arsip pleno bulanan. Klik tombol &ldquo;Input Evaluasi Bulanan&rdquo; di atas.
          </div>
        ) : (
          kebunList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    KL
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.hariTanggal}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">Pukul: {item.waktu}</span>
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
                    className="p-1.5 bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 rounded-lg text-xs font-medium transition-colors"
                    title="Cetak Laporan Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeletingLabel(`arsip Kebun Luas Berseri tanggal ${item.hariTanggal}`);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Program yang Berhasil Terlaksana
                  </span>
                  <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {item.evaluasiProgramTerlaksana}
                  </p>
                </div>

                {item.evaluasiKendalaSolusi && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Kendala Utama &amp; Solusi yang Disepakati
                    </span>
                    <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      {item.evaluasiKendalaSolusi}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 block">
                    Hasil Inovasi (Metode Baru Bulan Berikutnya)
                  </span>
                  <p className="text-teal-900 font-medium mt-0.5 bg-teal-50/50 p-2.5 rounded-xl border border-teal-200">
                    {item.hasilInovasi}
                  </p>
                </div>

                {item.produkKreatif && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Produk Kreatif &amp; Media Pembelajaran
                    </span>
                    <p className="text-slate-700 mt-0.5 font-semibold">
                      {item.produkKreatif}
                    </p>
                  </div>
                )}

                {/* RTL Summary */}
                {item.rencanaTindakLanjut?.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Matriks Rencana Tindak Lanjut (RTL)
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] border border-slate-200 rounded-lg overflow-hidden">
                        <thead className="bg-slate-100 text-slate-700">
                          <tr>
                            <th className="p-1.5 text-left">Program/Kegiatan</th>
                            <th className="p-1.5 text-left">PIC</th>
                            <th className="p-1.5 text-left">Target</th>
                            <th className="p-1.5 text-left">Deadline</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {item.rencanaTindakLanjut.map((rtl, i) => (
                            <tr key={i}>
                              <td className="p-1.5 font-medium">{rtl.programKegiatan}</td>
                              <td className="p-1.5">{rtl.pic}</td>
                              <td className="p-1.5">{rtl.targetPelaksanaan}</td>
                              <td className="p-1.5 font-semibold text-teal-700">{rtl.deadline}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Official Print Modal with clean title */}
      {printingRecord && (
        <OfficialReportModal
          isOpen={!!printingRecord}
          onClose={() => setPrintingRecord(null)}
          judulDokumen="NOTULEN & EVALUASI KEBUN LUAS BERSERI"
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
                  <td className="py-1.5 font-bold w-48 text-slate-700">Hari / Tanggal Pleno</td>
                  <td className="py-1.5">: {printingRecord.hariTanggal}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Waktu Pelaksanaan</td>
                  <td className="py-1.5">: {printingRecord.waktu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Program yang Terlaksana</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.evaluasiProgramTerlaksana}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Kendala Utama &amp; Solusi</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.evaluasiKendalaSolusi || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Hasil Inovasi Baru</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.hasilInovasi}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Produk Kreatif Dihasilkan</td>
                  <td className="py-1.5">: {printingRecord.produkKreatif || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Keterangan / Peserta Pleno</td>
                  <td className="py-1.5">: {printingRecord.keterangan || '-'}</td>
                </tr>
              </tbody>
            </table>

            {printingRecord.rencanaTindakLanjut?.length > 0 && (
              <div className="mt-3">
                <div className="font-bold text-xs text-slate-800 mb-1">Matriks Rencana Tindak Lanjut (RTL):</div>
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 border border-slate-300">
                      <th className="border border-slate-300 p-1 text-left">No</th>
                      <th className="border border-slate-300 p-1 text-left">Program/Kegiatan</th>
                      <th className="border border-slate-300 p-1 text-left">PIC</th>
                      <th className="border border-slate-300 p-1 text-left">Target</th>
                      <th className="border border-slate-300 p-1 text-left">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {printingRecord.rencanaTindakLanjut.map((rtl, idx) => (
                      <tr key={idx} className="border border-slate-300">
                        <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                        <td className="border border-slate-300 p-1">{rtl.programKegiatan}</td>
                        <td className="border border-slate-300 p-1">{rtl.pic}</td>
                        <td className="border border-slate-300 p-1">{rtl.targetPelaksanaan}</td>
                        <td className="border border-slate-300 p-1 font-semibold">{rtl.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            onDeleteKebun(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
