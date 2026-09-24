import React, { useState } from 'react';
import { X, Search, GraduationCap } from 'lucide-react';
import { GuruMaster } from '../types';

interface TeacherPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (guru: GuruMaster) => void;
  guruList: GuruMaster[];
  title?: string;
}

export const TeacherPickerModal: React.FC<TeacherPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  guruList,
  title = 'Pilih Guru dari Master Data',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTeachers = guruList.filter((g) => {
    return (
      g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.nip ? g.nip.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      g.jabatan.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              {title}
            </h3>
            <p className="text-xs text-blue-100 mt-0.5">
              Klik nama guru untuk memilih wali kelas atau penanggung jawab
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama guru, NIP, atau jabatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800"
            />
          </div>
        </div>

        {/* Teacher List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Tidak ada data guru yang ditemukan.
            </div>
          ) : (
            filteredTeachers.map((guru) => (
              <button
                key={guru.id}
                type="button"
                onClick={() => {
                  onSelect(guru);
                  onClose();
                }}
                className="w-full p-3 text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all flex items-center justify-between group shadow-2xs hover:shadow-xs"
              >
                <div>
                  <div className="font-bold text-slate-800 group-hover:text-blue-900 text-sm">
                    {guru.nama}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span className="font-mono font-medium text-slate-700">NIP. {guru.nip}</span>
                    <span className="mx-1">&bull;</span>
                    <span className="text-blue-700 font-medium">{guru.jabatan}</span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform">
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
