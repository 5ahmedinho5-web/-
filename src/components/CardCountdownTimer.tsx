import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

interface CardCountdownTimerProps {
  enabled?: boolean;
  days?: number;
  hours?: number;
  minutes?: number;
  label?: string;
  className?: string;
  compact?: boolean;
}

export const CardCountdownTimer: React.FC<CardCountdownTimerProps> = ({
  enabled = true,
  days = 1,
  hours = 12,
  minutes = 30,
  label = 'لفترة محدودة',
  className = '',
  compact = false,
}) => {
  const safeDays = Math.max(0, Number(days) || 0);
  const safeHours = Math.max(0, Math.min(23, Number(hours) || 0));
  const safeMinutes = Math.max(0, Math.min(59, Number(minutes) || 0));

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: safeDays,
    hours: safeHours,
    minutes: safeMinutes,
    seconds: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    let totalSecondsDuration = safeDays * 86400 + safeHours * 3600 + safeMinutes * 60;
    if (totalSecondsDuration <= 0) {
      totalSecondsDuration = 86400 + 43200; // default 1 day 12 hours
    }
    const durationMs = totalSecondsDuration * 1000;

    const storageKey = `najma_card_timer_v4_${safeDays}_${safeHours}_${safeMinutes}`;

    let deadline: number;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        deadline = parseInt(stored, 10);
        if (isNaN(deadline) || deadline <= Date.now()) {
          deadline = Date.now() + durationMs;
          localStorage.setItem(storageKey, deadline.toString());
        }
      } else {
        deadline = Date.now() + durationMs;
        localStorage.setItem(storageKey, deadline.toString());
      }
    } catch {
      deadline = Date.now() + durationMs;
    }

    const tick = () => {
      const now = Date.now();
      let diff = deadline - now;

      if (diff <= 0) {
        deadline = Date.now() + durationMs;
        try {
          localStorage.setItem(storageKey, deadline.toString());
        } catch {}
        diff = durationMs;
      }

      const totalSec = Math.floor(diff / 1000);
      const d = Math.floor(totalSec / 86400);
      const h = Math.floor((totalSec % 86400) / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;

      setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [enabled, safeDays, safeHours, safeMinutes]);

  if (!enabled) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Should we show the days unit box? Yes if days were configured or currently > 0
  const hasDays = safeDays > 0 || timeLeft.days > 0;

  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-r from-amber-50/95 via-amber-50/70 to-orange-50/60 border border-amber-200/90 ${
        compact ? 'p-1.5 sm:px-2.5 sm:py-1.5' : 'p-2 sm:px-2.5 sm:py-2'
      } flex items-center justify-between gap-1 sm:gap-2 shadow-2xs ${className}`}
      title="عرض تخفيض سارٍ لفترة محدودة"
      dir="rtl"
    >
      {/* Right side: Urgent Label with animated indicator */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
        </span>
        <Clock className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-amber-600 animate-pulse shrink-0`} />
        <span className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-black text-amber-950 whitespace-nowrap`}>
          {label || 'لفترة محدودة'}
        </span>
      </div>

      {/* Left side: Beautiful, Distinct Digital Unit Boxes */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0" dir="ltr">
        {/* Days Box */}
        {hasDays && (
          <>
            <div className={`flex flex-col items-center justify-center ${compact ? 'min-w-[24px] sm:min-w-[28px] px-1 py-0.5' : 'min-w-[28px] sm:min-w-[32px] px-1 py-0.5'} rounded-lg bg-white border border-amber-200/90 shadow-2xs`}>
              <span className={`font-mono font-black ${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} text-slate-900 leading-tight`}>
                {pad(timeLeft.days)}
              </span>
              <span className={`text-[7px] ${compact ? 'sm:text-[8px]' : 'sm:text-[9px]'} font-bold text-amber-800 leading-none mt-0.5`}>
                يوم
              </span>
            </div>
            <span className="text-amber-500 font-black text-[11px] sm:text-xs pb-1 sm:pb-2 font-mono select-none">:</span>
          </>
        )}

        {/* Hours Box */}
        <div className={`flex flex-col items-center justify-center ${compact ? 'min-w-[24px] sm:min-w-[28px] px-1 py-0.5' : 'min-w-[28px] sm:min-w-[32px] px-1 py-0.5'} rounded-lg bg-white border border-amber-200/90 shadow-2xs`}>
          <span className={`font-mono font-black ${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} text-slate-900 leading-tight`}>
            {pad(timeLeft.hours)}
          </span>
          <span className={`text-[7px] ${compact ? 'sm:text-[8px]' : 'sm:text-[9px]'} font-bold text-amber-800 leading-none mt-0.5`}>
            ساعة
          </span>
        </div>

        <span className="text-amber-500 font-black text-[11px] sm:text-xs pb-1 sm:pb-2 font-mono select-none">:</span>

        {/* Minutes Box */}
        <div className={`flex flex-col items-center justify-center ${compact ? 'min-w-[24px] sm:min-w-[28px] px-1 py-0.5' : 'min-w-[28px] sm:min-w-[32px] px-1 py-0.5'} rounded-lg bg-white border border-amber-200/90 shadow-2xs`}>
          <span className={`font-mono font-black ${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} text-slate-900 leading-tight`}>
            {pad(timeLeft.minutes)}
          </span>
          <span className={`text-[7px] ${compact ? 'sm:text-[8px]' : 'sm:text-[9px]'} font-bold text-amber-800 leading-none mt-0.5`}>
            دقيقة
          </span>
        </div>

        <span className="text-amber-500 font-black text-[11px] sm:text-xs pb-1 sm:pb-2 font-mono select-none">:</span>

        {/* Seconds Box */}
        <div className={`flex flex-col items-center justify-center ${compact ? 'min-w-[24px] sm:min-w-[28px] px-1 py-0.5' : 'min-w-[28px] sm:min-w-[32px] px-1 py-0.5'} rounded-lg bg-white border border-amber-200/90 shadow-2xs`}>
          <span className={`font-mono font-black ${compact ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'} text-amber-900 leading-tight`}>
            {pad(timeLeft.seconds)}
          </span>
          <span className={`text-[7px] ${compact ? 'sm:text-[8px]' : 'sm:text-[9px]'} font-bold text-amber-700 leading-none mt-0.5`}>
            ثانية
          </span>
        </div>
      </div>
    </div>
  );
};
