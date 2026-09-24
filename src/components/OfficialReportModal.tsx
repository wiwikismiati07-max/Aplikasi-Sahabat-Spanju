import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { KopSurat } from './KopSurat';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  judulDokumen: string;
  namaPenandatangan?: string;
  jabatanPenandatangan?: string;
  nipPenandatangan?: string;
  tandaTanganUrl?: string;
  namaKepalaSekolah?: string;
  nipKepalaSekolah?: string;
  tandaTanganKepalaUrl?: string;
  showKepalaSekolah?: boolean;
  tanggalDokumen?: string;
  children: React.ReactNode;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({
  isOpen,
  onClose,
  judulDokumen,
  namaPenandatangan = 'WIWIK ISMIATI, S.Pd',
  jabatanPenandatangan = 'Koordinator TPPK / Guru BK',
  nipPenandatangan = '19831116 200904 2 003',
  tandaTanganUrl = '',
  namaKepalaSekolah = 'NUR FADILAH, S.Pd., M.Pd',
  nipKepalaSekolah = '19860410 201001 2 030',
  tandaTanganKepalaUrl = '',
  showKepalaSekolah = true,
  tanggalDokumen = 'Pasuruan, 24 September 2026',
  children,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfflineHTML = () => {
    const reportContent = document.getElementById('printable-official-report')?.innerHTML;
    if (!reportContent) return;

    const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${judulDokumen} - SMPN 7 Pasuruan</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4 portrait; margin-top: 0.5cm; margin-bottom: 1cm; margin-left: 1.5cm; margin-right: 1.5cm; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #000; padding: 20px; }
    @media print { .no-print { display: none !important; } }
  </style>
</head>
<body class="max-w-[760px] mx-auto">
  <div class="no-print mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
    <span class="text-sm font-semibold text-emerald-800">Dokumen Sahabat SPANJU Siap Cetak</span>
    <button onclick="window.print()" class="px-4 py-1.5 bg-emerald-600 text-white rounded font-medium text-sm">Cetak Dokumen</button>
  </div>
  ${reportContent}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${judulDokumen.replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-100 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col my-auto max-h-[95vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Action Header */}
        <div className="p-3.5 bg-slate-800 text-white flex items-center justify-between border-b border-slate-700 no-print flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base">Pratinjau Lembar A4 Kedinasan</span>
            <span className="hidden sm:inline-block text-xs bg-emerald-600/50 text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/30">
              Standar Kop Resmi Pasuruan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadOfflineHTML}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simpan Laporan Offline</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body simulating real A4 page */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70">
          <div
            id="printable-official-report"
            className="w-full max-w-[760px] bg-white p-6 sm:p-10 shadow-lg border border-slate-300 rounded-sm text-black print-sheet"
          >
            {/* Kop Surat Resmi */}
            <KopSurat judulDokumen={judulDokumen} />

            {/* Document Specific Content */}
            <div className="my-4 text-xs leading-relaxed">{children}</div>

            {/* Official Signatures Section */}
            <div className="mt-8 pt-4 border-t border-dashed border-slate-300">
              <div className="text-right text-xs mb-3 text-slate-700">
                {tanggalDokumen}
              </div>

              <div className="grid grid-cols-2 gap-6 text-center text-xs">
                {/* Left: Koordinator / Petugas */}
                <div className="flex flex-col items-center">
                  <div className="font-semibold text-slate-700">Mengetahui/Mengesahkan,</div>
                  <div className="font-medium text-slate-600">{jabatanPenandatangan}</div>
                  <div className="h-20 flex items-center justify-center my-1 w-full">
                    {tandaTanganUrl ? (
                      <img
                        src={tandaTanganUrl}
                        alt="Tanda Tangan Petugas"
                        className="max-h-16 max-w-[140px] object-contain"
                      />
                    ) : (
                      <div className="text-[10px] text-slate-400 italic">
                        [ Tanda Tangan Digital ]
                      </div>
                    )}
                  </div>
                  <div className="font-bold underline uppercase text-slate-900">
                    {namaPenandatangan}
                  </div>
                  <div className="text-[11px] text-slate-700">NIP. {nipPenandatangan}</div>
                </div>

                {/* Right: Kepala Sekolah (UPPERCASE) */}
                {showKepalaSekolah ? (
                  <div className="flex flex-col items-center">
                    <div className="font-semibold text-slate-700">Mengetahui,</div>
                    <div className="font-medium text-slate-600">
                      Kepala UPT SMP Negeri 7 Pasuruan
                    </div>
                    <div className="h-20 flex items-center justify-center my-1 w-full">
                      {tandaTanganKepalaUrl ? (
                        <img
                          src={tandaTanganKepalaUrl}
                          alt="Tanda Tangan Kepala Sekolah"
                          className="max-h-16 max-w-[140px] object-contain"
                        />
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">
                          [ Tanda Tangan & Cap Resmi ]
                        </div>
                      )}
                    </div>
                    <div className="font-bold underline uppercase text-slate-900">
                      {namaKepalaSekolah}
                    </div>
                    <div className="text-[11px] text-slate-700">NIP. {nipKepalaSekolah}</div>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
