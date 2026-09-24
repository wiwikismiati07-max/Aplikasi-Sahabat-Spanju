import React, { useState } from 'react';
import {
  Handshake,
  Printer,
  Plus,
  Trash2,
  Edit,
  Layers,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';
import { SPDamaiRecord, SiswaMaster } from '../types';
import { CalendarDatePicker } from './DateTimeWidgets';
import { TouchSignaturePad } from './TouchSignaturePad';
import { StudentPickerModal } from './StudentPickerModal';
import { OfficialReportModal } from './OfficialReportModal';

interface SPDamaiViewProps {
  spDamaiList: SPDamaiRecord[];
  onAddSPDamai: (data: Omit<SPDamaiRecord, 'id' | 'createdAt'>) => void;
  onUpdateSPDamai: (id: string, data: Partial<SPDamaiRecord>) => void;
  onDeleteSPDamai: (id: string) => void;
  siswaList: SiswaMaster[];
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const SPDamaiView: React.FC<SPDamaiViewProps> = ({
  spDamaiList,
  onAddSPDamai,
  onUpdateSPDamai,
  onDeleteSPDamai,
  siswaList,
  onOpenMenu,
  isAdmin,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [nomorSurat, setNomorSurat] = useState('421.3/088/SP-DAMAI/423.107.07/2026');
  const [hariTanggal, setHariTanggal] = useState('Rabu, 23 September 2026');
  const [namaPihak1, setNamaPihak1] = useState('');
  const [kelasPihak1, setKelasPihak1] = useState('');
  const [namaPihak2, setNamaPihak2] = useState('');
  const [kelasPihak2, setKelasPihak2] = useState('');
  const [kesepakatan, setKesepakatan] = useState(
    '1. Kedua belah pihak menyadari kekeliruan dan sepakat menyelesaikan perselisihan secara kekeluargaan.\n' +
    '2. Pihak Pertama dan Pihak Kedua saling memaafkan dengan tulus tanpa ada unsur paksaan dari pihak mana pun.\n' +
    '3. Berjanji tidak akan mengulangi perbuatan yang merugikan orang lain dan senantiasa menjaga kerukunan di SMPN 7 Pasuruan.\n' +
    '4. Bersedia saling menghormati dan mendukung terciptanya lingkungan sekolah ramah anak yang aman dan nyaman.\n' +
    '5. Apabila di kemudian hari terulang, bersedia menerima sanksi pembinaan sesuai tata tertib sekolah yang berlaku.'
  );
  const [namaSaksi, setNamaSaksi] = useState('Wiwik Ismiati, S.Pd (Guru BK)');
  const [ttdPihak1, setTtdPihak1] = useState('');
  const [ttdPihak2, setTtdPihak2] = useState('');
  const [ttdSaksi, setTtdSaksi] = useState('');

  // Picker & Print Modals
  const [pickerTarget, setPickerTarget] = useState<'pihak1' | 'pihak2' | null>(null);
  const [printingRecord, setPrintingRecord] = useState<SPDamaiRecord | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setNomorSurat(`421.3/${String(spDamaiList.length + 1).padStart(3, '0')}/SP-DAMAI/423.107.07/2026`);
    setHariTanggal('Rabu, 23 September 2026');
    setNamaPihak1('');
    setKelasPihak1('');
    setNamaPihak2('');
    setKelasPihak2('');
    setKesepakatan(
      '1. Kedua belah pihak menyadari kekeliruan dan sepakat menyelesaikan perselisihan secara kekeluargaan.\n' +
      '2. Pihak Pertama dan Pihak Kedua saling memaafkan dengan tulus tanpa ada unsur paksaan dari pihak mana pun.\n' +
      '3. Berjanji tidak akan mengulangi perbuatan yang merugikan orang lain dan senantiasa menjaga kerukunan di SMPN 7 Pasuruan.\n' +
      '4. Bersedia saling menghormati dan mendukung terciptanya lingkungan sekolah ramah anak yang aman dan nyaman.\n' +
      '5. Apabila di kemudian hari terulang, bersedia menerima sanksi pembinaan sesuai tata tertib sekolah yang berlaku.'
    );
    setNamaSaksi('Wiwik Ismiati, S.Pd (Guru BK)');
    setTtdPihak1('');
    setTtdPihak2('');
    setTtdSaksi('');
    setIsFormOpen(false);
  };

  const handleEditClick = (record: SPDamaiRecord) => {
    setEditingId(record.id);
    setNomorSurat(record.nomorSurat || '');
    setHariTanggal(record.hariTanggal || '');
    setNamaPihak1(record.namaPihak1 || '');
    setKelasPihak1(record.kelasPihak1 || '');
    setNamaPihak2(record.namaPihak2 || '');
    setKelasPihak2(record.kelasPihak2 || '');
    setKesepakatan(record.kesepakatan || (record.butirKesepakatan ? record.butirKesepakatan.join('\n') : ''));
    setNamaSaksi(record.namaSaksi || '');
    setTtdPihak1(record.ttdPihak1 || '');
    setTtdPihak2(record.ttdPihak2 || '');
    setTtdSaksi(record.ttdSaksi || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPihak1 || !namaPihak2) {
      alert('Mohon lengkapi identitas Pihak I dan Pihak II.');
      return;
    }

    if (editingId) {
      onUpdateSPDamai(editingId, {
        nomorSurat,
        hariTanggal,
        namaPihak1,
        kelasPihak1,
        namaPihak2,
        kelasPihak2,
        kesepakatan,
        namaSaksi,
        ttdPihak1,
        ttdPihak2,
        ttdSaksi,
      });
    } else {
      onAddSPDamai({
        nomorSurat,
        hariTanggal,
        namaPihak1,
        kelasPihak1,
        namaPihak2,
        kelasPihak2,
        kesepakatan,
        namaSaksi,
        ttdPihak1,
        ttdPihak2,
        ttdSaksi,
        namaKepalaSekolah: 'NUR FADILAH, S.Pd., M.Pd',
        nipKepalaSekolah: '19860410 201001 2 030',
      });
    }
    resetForm();
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <Handshake className="w-8 h-8 text-cyan-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Restorative Justice Kekeluargaan
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Surat Kesepakatan Damai Siswa (SP Damai)
            </h1>
            <p className="text-xs text-cyan-100 max-w-xl">
              Mediasi perselisihan dengan pendekatan pemulihan hubungan kekeluargaan, saling memaafkan, dan tanda tangan digital para pihak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-cyan-900 hover:bg-cyan-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-700" />
            <span>Buat SP Damai Baru</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-cyan-600 to-teal-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingId ? 'Edit Surat Kesepakatan Damai' : 'Pembuatan Surat Kesepakatan Damai (Restorative Justice)'}
                </h3>
                <p className="text-xs text-cyan-100 mt-0.5">
                  Musyawarah mufakat demi keharmonisan siswa UPT SMPN 7 Pasuruan
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
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor Surat Resmi
                  </label>
                  <input
                    type="text"
                    required
                    value={nomorSurat}
                    onChange={(e) => setNomorSurat(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-800"
                  />
                </div>

                <CalendarDatePicker
                  value={hariTanggal}
                  onChange={setHariTanggal}
                  label="Hari / Tanggal Kesepakatan"
                />
              </div>

              {/* Dual Party Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pihak Pertama */}
                <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-cyan-900 uppercase">
                      Pihak Pertama (Siswa I)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerTarget('pihak1')}
                      className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 bg-white border border-cyan-300 px-2 py-0.5 rounded-lg shadow-2xs"
                    >
                      Pilih Siswa
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={namaPihak1}
                      onChange={(e) => setNamaPihak1(e.target.value)}
                      placeholder="Nama Siswa..."
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-cyan-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Kelas</label>
                    <input
                      type="text"
                      value={kelasPihak1}
                      onChange={(e) => setKelasPihak1(e.target.value)}
                      placeholder="Contoh: 8A"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-cyan-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                {/* Pihak Kedua */}
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-900 uppercase">
                      Pihak Kedua (Siswa II)
                    </span>
                    <button
                      type="button"
                      onClick={() => setPickerTarget('pihak2')}
                      className="text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-white border border-teal-300 px-2 py-0.5 rounded-lg shadow-2xs"
                    >
                      Pilih Siswa
                    </button>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={namaPihak2}
                      onChange={(e) => setNamaPihak2(e.target.value)}
                      placeholder="Nama Siswa..."
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Kelas</label>
                    <input
                      type="text"
                      value={kelasPihak2}
                      onChange={(e) => setKelasPihak2(e.target.value)}
                      placeholder="Contoh: 8B"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Isi Kesepakatan Damai */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Isi Butir-Butir Kesepakatan Damai
                </label>
                <textarea
                  rows={5}
                  required
                  value={kesepakatan}
                  onChange={(e) => setKesepakatan(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 text-slate-800 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Saksi / Guru Pendamping
                </label>
                <input
                  type="text"
                  value={namaSaksi}
                  onChange={(e) => setNamaSaksi(e.target.value)}
                  placeholder="Wiwik Ismiati, S.Pd (Guru BK / TPPK)"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 text-slate-800"
                />
              </div>

              {/* Tanda Tangan Para Pihak (Siswa I, Siswa II, Saksi) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Tanda Tangan Digital Para Pihak:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TouchSignaturePad
                    label="Tanda Tangan Pihak I"
                    initialSignature={ttdPihak1}
                    onSave={setTtdPihak1}
                    onClear={() => setTtdPihak1('')}
                  />
                  <TouchSignaturePad
                    label="Tanda Tangan Pihak II"
                    initialSignature={ttdPihak2}
                    onSave={setTtdPihak2}
                    onClear={() => setTtdPihak2('')}
                  />
                  <TouchSignaturePad
                    label="Tanda Tangan Saksi / Guru BK"
                    initialSignature={ttdSaksi}
                    onSave={setTtdSaksi}
                    onClear={() => setTtdSaksi('')}
                  />
                </div>
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
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Perbarui Surat Damai' : 'Simpan Surat Damai'}
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
        title={pickerTarget === 'pihak1' ? 'Pilih Pihak I (Siswa)' : 'Pilih Pihak II (Siswa)'}
        onSelect={(s) => {
          if (pickerTarget === 'pihak1') {
            setNamaPihak1(s.nama);
            setKelasPihak1(s.kelas);
          } else if (pickerTarget === 'pihak2') {
            setNamaPihak2(s.nama);
            setKelasPihak2(s.kelas);
          }
        }}
      />

      {/* Records List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
          <span>Arsip Kesepakatan Damai ({spDamaiList.length})</span>
          <span>UPT SMPN 7 Pasuruan</span>
        </div>

        {spDamaiList.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            Belum ada arsip surat kesepakatan damai. Klik tombol &ldquo;Buat SP Damai Baru&rdquo; di atas.
          </div>
        ) : (
          spDamaiList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    RJ
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{item.nomorSurat}</h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Tanggal: {item.hariTanggal}
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
                    className="p-1.5 bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 rounded-lg text-xs font-medium transition-colors"
                    title="Cetak Berkas Resmi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus surat kesepakatan damai nomor ${item.nomorSurat}?`)) {
                          onDeleteSPDamai(item.id);
                        }
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-lg text-xs font-medium transition-colors"
                      title="Hapus Dokumen"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-cyan-800 block">
                    Pihak Pertama
                  </span>
                  <span className="font-bold text-slate-900">{item.namaPihak1}</span>
                  <span className="text-cyan-700 block">Kelas {item.kelasPihak1}</span>
                </div>

                <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-teal-800 block">
                    Pihak Kedua
                  </span>
                  <span className="font-bold text-slate-900">{item.namaPihak2}</span>
                  <span className="text-teal-700 block">Kelas {item.kelasPihak2}</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Isi Kesepakatan Damai
                  </span>
                  <p className="text-slate-700 whitespace-pre-line mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-mono text-[11px]">
                    {item.kesepakatan}
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
          judulDokumen="SURAT KESEPAKATAN DAMAI SISWA (RESTORATIVE JUSTICE)"
          tandaTanganUrl={printingRecord.ttdSaksi}
          namaPenandatangan="WIWIK ISMIATI, S.Pd"
          jabatanPenandatangan="Koordinator TPPK / Guru BK"
          nipPenandatangan="19831116 200904 2 003"
          namaKepalaSekolah="NUR FADILAH, S.Pd., M.Pd"
          nipKepalaSekolah="19860410 201001 2 030"
          tanggalDokumen={`Pasuruan, ${printingRecord.hariTanggal.split(',')[1] || printingRecord.hariTanggal}`}
        >
          <div className="space-y-4 text-xs">
            <div className="text-center font-mono text-[11px] text-slate-600">
              Nomor: {printingRecord.nomorSurat}
            </div>

            <p className="leading-relaxed">
              Pada hari ini, <strong>{printingRecord.hariTanggal}</strong>, bertempat di Ruang Bimbingan Konseling UPT SMP Negeri 7 Pasuruan, telah dilakukan musyawarah mediasi kekeluargaan (Restorative Justice) antara pihak-pihak sebagai berikut:
            </p>

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="w-28 font-bold py-1">1. Nama</td>
                  <td className="py-1">: <strong>{printingRecord.namaPihak1}</strong></td>
                </tr>
                <tr>
                  <td className="font-bold py-1">Kelas</td>
                  <td className="py-1">: Kelas {printingRecord.kelasPihak1} (Selanjutnya disebut sebagai <strong>PIHAK PERTAMA</strong>)</td>
                </tr>
                <tr>
                  <td className="font-bold py-1 pt-2">2. Nama</td>
                  <td className="py-1 pt-2">: <strong>{printingRecord.namaPihak2}</strong></td>
                </tr>
                <tr>
                  <td className="font-bold py-1">Kelas</td>
                  <td className="py-1">: Kelas {printingRecord.kelasPihak2} (Selanjutnya disebut sebagai <strong>PIHAK KEDUA</strong>)</td>
                </tr>
              </tbody>
            </table>

            <p className="leading-relaxed">
              Dengan disaksikan oleh Tim Satgas TPPK / Guru Bimbingan Konseling, kedua belah pihak telah sepakat dan berjanji untuk:
            </p>

            <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg whitespace-pre-line leading-relaxed font-mono text-[11px]">
              {printingRecord.kesepakatan}
            </div>

            <p className="leading-relaxed">
              Demikian surat kesepakatan damai ini dibuat dan ditandatangani bersama dalam keadaan sadar dan sehat tanpa ada paksaan dari pihak mana pun untuk ditaati bersama.
            </p>

            {/* Tri-Signature Box in print */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center text-[10px]">
              <div>
                <p className="font-bold">Pihak Pertama,</p>
                <div className="h-16 flex items-center justify-center">
                  {printingRecord.ttdPihak1 ? (
                    <img src={printingRecord.ttdPihak1} alt="TTD Pihak I" className="max-h-12" />
                  ) : (
                    <div className="text-slate-300 italic">(Ttd)</div>
                  )}
                </div>
                <p className="font-bold underline">{printingRecord.namaPihak1}</p>
              </div>

              <div>
                <p className="font-bold">Pihak Kedua,</p>
                <div className="h-16 flex items-center justify-center">
                  {printingRecord.ttdPihak2 ? (
                    <img src={printingRecord.ttdPihak2} alt="TTD Pihak II" className="max-h-12" />
                  ) : (
                    <div className="text-slate-300 italic">(Ttd)</div>
                  )}
                </div>
                <p className="font-bold underline">{printingRecord.namaPihak2}</p>
              </div>

              <div>
                <p className="font-bold">Saksi / Guru BK,</p>
                <div className="h-16 flex items-center justify-center">
                  {printingRecord.ttdSaksi ? (
                    <img src={printingRecord.ttdSaksi} alt="TTD Saksi" className="max-h-12" />
                  ) : (
                    <div className="text-slate-300 italic">(Ttd)</div>
                  )}
                </div>
                <p className="font-bold underline">{printingRecord.namaSaksi || 'WIWIK ISMIATI, S.Pd'}</p>
              </div>
            </div>
          </div>
        </OfficialReportModal>
      )}
    </div>
  );
};
