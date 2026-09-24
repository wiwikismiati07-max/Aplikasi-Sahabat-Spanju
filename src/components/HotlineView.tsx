import React from 'react';
import {
  PhoneCall,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Clock,
  Layers,
  ShieldCheck,
  ExternalLink,
  Send,
  HeartHandshake,
} from 'lucide-react';

interface HotlineViewProps {
  onOpenMenu: () => void;
  onOpenELapor?: () => void;
}

export const HotlineView: React.FC<HotlineViewProps> = ({
  onOpenMenu,
  onOpenELapor,
}) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      {/* 1. ORANGE HEADER BANNER (MATCHES SCREENSHOT EXACTLY) */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-md relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <span>LAYANAN RESMI SEKOLAH</span>
            <span className="opacity-60">•</span>
            <span>SMP NEGERI 7 PASURUAN</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-3 text-white uppercase">
            HOTLINE &amp; LAYANAN PENGADUAN
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-white/95 mt-2 max-w-2xl leading-relaxed">
            Saluran komunikasi cepat, bantuan konsultasi, dan pengaduan layanan ramah anak Sahabat SPANJU.
          </p>
        </div>

        {/* Action Buttons on the Right */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto flex-wrap lg:flex-nowrap flex-shrink-0">
          {/* Button 1: Pilihan Menu */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all border border-white/25 cursor-pointer flex-1 sm:flex-initial"
          >
            <Layers className="w-4 h-4 text-white" />
            <span>Pilihan Menu</span>
          </button>

          {/* Button 2: Buka E-Lapor */}
          <button
            type="button"
            onClick={onOpenELapor ? onOpenELapor : onOpenMenu}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-orange-50 active:bg-orange-100 text-orange-600 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer flex-1 sm:flex-initial"
          >
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Buka E-Lapor</span>
          </button>
        </div>
      </div>

      {/* 2. THE 3 MAIN CARDS GRID (MATCHES SCREENSHOT EXACTLY) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* CARD 1: NOMOR TELEPON / HOTLINE */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            {/* Top Amber Icon */}
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <PhoneCall className="w-7 h-7" />
            </div>

            {/* Label */}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              NOMOR TELEPON / HOTLINE
            </span>

            {/* Telepon Kantor */}
            <a
              href="tel:0343426845"
              className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight hover:text-amber-600 transition-colors block"
              title="Hubungi Telepon Kantor (0343) 426845"
            >
              (0343) 426845
            </a>

            {/* WhatsApp Resmi */}
            <a
              href="https://wa.me/6285168700953"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl font-bold text-amber-600 hover:text-amber-700 transition-colors block mt-1 font-mono"
              title="Hubungi WhatsApp 085168700953"
            >
              085168700953
            </a>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Layanan telepon siaga dan WhatsApp Resmi Satgas Anti Bullying &amp; BK SMP Negeri 7 Pasuruan.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-2">
            <a
              href="tel:0343426845"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Telepon</span>
            </a>
            <a
              href="https://wa.me/6285168700953"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* CARD 2: POS-EL RESMI (EMAIL) */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            {/* Top Blue Icon */}
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Mail className="w-7 h-7" />
            </div>

            {/* Label */}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              POS-EL RESMI (EMAIL)
            </span>

            {/* Email Address */}
            <a
              href="mailto:smp7pas@yahoo.co.id"
              className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight hover:text-blue-600 transition-colors block break-all font-mono"
              title="Kirim Pos-el ke smp7pas@yahoo.co.id"
            >
              smp7pas@yahoo.co.id
            </a>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Kirimkan surat resmi, laporan tertulis, maupun dokumen pendukung kedinasan melalui email resmi sekolah.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="pt-5 mt-5 border-t border-slate-100">
            <a
              href="mailto:smp7pas@yahoo.co.id"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Email Resmi</span>
            </a>
          </div>
        </div>

        {/* CARD 3: LAMAN WEB RESMI */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
          <div>
            {/* Top Emerald Icon */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Globe className="w-7 h-7" />
            </div>

            {/* Label */}
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              LAMAN WEB RESMI
            </span>

            {/* Web Domain */}
            <a
              href="https://www.smpn7pasuruan.sch.id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight hover:text-emerald-600 transition-colors block break-all font-mono"
              title="Kunjungi Laman www.smpn7pasuruan.sch.id"
            >
              www.smpn7pasuruan.sch.id
            </a>

            {/* Description */}
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Portal informasi publik, berita kegiatan sekolah, pengumuman, dan profil resmi SMP Negeri 7 Pasuruan.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="pt-5 mt-5 border-t border-slate-100">
            <a
              href="https://www.smpn7pasuruan.sch.id"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Laman Resmi</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. ALAMAT FISIK KAMPUS & JAM SIAGA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Alamat Fisik */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ALAMAT KAMPUS UPTD SMPN 7 PASURUAN
            </span>
            <h4 className="text-sm font-black text-slate-900 mt-0.5">
              Jalan Simpang Slamet Riadi Nomor 2
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              Kota Pasuruan, Jawa Timur &bull; Kode Pos 67128
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Ruang Konseling Bimbingan Konseling (BK) &amp; Posko Satgas TPPK PASS TEMENAN.
            </p>
          </div>
        </div>

        {/* Jam Pelayanan Kedinasan */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              JAM PELAYANAN KEDINASAN
            </span>
            <h4 className="text-sm font-black text-slate-900 mt-0.5">
              Senin &ndash; Jumat: 06.30 &ndash; 15.00 WIB
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
              Layanan Hotline WhatsApp (085168700953) siap merespon pelaporan darurat 1x24 jam.
            </p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-1">
              Jaminan kerahasiaan identitas dan perlindungan anak sesuai Permendikbudristek No. 46/2023.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
