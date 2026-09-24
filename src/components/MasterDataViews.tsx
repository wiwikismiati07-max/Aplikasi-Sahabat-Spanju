import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Users2,
  GraduationCap,
  Plus,
  Trash2,
  Download,
  Upload,
  Search,
  Layers,
  Sparkles,
  X,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { SiswaMaster, GuruMaster } from '../types';

/* ====================================================================
 * MASTER DATA SISWA VIEW
 * ==================================================================== */
interface MasterSiswaViewProps {
  siswaList: SiswaMaster[];
  onAddSiswa: (siswa: SiswaMaster) => void;
  onImportBulkSiswa: (list: SiswaMaster[], replaceAll?: boolean) => void;
  onClearAllSiswa?: () => void;
  onDeleteSiswa: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const MasterSiswaView: React.FC<MasterSiswaViewProps> = ({
  siswaList,
  onAddSiswa,
  onImportBulkSiswa,
  onClearAllSiswa,
  onDeleteSiswa,
  onOpenMenu,
  isAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingImportList, setPendingImportList] = useState<SiswaMaster[] | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [nisn, setNisn] = useState('');
  const [kelas, setKelas] = useState('7A');
  const [jenisKelamin, setJenisKelamin] = useState<'L' | 'P'>('L');

  // Excel template export
  const downloadTemplateSiswa = () => {
    const ws = XLSX.utils.json_to_sheet([
      { NISN: '0098765432', Nama: 'Ahmad Faiz Pratama', Kelas: '7A', 'Jenis Kelamin': 'L' },
      { NISN: '0098765433', Nama: 'Aisyah Putri Azzahra', Kelas: '7A', 'Jenis Kelamin': 'P' },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Siswa_SPANJU');
    XLSX.writeFile(wb, 'Template_Master_Siswa_SMPN7_Pasuruan.xlsx');
  };

  // Excel bulk import handler
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        const parsed: SiswaMaster[] = rawData.map((row, idx) => ({
          id: String(Date.now() + idx),
          nisn: String(row.NISN || row.nisn || `009${idx}`),
          nama: String(row.Nama || row.nama || row['Nama Siswa'] || 'Siswa Baru'),
          kelas: String(row.Kelas || row.kelas || '7A').toUpperCase().replace(/\s+/g, ''),
          jenisKelamin: String(row['Jenis Kelamin'] || row.jenisKelamin || 'L').toUpperCase().startsWith('P') ? 'P' : 'L',
        }));

        if (parsed.length > 0) {
          setPendingImportList(parsed);
        } else {
          alert('File Excel kosong atau format kolom tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca file Excel. Pastikan format kolom sesuai dengan template.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const executeImport = (replaceAll: boolean) => {
    if (!pendingImportList) return;
    onImportBulkSiswa(pendingImportList, replaceAll);
    const count = pendingImportList.length;
    setPendingImportList(null);
    alert(
      replaceAll
        ? `Berhasil Menindas & Mengganti seluruh data lama dengan ${count} data siswa baru!`
        : `Berhasil menambahkan ${count} data siswa ke database!`
    );
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    onAddSiswa({
      id: String(Date.now()),
      nama: nama.trim(),
      nisn: nisn.trim() || undefined,
      kelas,
      jenisKelamin,
    });

    setNama('');
    setNisn('');
    setIsAddModalOpen(false);
  };

  const filtered = siswaList.filter((s) => {
    const matchKelas = selectedKelas === 'Semua' || s.kelas === selectedKelas;
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nisn && s.nisn.includes(searchQuery)) ||
      s.kelas.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <Users2 className="w-8 h-8 text-emerald-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Database Siswa 24 Rombel
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Master Data Siswa SPANJU
            </h1>
            <p className="text-xs text-emerald-100 max-w-xl">
              Pusat data siswa UPT SMPN 7 Pasuruan terhubung otomatis ke database Supabase &amp; seluruh fitur: Piket Harian, SP Damai, E-Lapor, dan Duta Anti-Bullying.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-200" />
            <span>Pilihan Menu</span>
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={downloadTemplateSiswa}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                title="Download Template Excel"
              >
                <Download className="w-4 h-4" />
                <span>Template</span>
              </button>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-4 h-4" />
                <span>Impor Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelImport}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>Tambah Siswa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search & Tindas Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500">Kelas:</span>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="text-xs font-bold bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700"
          >
            <option value="Semua">Semua 24 Rombel</option>
            {['7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H',
              '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
              '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H'].map((k) => (
              <option key={k} value={k}>
                Kelas {k}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, NISN, atau kelas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800"
            />
          </div>
          {isAdmin && onClearAllSiswa && siswaList.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin MENGOSONGKAN / MENINDAS SEMUA DATA SISWA saat ini?')) {
                  onClearAllSiswa();
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors whitespace-nowrap cursor-pointer"
              title="Kosongkan seluruh data siswa"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Kosongkan Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Siswa Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Daftar Siswa Terdaftar ({filtered.length} dari {siswaList.length} total)
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
            Supabase Synced 2026/2027
          </span>
        </div>

        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">No</th>
                <th className="py-2.5 px-4">Nama Lengkap</th>
                <th className="py-2.5 px-4">Kelas</th>
                <th className="py-2.5 px-4">L/P</th>
                <th className="py-2.5 px-4">NISN</th>
                {isAdmin && <th className="py-2.5 px-4 w-16 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data siswa. Gunakan tombol &ldquo;Impor Excel&rdquo; atau &ldquo;Tambah Siswa&rdquo;.
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{s.nama}</td>
                    <td className="py-2.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        {s.kelas}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] ${
                          s.jenisKelamin === 'L'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{s.nisn || '-'}</td>
                    {isAdmin && (
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus data siswa "${s.nama}"?`)) {
                              onDeleteSiswa(s.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Import (TINDAS vs APPEND) */}
      {pendingImportList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 space-y-5">
            <div className="flex items-center gap-3 text-emerald-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Konfirmasi Impor Data Siswa</h3>
                <p className="text-xs text-slate-500">Ditemukan {pendingImportList.length} data siswa dari file Excel</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Pilihan Mode Penyimpanan:
              </div>
              <p className="leading-relaxed">
                Pilih opsi di bawah untuk menentukan bagaimana data baru disimpan ke database:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => executeImport(true)}
                className="p-4 rounded-2xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-emerald-900 text-sm">TINDAS DATA LAMA</span>
                  <RefreshCw className="w-4 h-4 text-emerald-700 group-hover:rotate-180 transition-transform" />
                </div>
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Ganti seluruh data siswa lama dengan {pendingImportList.length} data baru yang baru diimpor.
                </p>
              </button>

              <button
                type="button"
                onClick={() => executeImport(false)}
                className="p-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-sm">GABUNGKAN (APPEND)</span>
                  <Plus className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Tambahkan {pendingImportList.length} data baru ke dalam daftar yang sudah ada tanpa menghapus.
                </p>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPendingImportList(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Tambah Siswa Manual</h3>
                <p className="text-xs text-emerald-100 mt-0.5">Input data siswa baru ke dalam rombel</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Muhammad Rizky Pratama"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NISN (Opsional)
                </label>
                <input
                  type="text"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="Contoh: 0098765432"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kelas / Rombel
                  </label>
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-bold"
                  >
                    {['7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H',
                      '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
                      '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H'].map((k) => (
                      <option key={k} value={k}>
                        Kelas {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={jenisKelamin}
                    onChange={(e) => setJenisKelamin(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-semibold"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ====================================================================
 * MASTER DATA GURU VIEW
 * ==================================================================== */
interface MasterGuruViewProps {
  guruList: GuruMaster[];
  onAddGuru: (guru: GuruMaster) => void;
  onImportBulkGuru: (list: GuruMaster[], replaceAll?: boolean) => void;
  onClearAllGuru?: () => void;
  onDeleteGuru: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const MasterGuruView: React.FC<MasterGuruViewProps> = ({
  guruList,
  onAddGuru,
  onImportBulkGuru,
  onClearAllGuru,
  onDeleteGuru,
  onOpenMenu,
  isAdmin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [pendingImportList, setPendingImportList] = useState<GuruMaster[] | null>(null);

  // Form states
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('Guru Mata Pelajaran');
  const [statusKepegawaian, setStatusKepegawaian] = useState('PNS');

  // Excel template export
  const downloadTemplateGuru = () => {
    const ws = XLSX.utils.json_to_sheet([
      { NIP: '19831116 200904 2 003', Nama: 'WIWIK ISMIATI, S.Pd', Jabatan: 'Koordinator TPPK / Guru BK', Status: 'PNS' },
      { NIP: '19860410 201001 2 030', Nama: 'NUR FADILAH, S.Pd., M.Pd', Jabatan: 'Kepala Sekolah', Status: 'PNS' },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Guru_SPANJU');
    XLSX.writeFile(wb, 'Template_Master_Guru_SMPN7_Pasuruan.xlsx');
  };

  // Excel bulk import
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        const parsed: GuruMaster[] = rawData.map((row, idx) => ({
          id: String(Date.now() + idx),
          nip: String(row.NIP || row.nip || '-'),
          nama: String(row.Nama || row.nama || row['Nama Guru'] || 'Guru Baru'),
          jabatan: String(row.Jabatan || row.jabatan || 'Guru Mata Pelajaran'),
          status: String(row.Status || row.status || 'PNS'),
          statusKepegawaian: String(row.Status || row.status || 'PNS'),
        }));

        if (parsed.length > 0) {
          setPendingImportList(parsed);
        } else {
          alert('File Excel kosong atau format kolom tidak sesuai.');
        }
      } catch (err) {
        alert('Gagal membaca file Excel. Pastikan format kolom sesuai dengan template.');
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = '';
  };

  const executeImport = (replaceAll: boolean) => {
    if (!pendingImportList) return;
    onImportBulkGuru(pendingImportList, replaceAll);
    const count = pendingImportList.length;
    setPendingImportList(null);
    alert(
      replaceAll
        ? `Berhasil Menindas & Mengganti seluruh data guru lama dengan ${count} data guru baru!`
        : `Berhasil menambahkan ${count} data guru ke database!`
    );
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    onAddGuru({
      id: String(Date.now()),
      nama: nama.trim(),
      nip: nip.trim() || undefined,
      jabatan,
      status: statusKepegawaian,
      statusKepegawaian,
    });

    setNama('');
    setNip('');
    setIsAddModalOpen(false);
  };

  const filtered = guruList.filter(
    (g) =>
      g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.nip && g.nip.includes(searchQuery))
  );

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-blue-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <GraduationCap className="w-8 h-8 text-blue-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Pendidik &amp; Tenaga Kependidikan
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Master Data Guru &amp; Satgas SPANJU
            </h1>
            <p className="text-xs text-blue-100 max-w-xl">
              Data resmi guru pengajar, wali kelas 24 rombel, tim konseling BK, dan Satgas TPPK UPT SMPN 7 Pasuruan terhubung ke Supabase.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-blue-200" />
            <span>Pilihan Menu</span>
          </button>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={downloadTemplateGuru}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                title="Download Template Excel"
              >
                <Download className="w-4 h-4" />
                <span>Template</span>
              </button>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors">
                <Upload className="w-4 h-4" />
                <span>Impor Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelImport}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-blue-700" />
                <span>Tambah Guru</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search & Tindas Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        {isAdmin && onClearAllGuru && guruList.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin MENGOSONGKAN / MENINDAS SEMUA DATA GURU & SATGAS saat ini?')) {
                onClearAllGuru();
              }
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors whitespace-nowrap cursor-pointer"
            title="Kosongkan seluruh data guru"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Kosongkan Data</span>
          </button>
        )}
      </div>

      {/* Guru Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Daftar Guru &amp; Tenaga Pendidik ({filtered.length} dari {guruList.length} total)
          </h3>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
            Supabase Synced TPPK
          </span>
        </div>

        <div className="overflow-x-auto max-h-[480px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">No</th>
                <th className="py-2.5 px-4">Nama Lengkap &amp; Gelar</th>
                <th className="py-2.5 px-4">NIP</th>
                <th className="py-2.5 px-4">Jabatan / Peran</th>
                <th className="py-2.5 px-4">Status</th>
                {isAdmin && <th className="py-2.5 px-4 w-16 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada data guru. Gunakan tombol &ldquo;Impor Excel&rdquo; atau &ldquo;Tambah Guru&rdquo;.
                  </td>
                </tr>
              ) : (
                filtered.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 text-center text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{g.nama}</td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{g.nip || '-'}</td>
                    <td className="py-2.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                        {g.jabatan}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{g.statusKepegawaian || g.status || 'PNS'}</td>
                    {isAdmin && (
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus data guru "${g.nama}"?`)) {
                              onDeleteGuru(g.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Import (TINDAS vs APPEND) */}
      {pendingImportList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 space-y-5">
            <div className="flex items-center gap-3 text-blue-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Konfirmasi Impor Data Guru &amp; Satgas</h3>
                <p className="text-xs text-slate-500">Ditemukan {pendingImportList.length} data guru dari file Excel</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Pilihan Mode Penyimpanan:
              </div>
              <p className="leading-relaxed">
                Pilih opsi di bawah untuk menentukan bagaimana data baru disimpan ke database:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => executeImport(true)}
                className="p-4 rounded-2xl border-2 border-blue-600 bg-blue-50 hover:bg-blue-100 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-blue-900 text-sm">TINDAS DATA LAMA</span>
                  <RefreshCw className="w-4 h-4 text-blue-700 group-hover:rotate-180 transition-transform" />
                </div>
                <p className="text-[11px] text-blue-800 leading-tight">
                  Ganti seluruh data guru lama dengan {pendingImportList.length} data baru yang baru diimpor.
                </p>
              </button>

              <button
                type="button"
                onClick={() => executeImport(false)}
                className="p-4 rounded-2xl border border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-sm">GABUNGKAN (APPEND)</span>
                  <Plus className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-[11px] text-slate-600 leading-tight">
                  Tambahkan {pendingImportList.length} data baru ke dalam daftar yang sudah ada tanpa menghapus.
                </p>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setPendingImportList(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-blue-800 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Tambah Guru / Staf Baru</h3>
                <p className="text-xs text-blue-100 mt-0.5">Input manual ke dalam master data</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualAdd} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Lengkap &amp; Gelar
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Dra. Hj. Sri Wahyuni, M.Pd"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  NIP (Opsional / Kosongkan jika Non-ASN)
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Contoh: 19850612 201101 2 015"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jabatan / Peran
                  </label>
                  <input
                    type="text"
                    required
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Wali Kelas / Guru BK"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={statusKepegawaian}
                    onChange={(e) => setStatusKepegawaian(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT / Honor">GTT / Honor</option>
                    <option value="Tendik">Tendik</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
