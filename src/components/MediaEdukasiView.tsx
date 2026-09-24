import React, { useState } from 'react';
import {
  Film,
  ExternalLink,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  BookOpen,
  Video,
  FileText,
  X,
  Search,
} from 'lucide-react';
import { MediaEdukasiItem } from '../types';

interface MediaEdukasiViewProps {
  mediaList: MediaEdukasiItem[];
  onAddMedia: (data: Omit<MediaEdukasiItem, 'id'>) => void;
  onDeleteMedia: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

export const MediaEdukasiView: React.FC<MediaEdukasiViewProps> = ({
  mediaList,
  onAddMedia,
  onDeleteMedia,
  onOpenMenu,
  isAdmin,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  // Form
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [url, setUrl] = useState('');
  const [kategori, setKategori] = useState<MediaEdukasiItem['kategori']>('Video');
  const [durasi, setDurasi] = useState('');

  const filteredMedia = mediaList.filter((m) => {
    const matchKat = selectedKategori === 'Semua' || m.kategori === selectedKategori;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.deskripsi ? m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    return matchKat && matchSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !url) {
      alert('Mohon isi judul dan link media edukasi.');
      return;
    }

    onAddMedia({
      judul,
      deskripsi,
      url,
      kategori,
      durasi: durasi || undefined,
    });

    setJudul('');
    setDeskripsi('');
    setUrl('');
    setKategori('Video');
    setDurasi('');
    setIsFormOpen(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center flex-shrink-0 shadow-inner">
            <Film className="w-8 h-8 text-violet-200" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/30 text-violet-100 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Perpustakaan Digital Anti-Perundungan
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Media Edukasi Digital Sahabat SPANJU
            </h1>
            <p className="text-xs text-violet-100 max-w-xl">
              Kumpulan video edukasi, modul anti-bullying, regulasi Permendikbudristek No. 46/2023, dan infografis karakter ramah anak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Layers className="w-4 h-4 text-violet-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-violet-900 hover:bg-violet-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-violet-700" />
              <span>Tambah Materi Edukasi</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Video', 'Modul', 'Infografis', 'Regulasi'].map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => setSelectedKategori(kat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedKategori === kat
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi, modul, video..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
          />
        </div>
      </div>

      {/* Add Media Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">Tambah Materi Edukasi Digital</h3>
                <p className="text-xs text-violet-100 mt-0.5">
                  Tautan YouTube, Google Drive, Canva, atau website resmi
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Materi Edukasi
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Video Edukasi: Kenali dan Cegah Cyberbullying"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) =>
                      setKategori(e.target.value as MediaEdukasiItem['kategori'])
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
                  >
                    <option value="Video">Video Edukasi</option>
                    <option value="Modul">Modul / Buku Panduan</option>
                    <option value="Infografis">Infografis / Poster</option>
                    <option value="Regulasi">Regulasi &amp; SOP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Durasi / Jumlah Halaman
                  </label>
                  <input
                    type="text"
                    value={durasi}
                    onChange={(e) => setDurasi(e.target.value)}
                    placeholder="Contoh: 12 Menit / 30 Halaman"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL / Tautan Materi
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/... atau https://drive.google.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Deskripsi Ringkas
                </label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Rangkuman isi materi edukasi..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((m) => {
          const Icon =
            m.kategori === 'Video'
              ? Video
              : m.kategori === 'Modul'
              ? BookOpen
              : FileText;

          return (
            <div
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                    {m.kategori} {m.durasi ? `• ${m.durasi}` : ''}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors leading-snug">
                  {m.judul}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {m.deskripsi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={m.url || m.dokumentasiMateriUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
                >
                  <span>Buka Materi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Hapus media edukasi "${m.judul}"?`)) {
                        onDeleteMedia(m.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    title="Hapus Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
