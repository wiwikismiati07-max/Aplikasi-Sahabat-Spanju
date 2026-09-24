import React, { useState } from 'react';
import { Database, Copy, Check, X, Code, ExternalLink, ShieldCheck } from 'lucide-react';
import { SUPABASE_SETUP_SQL } from '../data/supabaseSetupSql';
import { SUPABASE_URL } from '../lib/api';

interface SupabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSqlModal: React.FC<SupabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 p-5 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-100 text-[10px] font-extrabold uppercase">
                <ShieldCheck className="w-3 h-3 text-emerald-300" />
                <span>Skema Table Multi-User Multi-Device</span>
              </div>
              <h2 className="text-lg font-black tracking-tight uppercase">
                Script SQL Supabase Database
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-sm">
              <Code className="w-4 h-4 text-emerald-700" />
              <span>Petunjuk Pembuatan Tabel Supabase:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700 font-medium">
              <li>
                Buka dashboard Supabase Anda di{' '}
                <a
                  href={`${SUPABASE_URL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-700 underline inline-flex items-center gap-0.5"
                >
                  {SUPABASE_URL} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Pilih menu <strong className="text-slate-900">SQL Editor</strong> di bilah navigasi kiri.
              </li>
              <li>
                Klik <strong className="text-slate-900">&ldquo;New query&rdquo;</strong>, lalu salin dan tempel (paste) seluruh script SQL di bawah ini.
              </li>
              <li>
                Klik tombol <strong className="text-slate-900">&ldquo;Run&rdquo;</strong> (atau tekan Ctrl+Enter). Seluruh 12 tabel &amp; akses RLS multi-user akan langsung aktif secara otomatis!
              </li>
            </ol>
          </div>

          <div className="relative rounded-2xl bg-slate-900 border border-slate-800 text-emerald-300 p-4 font-mono text-[11px] leading-relaxed max-h-[380px] overflow-y-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white" />
                  <span>Salin Seluruh SQL</span>
                </>
              )}
            </button>
            <pre className="whitespace-pre-wrap pr-32">{SUPABASE_SETUP_SQL}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold text-slate-500">
            Terhubung ke: <span className="font-bold text-emerald-800">{SUPABASE_URL}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Tersalin' : 'Salin SQL'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
