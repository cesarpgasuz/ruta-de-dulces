import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function TimePicker({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value or fallback
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '07', minute: '00', period: 'p. m.' };
    const clean = timeStr.trim().toLowerCase();
    const isPm = clean.includes('pm') || clean.includes('p. m.') || clean.includes('p.m.');
    const match = clean.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      let h = parseInt(match[1], 10);
      let m = match[2];
      const hourPadded = h < 10 ? `0${h}` : `${h}`;
      return {
        hour: hourPadded,
        minute: m,
        period: isPm ? 'p. m.' : 'a. m.',
      };
    }
    return { hour: '07', minute: '00', period: 'p. m.' };
  };

  const current = parseTime(value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const update = (newHour, newMinute, newPeriod) => {
    const formatted = `${newHour}:${newMinute} ${newPeriod}`;
    onChange(formatted);
  };

  const hoursList = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const minutesList = ['00', '15', '30', '45'];

  return (
    <div className="relative flex-1" ref={containerRef}>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#11141d] border border-[#202737] hover:border-orange-500/50 focus:border-orange-500 text-xs text-gray-200 px-3 py-2.5 rounded-xl transition-all shadow-sm"
      >
        <span className="font-medium">{value || '07:00 p. m.'}</span>
        <Clock className="w-3.5 h-3.5 text-gray-500" />
      </button>

      {/* Popover matching Lovable timepicker */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-[#121622] border border-[#242c3d] rounded-2xl shadow-2xl p-2.5 w-60 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            
            {/* Hours Column */}
            <div className="flex flex-col max-h-44 overflow-y-auto custom-scrollbar pr-1">
              <span className="text-[10px] text-gray-500 mb-1 font-bold">HORA</span>
              {hoursList.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => update(h, current.minute, current.period)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    current.hour === h
                      ? 'bg-orange-500 text-black shadow-md'
                      : 'text-gray-300 hover:bg-[#1a202c]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col max-h-44 overflow-y-auto custom-scrollbar pr-1 border-x border-[#1e2535]">
              <span className="text-[10px] text-gray-500 mb-1 font-bold">MIN</span>
              {minutesList.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update(current.hour, m, current.period)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    current.minute === m
                      ? 'bg-orange-500 text-black shadow-md'
                      : 'text-gray-300 hover:bg-[#1a202c]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* AM / PM Column */}
            <div className="flex flex-col gap-1.5 pt-4">
              <button
                type="button"
                onClick={() => update(current.hour, current.minute, 'a. m.')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  current.period === 'a. m.'
                    ? 'bg-orange-500 text-black shadow-md'
                    : 'text-gray-300 hover:bg-[#1a202c]'
                }`}
              >
                a. m.
              </button>
              <button
                type="button"
                onClick={() => update(current.hour, current.minute, 'p. m.')}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  current.period === 'p. m.'
                    ? 'bg-orange-500 text-black shadow-md'
                    : 'text-gray-300 hover:bg-[#1a202c]'
                }`}
              >
                p. m.
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-auto py-1 text-[11px] text-orange-400 hover:underline"
              >
                Listo
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
