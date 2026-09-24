import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Check, Lock } from 'lucide-react';

interface TouchSignaturePadProps {
  label: string;
  initialSignature?: string;
  isLocked?: boolean;
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
  canUnlock?: boolean;
  onUnlock?: () => void;
}

export const TouchSignaturePad: React.FC<TouchSignaturePadProps> = ({
  label,
  initialSignature = '',
  isLocked = false,
  onSave,
  onClear,
  canUnlock = false,
  onUnlock,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(!!initialSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set resolution for sharp display
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#0f172a'; // Deep navy blue
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If there's an initial signature, draw it
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL('image/png'));
    }
  };

  const handleClear = () => {
    if (isLocked) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    if (onClear) onClear();
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{label}</span>
        {isLocked ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <Lock className="w-3 h-3" /> Terkunci (Dilindungi)
          </span>
        ) : (
          <span className="text-[11px] text-slate-500">Goreskan jari / stylus / mouse</span>
        )}
      </div>

      <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          style={{ touchAction: 'none' }}
          className={`w-full h-32 cursor-crosshair ${isLocked ? 'pointer-events-none opacity-85' : ''}`}
        />

        {!hasDrawn && !isLocked && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-xs text-slate-400 select-none">
            Tanda Tangan di Sini
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-1">
        {!isLocked ? (
          <>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Hapus Goresan
            </button>
            <span className="text-emerald-600 inline-flex items-center gap-1 text-[11px] font-medium">
              <Check className="w-3.5 h-3.5" /> Tersimpan Otomatis
            </span>
          </>
        ) : (
          canUnlock && (
            <button
              type="button"
              onClick={onUnlock}
              className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 font-medium"
            >
              Buka Kunci TTD (Khusus Admin)
            </button>
          )
        )}
      </div>
    </div>
  );
};
