import React, { useState } from 'react';
import {
  Music2,
  Printer,
  Plus,
  Trash2,
  Edit,
  PenTool,
  Layers,
  Sparkles,
  X,
  Volume2,
  Quote,
} from 'lucide-react';
import { SerasiRecord } from '../types';
import {
  CalendarDatePicker,
  RealTimeTimePicker,
  getTodayIndoDate,
  getCurrentWibTime,
} from './DateTimeWidgets';
import { TouchSignaturePad } from './TouchSignaturePad';
import { OfficialReportModal } from './OfficialReportModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface SenandungSerasiViewProps {
  serasiList: SerasiRecord[];
  onAddSerasi: (data: Omit<SerasiRecord, 'id' | 'createdAt'>) => void;
  onUpdateSerasi: (id: string, data: Partial<SerasiRecord>) => void;
  onDeleteSerasi: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const SenandungSerasiView: React.FC<SenandungSerasiViewProps> = ({
  serasiList,
  onAddSerasi,
  onUpdateSerasi,
  onDeleteSerasi,
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
  const [isManualCategory, setIsManualCategory] = useState(false);
  const [kategoriLiterasi, setKategoriLiterasi] = useState('Karakter Ramah Kawan');
  const [pesanDisampaikan, setPesanDisampaikan] = useState('');
  const [penulis, setPenulis] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tandaTanganUrl, setTandaTanganUrl] = useState('');

  // Print Modal
  const [printingRecord, setPrintingRecord] = useState<SerasiRecord | null>(null);

  const defaultCategories = [
    'Karakter Ramah Kawan',
    'Motivasi Pagi & Empati',
    'Anti-Perundungan & Cyberbullying',
    'Literasi Nilai Pancasila',
    'Gotong Royong & Solidaritas',
    'Pantun Budi Pekerti',
  ];

  const resetForm = () => {
    setEditingId(null);
    setHariTanggal(getTodayIndoDate());
    setWaktu(getCurrentWibTime());
    setIsManualCategory(false);
    setKategoriLiterasi('Karakter Ramah Kawan');
    setPesanDisampaikan('');
    setPenulis('');
    setKeterangan('');
    setTandaTanganUrl('');
    setIsFormOpen(false);
  };

  const handleEditClick = (record: SerasiRecord) => {
    setEditingId(record.id);
    setHariTanggal(record.hariTanggal);
    setWaktu(record.waktu);
    setPesanDisampaikan(record.pesanDisampaikan);
    setPenulis(record.penulis);
    setKeterangan(record.keterangan);
    setTandaTanganUrl(record.tandaTanganUrl || '');

    if (defaultCategories.includes(record.kategoriLiterasi)) {
      setIsManualCategory(false);
      setKategoriLiterasi(record.kategoriLiterasi);
    } else {
      setIsManualCategory(true);
      setKategoriLiterasi(record.kategoriLiterasi);
    }

    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pesanDisampaikan.trim()) {
      alert('Mohon isi pesan yang disampaikan.');
      return;
    }

    if (editingId) {
      onUpdateSerasi(editingId, {
        hariTanggal,
        waktu,
        kategoriLiterasi,
        pesanDisampaikan,
        penulis: penulis || 'Duta Sahabat SPANJU',
        keterangan,
        tandaTanganUrl,
      });
    } else {
      onAddSerasi({
        hariTanggal,
        waktu,
        kategoriLiterasi,
        pesanDisampaikan,
        penulis: penulis || 'Duta Sahabat SPANJU',
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
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <Music2 className="w-8 h-8 text-indigo-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Salam Ramah &amp; Literasi Positif
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Senandung Serasi
            </h1>
            <p className="text-xs text-indigo-100 max-w-xl">
              Salam dan Pesan Mendukung Ramah dan Berliterasi: penyiaran pesan budi pekerti, kata mutiara sahabat, dan pembentukan karakter ramah kawan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-indigo-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-700" />
            <span>Siarkan Pesan Serasi</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Pesan Senandung Serasi' : 'Siarkan Pesan Senandung Serasi'}
                </h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Salam dan Pesan Mendukung Ramah dan Berliterasi
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
                  label="Hari / Tanggal Penyiaran"
                  isLocked={editingId !== null}
                />
                <RealTimeTimePicker
                  value={waktu}
                  onChange={setWaktu}
                  label="Waktu Penyiaran"
                  isLocked={editingId !== null}
                />
              </div>

              {/* Kategori Literasi: Dropdown + Opsi Isi Manual */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Kategori Literasi
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsManualCategory(!isManualCategory)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                  >
                    <PenTool className="w-3 h-3" />
                    {isManualCategory ? 'Pilih dari Daftar' : '✍️ Isi Manual (Ketik Sendiri)'}
                  </button>
                </div>

                {isManualCategory ? (
                  <input
                    type="text"
                    required
                    value={kategoriLiterasi}
                    onChange={(e) => setKategoriLiterasi(e.target.value)}
                    placeholder="Ketik kategori literasi bebas (contoh: Pantun Ramah Anak)..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                ) : (
                  <select
                    value={kategoriLiterasi}
                    onChange={(e) => {
                      if (e.target.value === '__MANUAL__') {
                        setIsManualCategory(true);
                        setKategoriLiterasi('');
                      } else {
                        setKategoriLiterasi(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  >
                    {defaultCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="__MANUAL__">✍️ Isi Manual (Ketik Sendiri)...</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pesan Yang Disampaikan
                </label>
                <textarea
                  rows={4}
                  required
                  value={pesanDisampaikan}
                  onChange={(e) => setPesanDisampaikan(e.target.value)}
                  placeholder="Ketikkan salam dan pesan literasi budi pekerti yang ingin disiarkan..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Penulis / Sumber Kutipan
                  </label>
                  <input
                    type="text"
                    value={penulis}
                    onChange={(e) => setPenulis(e.target.value)}
                    placeholder="Contoh: Duta Literasi Kelas 9A / Guru BK"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Keterangan Penyiaran
                  </label>
                  <input
                    type="text"
                    value={keterangan}
                    onChange={(e) => setKeterangan(e.target.value)}
                    placeholder="Contoh: Disiarkan saat pembiasaan pagi..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2">
                <TouchSignaturePad
                  label="Tanda Tangan Duta / Koordinator Literasi"
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
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Perbarui Pesan' : 'Simpan & Siarkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          <span>Kumpulan Pesan Senandung Serasi ({serasiList.length})</span>
          <span>UPT SMPN 7 Pasuruan</span>
        </div>

        {serasiList.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada siaran pesan literasi. Klik tombol &ldquo;Siarkan Pesan Serasi&rdquo; di atas.
          </div>
        ) : (
          serasiList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    SS
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.hariTanggal}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.kategoriLiterasi}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Pukul: {item.waktu}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleEditClick(item)}
                    className="p-1.5 bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-lg text-xs font-medium transition-colors"
                    title="Edit Pesan"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintingRecord(item)}
                    className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 rounded-lg text-xs font-medium transition-colors"
                    title="Cetak Laporan Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setDeletingId(item.id);
                        setDeletingLabel(`pesan Senandung Serasi tanggal ${item.hariTanggal}`);
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
                      title="Hapus Catatan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quote Box */}
              <div className="p-4 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 rounded-xl border border-indigo-100 text-slate-800 space-y-2">
                <Quote className="w-5 h-5 text-indigo-400" />
                <p className="text-xs font-serif italic leading-relaxed text-slate-800">
                  &ldquo;{item.pesanDisampaikan}&rdquo;
                </p>
                <div className="text-[11px] font-semibold text-indigo-900 text-right">
                  &mdash; {item.penulis || 'Duta Literasi SPANJU'}
                </div>
              </div>

              {item.keterangan && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{item.keterangan}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Official Print Modal without date in title */}
      {printingRecord && (
        <OfficialReportModal
          isOpen={!!printingRecord}
          onClose={() => setPrintingRecord(null)}
          judulDokumen="LEMBAR PUBLIKASI SENANDUNG SERASI"
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
                  <td className="py-1.5 font-bold w-44 text-slate-700">Hari / Tanggal Siaran</td>
                  <td className="py-1.5">: {printingRecord.hariTanggal}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Waktu Penyiaran</td>
                  <td className="py-1.5">: {printingRecord.waktu}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Kategori Literasi</td>
                  <td className="py-1.5">: {printingRecord.kategoriLiterasi}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700 align-top">Pesan Yang Disampaikan</td>
                  <td className="py-1.5 align-top font-serif italic leading-relaxed">
                    : &ldquo;{printingRecord.pesanDisampaikan}&rdquo;
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-1.5 font-bold text-slate-700">Penulis / Sumber</td>
                  <td className="py-1.5">: {printingRecord.penulis}</td>
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
            onDeleteSerasi(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
