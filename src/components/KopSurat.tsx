import React from 'react';

interface KopSuratProps {
  judulDokumen?: string;
  className?: string;
}

export const KopSurat: React.FC<KopSuratProps> = ({ judulDokumen, className = '' }) => {
  return (
    <div className={`w-full text-black ${className}`}>
      {/* Header with 2 Logos */}
      <div className="flex items-center justify-between gap-4 pb-2">
        {/* Left Logo: Dinas Kota Pasuruan */}
        <div className="flex-shrink-0">
          <img
            src="https://i.ibb.co.com/C3Y7JXkN/logo-dinas.png"
            alt="Logo Pemerintah Kota Pasuruan"
            className="h-16 w-auto object-contain max-w-[65px]"
            crossOrigin="anonymous"
          />
        </div>

        {/* Center Text */}
        <div className="flex-1 text-center font-serif leading-tight">
          <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-800">
            Pemerintah Kota Pasuruan
          </h3>
          <h2 className="text-base font-bold tracking-wide uppercase text-slate-900">
            Dinas Pendidikan dan Kebudayaan
          </h2>
          <h1 className="text-lg font-black tracking-wider uppercase text-slate-950">
            UPT SMP Negeri 7
          </h1>
          <p className="text-[11px] text-slate-700 mt-0.5">
            Jalan Simpang Slamet Riadi Nomor 2, Telepon (0343) 426845
          </p>
          <p className="text-[10px] text-slate-600">
            Pos-el: smp7pas@yahoo.co.id &bull; Laman: www.smpn7pasuruan.sch.id
          </p>
          <p className="text-[10px] font-semibold text-slate-700">
            Pasuruan &bull; Kode Pos 67128
          </p>
        </div>

        {/* Right Logo: SMPN 7 Pasuruan */}
        <div className="flex-shrink-0">
          <img
            src="/logo-smpn7.png"
            onError={(e) => {
              e.currentTarget.src = 'https://iili.io/KDFk4fI.png';
            }}
            alt="Logo SMPN 7 Pasuruan"
            className="h-16 w-auto object-contain max-w-[65px]"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Official Indonesian Double Line Border */}
      <div className="border-t-2 border-black mt-1"></div>
      <div className="border-t border-black mt-[1.5px] mb-3"></div>

      {/* Optional Document Title without redundant dates/numbers */}
      {judulDokumen && (
        <div className="text-center my-3">
          <h2 className="text-sm font-bold uppercase underline tracking-wider text-slate-900">
            {judulDokumen}
          </h2>
        </div>
      )}
    </div>
  );
};
