import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Play, Pause } from 'lucide-react';

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
  // Try to parse YYYY-MM-DD or default to today
  const [isoDate, setIsoDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

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
    setIsoDate(newIso);
    onChange(formatDateIndo(newIso));
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="date"
          value={isoDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800"
        />
      </div>
      {value && (
        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 self-start">
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
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      onChange(`${hours}.${minutes} WIB`);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLive, onChange]);

  // Analog Clock angles
  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          {label}
        </span>
        <button
          type="button"
          onClick={() => setIsLive(!isLive)}
          className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium transition-colors ${
            isLive
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-slate-100 text-slate-600 border border-slate-300'
          }`}
        >
          {isLive ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
          {isLive ? 'Live Real-Time' : 'Terkunci / Manual'}
        </button>
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
            {/* Second hand */}
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
          </svg>
        </div>

        {/* Digital display / input */}
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setIsLive(false);
              onChange(e.target.value);
            }}
            placeholder="08.00 WIB"
            className="w-full px-2.5 py-1 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
          <span className="text-[10px] text-slate-500 mt-0.5">
            {isLive ? 'Jam otomatis bergerak real-time' : 'Waktu telah diatur secara manual'}
          </span>
        </div>
      </div>
    </div>
  );
};
