import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Lock, Play, Pause, RefreshCw } from 'lucide-react';

export const getTodayIndoDate = (): string => {
  const d = new Date();
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const getCurrentWibTime = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}.${minutes} WIB`;
};

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

export interface CalendarDatePickerProps {
  value: string;
  onChange: (formattedDate: string) => void;
  label?: string;
  isLocked?: boolean; // false = input baru (real-time kalender), true = setelah disimpan (terkunci)
}

export const CalendarDatePicker: React.FC<CalendarDatePickerProps> = ({
  value,
  onChange,
  label = 'Hari / Tanggal',
  isLocked = false,
}) => {
  // If not locked and value is empty or not provided, initialize to today's date
  useEffect(() => {
    if (!isLocked && !value) {
      onChange(getTodayIndoDate());
    }
  }, [isLocked, value, onChange]);

  // Parse existing date into ISO format (YYYY-MM-DD)
  const [isoDate, setIsoDate] = useState(() => parseIndoDateToIso(value));

  // Sync isoDate whenever value prop changes
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

  const handleSetToday = () => {
    const today = new Date();
    const iso = today.toISOString().split('T')[0];
    setIsoDate(iso);
    onChange(getTodayIndoDate());
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          {label}
        </label>
        {isLocked ? (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-emerald-600" />
            Terkunci (Tersimpan)
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Live Real-Time (Hari Ini)
            </span>
            <button
              type="button"
              onClick={handleSetToday}
              className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset ke tanggal hari ini"
            >
              <RefreshCw className="w-2.5 h-2.5 text-emerald-600" />
              Hari Ini
            </button>
          </div>
        )}
      </div>

      <div className="relative flex items-center">
        <input
          type="date"
          value={isoDate}
          onChange={handleDateChange}
          className={`w-full px-3 py-2 text-sm bg-white border rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium ${
            isLocked ? 'border-slate-300 text-slate-800' : 'border-emerald-400 ring-1 ring-emerald-200 text-slate-900'
          }`}
        />
      </div>

      <div className="flex items-center justify-between mt-0.5">
        {value && (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 self-start flex items-center gap-1">
            {isLocked ? <Lock className="w-2.5 h-2.5 text-emerald-600" /> : <Calendar className="w-2.5 h-2.5 text-emerald-600" />}
            {value}
          </span>
        )}
        <span className="text-[10px] text-slate-400 italic">
          {isLocked ? 'Terkunci sesuai tanggal kejadian' : 'Real-time (otomatis terkunci setelah disimpan)'}
        </span>
      </div>
    </div>
  );
};

export interface RealTimeTimePickerProps {
  value: string;
  onChange: (timeStr: string) => void;
  label?: string;
  isLocked?: boolean; // false = input baru (real-time jam bergerak), true = setelah disimpan (terkunci)
}

export const RealTimeTimePicker: React.FC<RealTimeTimePickerProps> = ({
  value,
  onChange,
  label = 'Waktu / Jam',
  isLocked = false,
}) => {
  // If not locked, live clock is active by default. If locked, live clock is OFF.
  const [isLive, setIsLive] = useState(!isLocked);
  const [clockDate, setClockDate] = useState(new Date());

  // Sync isLive state if isLocked prop changes
  useEffect(() => {
    setIsLive(!isLocked);
  }, [isLocked]);

  // Live real-time ticker: runs only before data is saved
  useEffect(() => {
    if (!isLive || isLocked) return;

    // Immediately set current time
    const initNow = new Date();
    setClockDate(initNow);
    const initH = String(initNow.getHours()).padStart(2, '0');
    const initM = String(initNow.getMinutes()).padStart(2, '0');
    onChange(`${initH}.${initM} WIB`);

    const timer = setInterval(() => {
      const now = new Date();
      setClockDate(now);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      onChange(`${hours}.${minutes} WIB`);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLive, isLocked, onChange]);

  // Parse time from value string
  const parseTime = (timeStr?: string) => {
    if (!timeStr) return { hours: clockDate.getHours(), minutes: clockDate.getMinutes() };
    const m = timeStr.match(/(\d{1,2})[:.](\d{2})/);
    if (m) {
      return {
        hours: parseInt(m[1], 10),
        minutes: parseInt(m[2], 10),
      };
    }
    return { hours: clockDate.getHours(), minutes: clockDate.getMinutes() };
  };

  const { hours, minutes } = parseTime(value);

  // Analog Clock angles
  const seconds = clockDate.getSeconds();
  const secondAngle = seconds * 6;
  const minuteAngle = isLive ? minutes * 6 + seconds * 0.1 : minutes * 6;
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
        {isLocked ? (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1">
              <Lock className="w-2.5 h-2.5 text-emerald-600" />
              Terkunci (Tersimpan)
            </span>
            <button
              type="button"
              onClick={handleSetCurrentTime}
              className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Set sekali ke jam saat ini"
            >
              <Clock className="w-2.5 h-2.5 text-blue-600" />
              Set Jam Sekarang
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
              Live Real-Time Berjalan
            </span>
            <button
              type="button"
              onClick={() => setIsLive(!isLive)}
              className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                isLive
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              }`}
            >
              {isLive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              {isLive ? 'Jeda' : 'Jalankan'}
            </button>
          </div>
        )}
      </div>

      <div
        className={`flex items-center gap-3 bg-white p-2.5 border rounded-xl shadow-xs transition-colors ${
          isLocked ? 'border-slate-300' : 'border-emerald-400 ring-1 ring-emerald-200'
        }`}
      >
        {/* Analog Clock Display */}
        <div className="relative w-11 h-11 flex-shrink-0">
          <svg className="w-11 h-11" viewBox="0 0 100 100">
            {/* Clock Face */}
            <circle cx="50" cy="50" r="46" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4" />
            {/* Center Dot */}
            <circle cx="50" cy="50" r="3.5" fill="#0f172a" />
            {/* Hour markers */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="50"
                y1="8"
                x2="50"
                y2="14"
                stroke="#64748b"
                strokeWidth="2.5"
                transform={`rotate(${deg} 50 50)`}
              />
            ))}
            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="26"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 50 50)`}
            />
            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 50 50)`}
            />
            {/* Second hand (visible in real-time mode) */}
            {isLive && !isLocked && (
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="12"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${secondAngle} 50 50)`}
              />
            )}
          </svg>
        </div>

        {/* Digital display / input */}
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={value || getCurrentWibTime()}
            onChange={(e) => {
              setIsLive(false);
              onChange(e.target.value);
            }}
            placeholder="07.30 WIB"
            className="w-full px-2.5 py-1 text-sm font-bold bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono"
          />
          <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
            {isLocked ? (
              <>
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
                Waktu terkunci sesuai data kejadian (tidak berubah realtime tiap hari).
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Jam otomatis bergerak real-time. Terkunci setelah data disimpan.
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
