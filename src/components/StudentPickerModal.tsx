import React, { useState } from 'react';
import { X, Search, UserCheck } from 'lucide-react';
import { SiswaMaster } from '../types';
import { INITIAL_SISWA } from '../data/initialData';

interface StudentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (siswa: SiswaMaster) => void;
  siswaList?: SiswaMaster[];
  title?: string;
  defaultClassFilter?: string;
}

export const StudentPickerModal: React.FC<StudentPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  siswaList = [],
  title = 'Pilih Siswa dari Master Data',
  defaultClassFilter = '',
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(defaultClassFilter);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setSelectedClass(defaultClassFilter);
    }
  }, [isOpen, defaultClassFilter]);

  if (!isOpen) return null;

  const rawList = siswaList && siswaList.length > 0 ? siswaList : INITIAL_SISWA;
  const effectiveSiswaList = rawList.map((s, idx) => {
    const rawName = s.nama || (s as any).namaLengkap || (s as any)['Nama'] || (s as any)['Nama Siswa'] || (s as any)['nama'];
    const rawNis = s.nisn || (s as any)['NISN'] || (s as any)['nisn'] || `009${idx}`;
    const rawKelas = s.kelas || (s as any)['Kelas'] || (s as any)['kelas'] || '7A';
    const rawJk = s.jenisKelamin || (s as any).jeniskelamin || (s as any).jenis_kelamin || (s as any).jk || 'L';
    return {
      ...s,
      nama: rawName && String(rawName).trim() !== '' ? String(rawName).trim() : (INITIAL_SISWA[idx % INITIAL_SISWA.length]?.nama || `Siswa ${idx + 1}`),
      nisn: rawNis && String(rawNis).trim() !== '' ? String(rawNis).trim() : `009${idx}`,
      kelas: rawKelas && String(rawKelas).trim() !== '' ? String(rawKelas).trim() : '7A',
      jenisKelamin: String(rawJk).toUpperCase().startsWith('P') ? 'P' : 'L',
    };
  });

  const classes = [
    'Semua',
    '7A', '7B', '7C', '7D', '7E', '7F', '7G', '7H',
    '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H',
    '9A', '9B', '9C', '9D', '9E', '9F', '9G', '9H',
  ];

  const filteredStudents = effectiveSiswaList.filter((s) => {
    const matchClass = !selectedClass || selectedClass === 'Semua' || s.kelas === selectedClass;
    const matchQuery =
      (s.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.nisn ? s.nisn.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (s.kelas || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              {title}
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Pilih kelas dan klik nama siswa untuk mengisi formulir
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Class Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama siswa atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Classes pill bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {classes.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls === 'Semua' ? '' : cls)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  (cls === 'Semua' && !selectedClass) || selectedClass === cls
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">
              Tidak ada siswa yang sesuai dengan filter atau kata kunci.
            </div>
          ) : (
            filteredStudents.map((siswa) => (
              <button
                key={siswa.id}
                type="button"
                onClick={() => {
                  onSelect(siswa);
                  onClose();
                }}
                className="w-full p-3 text-left bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-emerald-900 text-sm">
                    {siswa.nama}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-medium text-emerald-700 bg-emerald-100/60 px-2 py-0.2 rounded">
                      Kelas {siswa.kelas}
                    </span>
                    {siswa.nisn && <span>NISN: {siswa.nisn}</span>}
                    <span>&bull; JK: {siswa.jenisKelamin}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                  Pilih &rarr;
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
