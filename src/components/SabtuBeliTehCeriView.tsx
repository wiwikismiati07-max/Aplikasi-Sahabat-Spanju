import React, { useState } from 'react';
import {
  Coffee,
  Printer,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import { CeriRecord } from '../types';
import {
  CalendarDatePicker,
  RealTimeTimePicker,
  getTodayIndoDate,
  getCurrentWibTime,
} from './DateTimeWidgets';
import { TouchSignaturePad } from './TouchSignaturePad';
import { OfficialReportModal } from './OfficialReportModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface SabtuBeliTehCeriViewProps {
  ceriList: CeriRecord[];
  onAddCeri: (data: Omit<CeriRecord, 'id' | 'createdAt'>) => void;
  onUpdateCeri: (id: string, data: Partial<CeriRecord>) => void;
  onDeleteCeri: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const SabtuBeliTehCeriView: React.FC<SabtuBeliTehCeriViewProps> = ({
  ceriList,
  onAddCeri,
  onUpdateCeri,
  onDeleteCeri,
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
  const [hasilTemuanSatuMinggu, setHasilTemuanSatuMinggu] = useState('');
  const [evaluasiKegiatan, setEvaluasiKegiatan] = useState('');
  const [rencanaInovasi, setRencanaInovasi] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tandaTanganUrl, setTandaTanganUrl] = useState('');

  // Print Modal
  const [printingRecord, setPrintingRecord] = useState<CeriRecord | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setHariTanggal(getTodayIndoDate());
    setWaktu(getCurrentWibTime());
    setHasilTemuanSatuMinggu('');
    setEvaluasiKegiatan('');
    setRencanaInovasi('');
    setLinkFoto('');
    setKeterangan('');
    setTandaTanganUrl('');
    setIsFormOpen(false);
  };

  const handleEditClick = (record: CeriRecord) => {
    setEditingId(record.id);
    setHariTanggal(record.hariTanggal);
    setWaktu(record.waktu);
    setHasilTemuanSatuMinggu(record.hasilTemuanSatuMinggu);
    setEvaluasiKegiatan(record.evaluasiKegiatan);
    setRencanaInovasi(record.rencanaInovasi);
    setLinkFoto(record.linkFoto);
    setKeterangan(record.keterangan);
    setTandaTanganUrl(record.tandaTanganUrl || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasilTemuanSatuMinggu || !evaluasiKegiatan) {
      alert('Mohon lengkapi hasil temuan 1 minggu dan evaluasi kegiatan.');
      return;
    }

    if (editingId) {
      onUpdateCeri(editingId, {
        hariTanggal,
        waktu,
        hasilTemuanSatuMinggu,
        evaluasiKegiatan,
        rencanaInovasi,
        linkFoto,
        keterangan,
        tandaTanganUrl,
      });
    } else {
      onAddCeri({
        hariTanggal,
        waktu,
        hasilTemuanSatuMinggu,
        evaluasiKegiatan,
        rencanaInovasi,
        linkFoto,
        keterangan,
        tandaTanganUrl,
        namaPenandatangan: 'Eki Febriani, S.Pd',
        jabatanPenandatangan: 'Guru BK / Tim TPPK',
      });
    }
    resetForm();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <Coffee className="w-8 h-8 text-amber-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Sesi Mingguan &bull; Cerita dan Ide
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Sabtu Beli Teh Ceri
            </h1>
            <p className="text-xs text-amber-100 max-w-xl">
              Sabtu Bersama Mengulik Temuan Harian Cerita dan Ide: refleksi mingguan, evaluasi kegiatan ramah anak, dan rencana inovasi bersama.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-amber-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-700" />
            <span>Input Temuan Ceri</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-600 to-orange-600 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Temuan & Ide Ceri' : 'Input Sesi Sabtu Beli Teh Ceri'}
                </h3>
                <p className="text-xs text-amber-100 mt-0.5">
                  Sabtu Bersama Mengulik Temuan Harian Cerita dan Ide
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
                  label="Waktu Sesi Ceri"
                  isLocked={editingId !== null}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hasil Temuan 1 Minggu
                </label>
                <textarea
                  rows={3}
                  required
                  value={hasilTemuanSatuMinggu}
                  onChange={(e) => setHasilTemuanSatuMinggu(e.target.value)}
                  placeholder="Ceritakan rangkuman temuan interaksi siswa dan suasana sekolah selama sepekan..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Evaluasi Kegiatan
                </label>
                <textarea
                  rows={3}
                  required
                  value={evaluasiKegiatan}
                  onChange={(e) => setEvaluasiKegiatan(e.target.value)}
                  placeholder="Evaluasi pelaksanaan program pembiasaan, kendala, atau hal yang perlu ditingkatkan..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rencana Inovasi / Kegiatan
                </label>
                <textarea
                  rows={2}
                  value={rencanaInovasi}
                  onChange={(e) => setRencanaInovasi(e.target.value)}
                  placeholder="Gagasan baru atau aksi kreatif yang akan dijalankan pekan berikutnya..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Link Foto Kegiatan
                </label>
                <input
                  type="url"
                  value={linkFoto}
                  onChange={(e) => setLinkFoto(e.target.value)}
                  placeholder="https://i.ibb.co/... atau Google Drive foto dokumentasi"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Keterangan
                </label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Peserta hadir atau catatan diskusi..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
              </div>

              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Koordinator Sesi Ceri"
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
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Perbarui Laporan' : 'Simpan Laporan Ceri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          <span>Arsip Sesi Sabtu Beli Teh Ceri ({ceriList.length})</span>
          <span>UPT SMPN 7 Pasuruan</span>
        </div>

        {ceriList.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada catatan Sabtu Beli Teh Ceri. Klik tombol &ldquo;Input Temuan Ceri&rdquo; di atas.
          </div>
        ) : (
          ceriList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    TC
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
                    className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-lg text-xs font-medium transition-colors"
                    title="Cetak Laporan Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeletingLabel(`catatan Teh Ceri tanggal ${item.hariTanggal}`);
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
                    Hasil Temuan 1 Minggu
                  </span>
                  <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {item.hasilTemuanSatuMinggu}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Evaluasi Kegiatan
                  </span>
                  <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {item.evaluasiKegiatan}
                  </p>
                </div>

                {item.rencanaInovasi && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                      Rencana Inovasi / Kegiatan
                    </span>
                    <p className="text-emerald-900 font-medium mt-0.5 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200">
                      {item.rencanaInovasi}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  {item.linkFoto && (
                    <a
                      href={item.linkFoto}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-700 hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
                    >
                      Dokumentasi Foto Kegiatan <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {item.keterangan && (
                    <span className="text-[11px] text-slate-500">
                      <strong>Keterangan:</strong> {item.keterangan}
                    </span>
                  )}
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
          judulDokumen="LAPORAN MINGGUAN SABTU BELI TEH CERI"
          tandaTanganUrl={printingRecord.tandaTanganUrl}
          namaPenandatangan="Eki Febriani, S.Pd"
          jabatanPenandatangan="Guru BK / Tim TPPK"
          nipPenandatangan="19940214 202221 2 014"
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
                  <td className="py-1.5 font-bold text-slate-700">Waktu Pelaksanaan</td>
                  <td className="py-1.5">: {printingRecord.waktu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Hasil Temuan 1 Minggu</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.hasilTemuanSatuMinggu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Evaluasi Kegiatan</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.evaluasiKegiatan}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Rencana Inovasi / Kegiatan</td>
                  <td className="py-1.5 align-top leading-relaxed">: {printingRecord.rencanaInovasi || '-'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Link Foto Kegiatan</td>
                  <td className="py-1.5">: {printingRecord.linkFoto || 'Terlampir dalam arsip digital'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-bold text-slate-700">Keterangan</td>
                  <td className="py-1.5">: {printingRecord.keterangan || '-'}</td>
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
            onDeleteCeri(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
