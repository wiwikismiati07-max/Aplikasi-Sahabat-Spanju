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
  Edit,
  AlertTriangle,
  Copy,
  Check,
  Maximize2,
  RefreshCw,
  UploadCloud,
  HelpCircle,
  Link2,
  Lock,
} from 'lucide-react';
import { MediaEdukasiItem } from '../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { PERMANENT_GOOGLE_SITES_URL } from '../data/initialData';

interface MediaEdukasiViewProps {
  mediaList: MediaEdukasiItem[];
  onAddMedia: (data: Omit<MediaEdukasiItem, 'id'>) => void;
  onUpdateMedia?: (id: string, data: Partial<MediaEdukasiItem>) => void;
  onDeleteMedia: (id: string) => void;
  onOpenMenu: () => void;
  isAdmin: boolean;
}

// Check if a URL points to local harddisk (file:/// or C:\ or D:\)
export const isLocalFileUrl = (url?: string): boolean => {
  if (!url) return false;
  const lower = url.trim().toLowerCase();
  return lower.startsWith('file:') || /^[a-z]:[\\/]/i.test(lower);
};

// Normalize web URLs to have https:// if protocol is omitted
export const normalizeWebUrl = (url?: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (isLocalFileUrl(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

// Extract filename from file:/// URL for display
export const extractLocalFileName = (url?: string): string => {
  if (!url) return 'Dokumen';
  try {
    const decoded = decodeURIComponent(url);
    const parts = decoded.split(/[/\\]/);
    const name = parts[parts.length - 1];
    return name || decoded;
  } catch {
    return url;
  }
};

// Check if link can be embedded in iframe modal (Google Drive preview, YouTube embed, Flipbook)
export const getEmbedInfo = (url?: string) => {
  if (!url || isLocalFileUrl(url)) {
    return { canEmbed: false, embedUrl: '', type: 'none' as const };
  }
  const clean = normalizeWebUrl(url);

  // Google Drive file
  const gdriveFileMatch = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveFileMatch && gdriveFileMatch[1]) {
    return {
      canEmbed: true,
      embedUrl: `https://drive.google.com/file/d/${gdriveFileMatch[1]}/preview`,
      type: 'gdrive' as const,
    };
  }
  const gdriveIdMatch = clean.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (gdriveIdMatch && gdriveIdMatch[1]) {
    return {
      canEmbed: true,
      embedUrl: `https://drive.google.com/file/d/${gdriveIdMatch[1]}/preview`,
      type: 'gdrive' as const,
    };
  }

  // YouTube
  const ytMatch = clean.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch && ytMatch[1]) {
    return {
      canEmbed: true,
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`,
      type: 'youtube' as const,
    };
  }

  // Heyzine & FlipHTML5
  if (clean.includes('heyzine.com') || clean.includes('fliphtml5.com')) {
    return {
      canEmbed: true,
      embedUrl: clean,
      type: 'flipbook' as const,
    };
  }

  // Direct PDF files
  if (clean.toLowerCase().endsWith('.pdf')) {
    return {
      canEmbed: true,
      embedUrl: clean,
      type: 'pdf' as const,
    };
  }

  return {
    canEmbed: false,
    embedUrl: clean,
    type: 'web' as const,
  };
};

export const MediaEdukasiView: React.FC<MediaEdukasiViewProps> = ({
  mediaList,
  onAddMedia,
  onUpdateMedia,
  onDeleteMedia,
  onOpenMenu,
  isAdmin,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaEdukasiItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingLabel, setDeletingLabel] = useState<string>('');

  // Modals for viewer & local file resolution
  const [viewerMedia, setViewerMedia] = useState<{
    media: MediaEdukasiItem;
    embedUrl: string;
    type: 'gdrive' | 'youtube' | 'flipbook' | 'pdf' | 'web' | 'none';
  } | null>(null);

  const [selectedLocalFileMedia, setSelectedLocalFileMedia] = useState<MediaEdukasiItem | null>(null);
  const [replacementUrl, setReplacementUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPortalLink, setCopiedPortalLink] = useState(false);

  // Form Fields
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [url, setUrl] = useState('');
  const [kategori, setKategori] = useState<MediaEdukasiItem['kategori']>('Modul');
  const [durasi, setDurasi] = useState('');

  const filteredMedia = mediaList.filter((m) => {
    const matchKat = selectedKategori === 'Semua' || m.kategori === selectedKategori;
    const matchSearch =
      m.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.deskripsi ? m.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    return matchKat && matchSearch;
  });

  const handleOpenAddForm = () => {
    setEditingMedia(null);
    setJudul('');
    setDeskripsi('');
    setUrl('');
    setKategori('Modul');
    setDurasi('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (item: MediaEdukasiItem) => {
    setEditingMedia(item);
    setJudul(item.judul);
    setDeskripsi(item.deskripsi || '');
    setUrl(item.url || item.dokumentasiMateriUrl || '');
    setKategori(item.kategori || 'Modul');
    setDurasi(item.durasi || '');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !url) {
      alert('Mohon isi judul dan link materi edukasi.');
      return;
    }

    const cleanUrl = isLocalFileUrl(url) ? url.trim() : normalizeWebUrl(url);

    if (editingMedia && onUpdateMedia) {
      onUpdateMedia(editingMedia.id, {
        judul,
        deskripsi,
        url: cleanUrl,
        kategori,
        durasi: durasi || undefined,
      });
    } else {
      onAddMedia({
        judul,
        deskripsi,
        url: cleanUrl,
        kategori,
        durasi: durasi || undefined,
      });
    }

    setIsFormOpen(false);
    setEditingMedia(null);
  };

  // Smart Open Media Handler
  const handleOpenMedia = (media: MediaEdukasiItem) => {
    const targetUrl = media.url || media.dokumentasiMateriUrl || '';

    // Check if this is a local computer file (file:///...)
    if (isLocalFileUrl(targetUrl)) {
      setSelectedLocalFileMedia(media);
      setReplacementUrl('');
      return;
    }

    // Google Sites cannot be framed due to X-Frame-Options: SAMEORIGIN -> open directly in new tab
    if (targetUrl.includes('sites.google.com')) {
      const finalUrl = normalizeWebUrl(targetUrl);
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // Embeddable check
    const embedInfo = getEmbedInfo(targetUrl);
    if (embedInfo.canEmbed) {
      setViewerMedia({ media, embedUrl: embedInfo.embedUrl, type: embedInfo.type });
    } else {
      // Open in new tab
      const finalUrl = normalizeWebUrl(targetUrl);
      if (finalUrl) {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Quick fix for local file
  const handleSaveLocalFix = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocalFileMedia || !onUpdateMedia) return;

    if (!replacementUrl.trim()) {
      alert('Silakan masukkan tautan Google Drive atau web yang valid.');
      return;
    }

    const cleanUrl = normalizeWebUrl(replacementUrl);
    onUpdateMedia(selectedLocalFileMedia.id, { url: cleanUrl });
    const updatedMedia = { ...selectedLocalFileMedia, url: cleanUrl };
    setSelectedLocalFileMedia(null);

    // Open the new URL
    const embedInfo = getEmbedInfo(cleanUrl);
    if (embedInfo.canEmbed) {
      setViewerMedia({ media: updatedMedia, embedUrl: embedInfo.embedUrl, type: embedInfo.type });
    } else {
      window.open(cleanUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
              Kumpulan video edukasi, modul anti-bullying, regulasi Permendikbudristek No. 46/2023, RTL, dan panduan resmi sekolah ramah anak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto flex-wrap">
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-violet-200" />
            <span>Pilihan Menu Aplikasi</span>
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenAddForm}
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-violet-900 hover:bg-violet-50 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-violet-700" />
              <span>Tambah Materi Edukasi</span>
            </button>
          )}
        </div>
      </div>

      {/* Pinned Permanent Spotlight: Beranda PASS TEMENAN SPANJU Google Sites */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-violet-900 to-purple-950 p-5 sm:p-7 text-white shadow-xl border-2 border-emerald-400/40">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Portal Web Resmi Permanen
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-medium backdrop-blur-xs">
                UPT SMPN 7 Pasuruan
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Beranda PASS TEMENAN SPANJU</span>
              </h2>
              <p className="text-xs sm:text-sm text-violet-100 mt-1.5 leading-relaxed">
                Pusat terpadu informasi dan media edukasi digital resmi: arsip kegiatan, pedoman pencegahan kekerasan, modul literasi ramah anak, dan modul penguatan karakter siswa SMPN 7 Pasuruan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-200 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 select-all max-w-full overflow-hidden text-ellipsis">
                <Link2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{PERMANENT_GOOGLE_SITES_URL}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto flex-shrink-0">
            <a
              href={PERMANENT_GOOGLE_SITES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Buka Beranda Portal Resmi</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(PERMANENT_GOOGLE_SITES_URL);
                setCopiedPortalLink(true);
                setTimeout(() => setCopiedPortalLink(false), 2000);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {copiedPortalLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span className="text-emerald-200">Tautan Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-violet-200" />
                  <span>Salin Tautan Portal</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Controls & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['Semua', 'Modul', 'Video', 'Infografis', 'Regulasi'].map((kat) => (
            <button
              key={kat}
              type="button"
              onClick={() => setSelectedKategori(kat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

      {/* Grid of Media Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedia.map((m) => {
          const Icon =
            m.kategori === 'Video'
              ? Video
              : m.kategori === 'Modul'
              ? BookOpen
              : FileText;

          const rawUrl = m.url || m.dokumentasiMateriUrl || '';
          const isLocal = isLocalFileUrl(rawUrl);
          const isOfficialPermanent =
            m.id === 'media-beranda-pass-temenan-official' ||
            rawUrl.includes('sites.google.com/view/berandapasstemenanspanju');

          return (
            <div
              key={m.id}
              className={`rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
                isOfficialPermanent
                  ? 'bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/20 border-emerald-300 ring-2 ring-emerald-400/30'
                  : isLocal
                  ? 'bg-white border-amber-300 ring-1 ring-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isOfficialPermanent
                        ? 'bg-emerald-100 text-emerald-700'
                        : isLocal
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-violet-100 text-violet-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isOfficialPermanent && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-200" />
                        <span>PORTAL RESMI PERMANEN</span>
                      </span>
                    )}
                    {isLocal && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Perlu Link Web/Drive</span>
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                      {m.kategori} {m.durasi ? `• ${m.durasi}` : ''}
                    </span>
                  </div>
                </div>

                <h4
                  className={`text-sm font-bold transition-colors leading-snug ${
                    isOfficialPermanent
                      ? 'text-emerald-950 group-hover:text-emerald-700'
                      : 'text-slate-900 group-hover:text-violet-700'
                  }`}
                >
                  {m.judul}
                </h4>
                {m.deskripsi ? (
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                    {m.deskripsi}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-1.5">
                    Modul pendukung program pencegahan dan penanganan perundungan Sahabat SPANJU.
                  </p>
                )}

                {/* Local file warning banner */}
                {isLocal && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>Tautan Berkas Lokal Komputer</span>
                    </div>
                    <p className="text-amber-700 text-[10px] leading-relaxed">
                      Alamat ini ({extractLocalFileName(rawUrl)}) masih tersimpan di harddisk D:/ komputer. Klik tombol di bawah untuk membukanya via panduan perbaikan link Google Drive.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenMedia(m)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isOfficialPermanent
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : isLocal
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
                  }`}
                >
                  {isOfficialPermanent ? (
                    <>
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka Portal Resmi</span>
                    </>
                  ) : isLocal ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Perbaiki &amp; Buka Materi</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Buka Materi</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1">
                  {!isLocal && (
                    <a
                      href={normalizeWebUrl(rawUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Buka langsung di tab baru"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenEditForm(m)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Ubah / Edit Materi"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {isAdmin && (
                    isOfficialPermanent ? (
                      <span
                        className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg inline-flex items-center cursor-help"
                        title="Tautan Resmi Permanen (Tidak dapat dihapus)"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setDeletingId(m.id);
                          setDeletingLabel(`media edukasi "${m.judul}"`);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Hapus Media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: LOCAL FILE EXPLANATION & QUICK RESOLUTION MODAL */}
      {selectedLocalFileMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white flex items-start justify-between gap-3 flex-shrink-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Tautan Berkas Lokal Komputer Tidak Bisa Dibuka Langsung
                  </h3>
                  <p className="text-xs text-amber-100 mt-0.5">
                    Penjelasan keamanan browser &amp; solusi mudah untuk mengaktifkannya
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLocalFileMedia(null)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Materi yang Dipilih:
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedLocalFileMedia.judul}
                </h4>
                <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-slate-200 break-all select-all">
                  {selectedLocalFileMedia.url}
                </div>
                <div className="text-[11px] text-slate-500">
                  Nama berkas di komputer Anda:{' '}
                  <strong className="text-slate-800">
                    {extractLocalFileName(selectedLocalFileMedia.url)}
                  </strong>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5">
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Mengapa Berkas Ini Tidak Bisa Dibuka?</span>
                </p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  Demi keamanan dan privasi, seluruh peramban web (Google Chrome, Edge, Safari, dan HP Android) <strong>melarang situs web</strong> untuk mengakses atau membuka berkas dari harddisk lokal komputer Anda (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">file:///D:/...</code>) secara langsung.
                </p>
              </div>

              {/* Step-by-step fix */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>Langkah Cepat Memperbaiki (1 Menit):</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 pl-1">
                  <li>
                    Buka <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold underline inline-flex items-center gap-0.5">Google Drive <ExternalLink className="w-3 h-3" /></a> di tab baru.
                  </li>
                  <li>
                    Unggah berkas <strong className="text-slate-800">{extractLocalFileName(selectedLocalFileMedia.url)}</strong> ke Google Drive Anda.
                  </li>
                  <li>
                    Klik kanan berkas di Google Drive &gt; <strong>Bagikan (Share)</strong> &gt; Ubah akses menjadi <strong>&ldquo;Siapa saja yang memiliki link dapat melihat&rdquo;</strong>.
                  </li>
                  <li>
                    Salin link tersebut dan tempelkan pada kolom di bawah ini:
                  </li>
                </ol>
              </div>

              {/* Form Input replacement */}
              <form onSubmit={handleSaveLocalFix} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tempel Tautan Google Drive / Cloud yang Baru:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/file/d/... atau https://..."
                      value={replacementUrl}
                      onChange={(e) => setReplacementUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Fallback quick link: Beranda PASS TEMENAN Google Sites
                      setReplacementUrl('https://sites.google.com/view/berandapasstemenanspanju/home');
                    }}
                    className="text-[11px] text-indigo-700 hover:underline font-semibold"
                  >
                    Gunakan Link Google Sites SPANJU
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedLocalFileMedia(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Simpan &amp; Buka</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: IN-APP DOCUMENT & VIDEO VIEWER MODAL */}
      {viewerMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh] max-h-[92vh]">
            {/* Viewer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 text-white flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-violet-200" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm sm:text-base font-bold truncate">
                    {viewerMedia.media.judul}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-violet-100 mt-0.5">
                    <span className="font-medium">{viewerMedia.media.kategori}</span>
                    <span>•</span>
                    <span>Sahabat SPANJU Digital Reader</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(viewerMedia.embedUrl)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-semibold hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
                  title="Salin tautan"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Tersalin' : 'Salin Link'}</span>
                </button>

                <a
                  href={normalizeWebUrl(viewerMedia.media.url || viewerMedia.media.dokumentasiMateriUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors text-xs font-bold inline-flex items-center gap-1.5"
                  title="Buka di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buka di Tab Baru</span>
                </a>

                <button
                  type="button"
                  onClick={() => setViewerMedia(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Iframe Frame */}
            <div className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center">
              <iframe
                src={viewerMedia.embedUrl}
                title={viewerMedia.media.judul}
                className="w-full h-full border-0 bg-white"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Viewer Footer Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs flex-shrink-0">
              <span className="text-slate-500 text-center sm:text-left">
                Tampilan materi interaktif Google Drive &amp; Media Edukasi resmi SMPN 7 Pasuruan
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={normalizeWebUrl(viewerMedia.media.url || viewerMedia.media.dokumentasiMateriUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-700 hover:underline font-bold text-xs inline-flex items-center gap-1"
                >
                  <span>Jika dokumen tidak termuat, klik di sini untuk membuka langsung</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT MEDIA FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-700 text-white flex-shrink-0">
              <div>
                <h3 className="text-base font-bold">
                  {editingMedia ? 'Ubah / Edit Materi Edukasi' : 'Tambah Materi Edukasi Digital'}
                </h3>
                <p className="text-xs text-violet-100 mt-0.5">
                  Tautan Google Drive, YouTube, Heyzine Flipbook, Canva, atau website resmi
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingMedia(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
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
                  placeholder="Contoh: Modul Pelatihan Anti-Bullying 2026"
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
                    <option value="Modul">Modul / Buku Panduan</option>
                    <option value="Video">Video Edukasi</option>
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
                    placeholder="Contoh: 12 Halaman / 15 Menit"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  URL / Tautan Materi
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/... atau https://www.youtube.com/..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-violet-500 text-slate-800"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Catatan: Harap gunakan tautan online (Google Drive, YouTube, Heyzine, website). Jangan gunakan berkas lokal (file:///D:/...) agar dapat diakses oleh semua pengguna dan siswa.
                </p>
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
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingMedia(null);
                  }}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  {editingMedia ? 'Simpan Perubahan' : 'Simpan Materi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deletingId}
        message={`Apakah Anda yakin ingin menghapus ${deletingLabel}?`}
        onConfirm={() => {
          if (deletingId) {
            onDeleteMedia(deletingId);
            setDeletingId(null);
          }
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
