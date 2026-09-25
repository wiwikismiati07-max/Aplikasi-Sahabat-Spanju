import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Lock } from 'lucide-react';

export const parseIndoDateToIso = (dateStr?: string): string => {
  if (!dateStr) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) return dateStr.trim();

  // If DD/MM/YYYY or DD-MM-YYYY
  const dmMatch = dateStr.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmMatch) {
    const day = dmMatch[1].padStart(2, '0');
    const month = dmMatch[2].padStart(2, '0');
    const year = dmMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Indonesian month name lookup
  const clean = dateStr.toLowerCase();
  const monthsMap: Record<string, string> = {
    jan: '01',
    feb: '02',
    peb: '02',
    mar: '03',
    apr: '04',
    mei: '05',
    may: '05',
    jun: '06',
    jul: '07',
    agu: '08',
    ags: '08',
    sep: '09',
    okt: '10',
    oct: '10',
    nov: '11',
    nop: '11',
    des: '12',
    dec: '12',
  };

  for (const [key, num] of Object.entries(monthsMap)) {
    if (clean.includes(key)) {
      const dayMatch = clean.match(/(?:^|\D)(\d{1,2})(?:\s+|$|\D)/);
      const yearMatch = clean.match(/(\d{4})/);
      if (dayMatch && yearMatch) {
        const day = dayMatch[1].padStart(2, '0');
        const year = yearMatch[1];
        return `${year}-${num}-${day}`;
      }
    }
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }

  const today = new Date();
  return today.toISOString().split('T')[0];
};

interface CalendarDatePickerProps {
  value: string;
  onChange: (formattedDate: string) => void;
  label?: string;
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  value,
  onChange,
  label = 'Hari / Tanggal',
}) => {
  // Parse existing saved date into ISO format (YYYY-MM-DD)
  const [isoDate, setIsoDate] = useState(() => parseIndoDateToIso(value));

  // Sync isoDate whenever value prop changes (e.g. when opening edit modal)
  useEffect(() => {
    if (value) {
      setIsoDate(parseIndoDateToIso(value));
    }
  }, [value]);

  const formatDateIndo = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
      ];
      const dayName = days[d.getDay()];
      const day = d.getDate();
      const monthName = months[d.getMonth()];
      const year = d.getFullYear();
      return `${dayName}, ${day} ${monthName} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIso = e.target.value;
    if (!newIso) return;
    setIsoDate(newIso);
    onChange(formatDateIndo(newIso));
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          {label}
        </label>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
          <Lock className="w-2.5 h-2.5 text-emerald-600" />
          Terkunci
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="date"
          value={isoDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 font-medium"
        />
      </div>
      {value && (
        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start flex items-center gap-1 mt-0.5">
          <Lock className="w-2.5 h-2.5 text-emerald-600" />
          {value}
        </span>
      )}
    </div>
  );
};

interface RealTimeTimePickerProps {
  value: string;
  onChange: (timeStr: string) => void;
  label?: string;
}

export const RealTimeTimePicker: React.FC<RealTimeTimePickerProps> = ({
  value,
  onChange,
  label = 'Waktu / Jam',
}) => {
  // Parse time from value string (e.g., "07.30 WIB" -> hours: 7, minutes: 30)
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return { hours: 7, minutes: 30 };
    const m = timeStr.match(/(\d{1,2})[:.](\d{2})/);
    if (m) {
      return {
        hours: parseInt(m[1], 10),
        minutes: parseInt(m[2], 10),
      };
    }
    return { hours: 7, minutes: 30 };
  };

  const { hours, minutes } = parseTime(value);

  // Analog Clock angles based strictly on saved value
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const handleSetCurrentTime = () => {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    onChange(`${h}.${m} WIB`);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-emerald-600" />
            Terkunci Permanen
          </span>
          <button
            type="button"
            onClick={handleSetCurrentTime}
            className="text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
            title="Set sekali ke waktu saat ini"
          >
            <Clock className="w-2.5 h-2.5 text-blue-600" />
            Set Jam Sekarang
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-2.5 border border-slate-300 rounded-xl shadow-xs">
        {/* SVG Analog Clock */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
            {/* Clock face */}
            <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="50" cy="50" r="2" fill="#0f172a" />
            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="26"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 50 50)`}
            />
            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="16"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 50 50)`}
            />
          </svg>
        </div>

        {/* Digital display / input - Permanent & Stable */}
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={value || '07.30 WIB'}
            onChange={(e) => onChange(e.target.value)}
            placeholder="07.30 WIB"
            className="w-full px-2.5 py-1 text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
          />
          <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
            <Lock className="w-2.5 h-2.5 text-emerald-600" />
            Waktu terkunci sesuai data kejadian (tidak berubah realtime tiap hari)
          </span>
        </div>
      </div>
    </div>
  );
};
