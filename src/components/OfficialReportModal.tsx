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
  namaPenandatangan = 'Wiwik Ismiati, S.Pd',
  jabatanPenandatangan = 'Koordinator TPPK / Guru BK',
  nipPenandatangan = '19831116 200904 2 003',
  tandaTanganUrl = '',
  namaKepalaSekolah = 'Nur Fadilah, S.Pd,.M.Pd',
  nipKepalaSekolah = '19860410 201001 2 030',
  tandaTanganKepalaUrl = '',
  showKepalaSekolah = true,
  tanggalDokumen = 'Pasuruan, 24 September 2026',
  children,
}) => {
  const [selectedNama, setSelectedNama] = React.useState(() => {
    const name = (namaPenandatangan || '').toLowerCase();
    if (name.includes('eki')) return 'Eki Febriani, S.Pd';
    return 'Wiwik Ismiati, S.Pd';
  });
  const [selectedNip, setSelectedNip] = React.useState(() => {
    const name = (namaPenandatangan || '').toLowerCase();
    if (name.includes('eki')) return '19940214 202221 2 014';
    return nipPenandatangan || '19831116 200904 2 003';
  });

  React.useEffect(() => {
    const name = (namaPenandatangan || '').toLowerCase();
    if (name.includes('eki')) {
      setSelectedNama('Eki Febriani, S.Pd');
      setSelectedNip('19940214 202221 2 014');
    } else {
      setSelectedNama('Wiwik Ismiati, S.Pd');
      setSelectedNip(nipPenandatangan || '19831116 200904 2 003');
    }
  }, [namaPenandatangan, nipPenandatangan]);

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
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; color: #000; padding: 15px; }
    .print-sheet { box-shadow: none !important; border: none !important; max-width: 100% !important; margin: 0 auto; background: #fff; }
    @media print { 
      .no-print { display: none !important; } 
      body { padding: 0 !important; background: #fff !important; }
      .print-sheet { box-shadow: none !important; border: none !important; }
    }
  </style>
</head>
<body class="max-w-[760px] mx-auto bg-slate-100 py-6">
  <div class="no-print mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
      <span class="text-sm font-bold text-emerald-900">Dokumen Sahabat SPANJU Siap Cetak (A4 Tanpa Bayangan)</span>
    </div>
    <button onclick="window.print()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow cursor-pointer transition-all">Cetak / Simpan PDF</button>
  </div>
  <div class="print-sheet bg-white p-8 sm:p-12 rounded-xl shadow-md border border-slate-200">
    ${reportContent}
  </div>
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${judulDokumen.replace(/[^a-zA-Z0-9]/g, '_')}_A4.html`;
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

        {/* Signer Selection Bar (No-print) */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
          <span className="font-bold text-blue-900 flex items-center gap-1.5">
            <span>Pilih Koordinator TPPK / Guru BK:</span>
          </span>
          <div className="flex items-center gap-2">
            <select
              value={selectedNama}
              onChange={(e) => {
                const val = e.target.value.toLowerCase();
                if (val.includes('eki')) {
                  setSelectedNama('Eki Febriani, S.Pd');
                  setSelectedNip('19940214 202221 2 014');
                } else {
                  setSelectedNama('Wiwik Ismiati, S.Pd');
                  setSelectedNip('19831116 200904 2 003');
                }
              }}
              className="bg-white border border-blue-300 rounded-lg px-3 py-1 font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="Wiwik Ismiati, S.Pd">Wiwik Ismiati, S.Pd (NIP. 19831116 200904 2 003)</option>
              <option value="Eki Febriani, S.Pd">Eki Febriani, S.Pd (NIP. 19940214 202221 2 014)</option>
            </select>
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
                  <div className="font-bold underline text-slate-900">
                    {selectedNama}
                  </div>
                  <div className="text-[11px] text-slate-700">NIP. {selectedNip}</div>
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
                    <div className="font-bold underline text-slate-900">
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
