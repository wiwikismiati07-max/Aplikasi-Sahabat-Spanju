import React, { useState, useEffect } from 'react';
import { X, Search, UserCheck, Check, Users, CheckSquare, RotateCcw } from 'lucide-react';
import { SiswaMaster } from '../types';
import { INITIAL_SISWA } from '../data/initialData';

interface StudentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (siswa: SiswaMaster) => void;
  onSelectMultiple?: (siswaList: SiswaMaster[]) => void;
  initialSelectedIds?: string[];
  multiSelect?: boolean;
  siswaList?: SiswaMaster[];
  title?: string;
  defaultClassFilter?: string;
}

export const StudentPickerModal: React.FC<StudentPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  onSelectMultiple,
  initialSelectedIds = [],
  multiSelect = false,
  siswaList = [],
  title = 'Pilih Siswa dari Master Data',
  defaultClassFilter = '',
}) => {
  const [selectedClass, setSelectedClass] = useState<string>(defaultClassFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const isMulti = multiSelect || Boolean(onSelectMultiple);

  useEffect(() => {
    if (isOpen) {
      setSelectedClass(defaultClassFilter);
      setSelectedIds(initialSelectedIds);
    }
  }, [isOpen, defaultClassFilter, JSON.stringify(initialSelectedIds)]);

  if (!isOpen) return null;

  const rawList = siswaList && siswaList.length > 0 ? siswaList : INITIAL_SISWA;
  const effectiveSiswaList = rawList.map((s, idx) => {
    const rawName = s.nama || (s as any).namaLengkap || (s as any)['Nama'] || (s as any)['Nama Siswa'] || (s as any)['nama'];
    const rawNis = s.nisn || (s as any)['NISN'] || (s as any)['nisn'] || `009${idx}`;
    const rawKelas = s.kelas || (s as any)['Kelas'] || (s as any)['kelas'] || '7A';
    const rawJk = s.jenisKelamin || (s as any).jeniskelamin || (s as any).jenis_kelamin || (s as any).jk || 'L';
    return {
      ...s,
      id: s.id || `s-gen-${idx}`,
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

  const toggleStudent = (siswa: SiswaMaster) => {
    if (!isMulti) {
      if (onSelect) onSelect(siswa);
      onClose();
      return;
    }

    if (selectedIds.includes(siswa.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== siswa.id));
    } else {
      setSelectedIds([...selectedIds, siswa.id]);
    }
  };

  const handleSelectAllInFiltered = () => {
    const filteredIds = filteredStudents.map((s) => s.id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      // Unselect filtered
      setSelectedIds(selectedIds.filter((id) => !filteredIds.includes(id)));
    } else {
      // Select filtered
      const newSet = new Set([...selectedIds, ...filteredIds]);
      setSelectedIds(Array.from(newSet));
    }
  };

  const handleConfirmMultiSelect = () => {
    const chosenObjects = effectiveSiswaList.filter((s) => selectedIds.includes(s.id));
    if (onSelectMultiple) {
      onSelectMultiple(chosenObjects);
    }
    if (onSelect && chosenObjects.length > 0) {
      onSelect(chosenObjects[0]);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white flex-shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-200" />
              {title}
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              {isMulti
                ? 'Pilih satu atau beberapa siswa dari kelas mana saja untuk anggota piket harian'
                : 'Pilih kelas dan klik nama siswa untuk mengisi formulir'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Class Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col gap-3 flex-shrink-0">
          {/* Search bar & Select All Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama siswa, NISN, atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
              />
            </div>
            {isMulti && filteredStudents.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllInFiltered}
                className="w-full sm:w-auto px-3 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pilih Semua {selectedClass && selectedClass !== 'Semua' ? `Kelas ${selectedClass}` : ''}</span>
              </button>
            )}
          </div>

          {/* Classes pill bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {classes.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls === 'Semua' ? '' : cls)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Selected Counter Banner (in multi-select mode) */}
        {isMulti && (
          <div className="px-4 py-2.5 bg-emerald-50/90 border-b border-emerald-200 flex items-center justify-between text-xs flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-emerald-900">
                {selectedIds.length} Siswa Terpilih
              </span>
              <span className="text-slate-500 hidden sm:inline">
                (Klik nama siswa untuk menambah / mengurangi)
              </span>
            </div>
            {selectedIds.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Hapus Semua Pilihan
              </button>
            )}
          </div>
        )}

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Tidak ada siswa yang sesuai dengan filter atau kata kunci.
            </div>
          ) : (
            filteredStudents.map((siswa) => {
              const isSelected = selectedIds.includes(siswa.id);
              return (
                <button
                  key={siswa.id}
                  type="button"
                  onClick={() => toggleStudent(siswa)}
                  className={`w-full p-3 text-left border rounded-2xl transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-300'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isMulti && (
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 bg-slate-100 group-hover:border-emerald-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-emerald-950 text-sm flex items-center gap-2">
                        <span>{siswa.nama}</span>
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-600 text-white">
                            Terpilih
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.2 rounded-md">
                          Kelas {siswa.kelas}
                        </span>
                        {siswa.nisn && <span>NISN: {siswa.nisn}</span>}
                        <span>&bull; JK: {siswa.jenisKelamin}</span>
                      </div>
                    </div>
                  </div>

                  {!isMulti && (
                    <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                      Pilih &rarr;
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer in Multi-Select Mode */}
        {isMulti && (
          <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="text-xs text-slate-600 font-medium text-center sm:text-left">
              Total <span className="font-bold text-emerald-700">{selectedIds.length} anggota</span> siap dimasukkan ke Laporan Piket.
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmMultiSelect}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan {selectedIds.length} Siswa Terpilih</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
