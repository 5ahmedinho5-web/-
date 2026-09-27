import React, { useId } from 'react';

interface NajmaLogoProps {
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Signature Brand Logo for "نجمة":
 * - Unified SVG Brandmark matching the exact screenshot design
 * - Majestic Arabic calligraphy in El Messiri font
 * - Smooth golden crescent swoosh curving gracefully right beneath the letters
 */
export const NajmaLogo: React.FC<NajmaLogoProps> = ({
  className = '',
  color = '#006644',
  size = 'md',
  onClick,
}) => {
  const uniqueId = useId().replace(/:/g, '');

  const config = {
    sm: {
      textSize: 'text-2xl',
      swooshWidth: 74,
      swooshHeight: 10,
      marginTop: '-mt-1',
    },
    md: {
      textSize: 'text-3xl sm:text-3.5xl',
      swooshWidth: 96,
      swooshHeight: 12,
      marginTop: '-mt-1.5 sm:-mt-2',
    },
    lg: {
      textSize: 'text-4xl sm:text-5xl',
      swooshWidth: 126,
      swooshHeight: 15,
      marginTop: '-mt-2 sm:-mt-2.5',
    },
    xl: {
      textSize: 'text-5xl sm:text-6xl',
      swooshWidth: 160,
      swooshHeight: 18,
      marginTop: '-mt-2.5 sm:-mt-3',
    },
  }[size];

  const brandGreen = color === '#006644' ? '#006644' : color;

  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center select-none cursor-pointer group leading-none ${className}`}
      dir="rtl"
    >
      {/* 1. HTML Cursive Connected Arabic Text (Native CoreText/HarfBuzz layout ensures 100% connected Arabic) */}
      <span
        className={`font-['Aref_Ruqaa',cursive] font-bold ${config.textSize} transition-transform duration-200 group-hover:scale-105 inline-block leading-tight select-none tracking-normal px-0.5`}
        style={{
          fontFamily: "'Aref Ruqaa', cursive",
          color: brandGreen,
          textShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        نجمة
      </span>

      {/* 2. Signature Calligraphic Golden Swoosh Underline */}
      <div className={`relative flex items-center justify-center pointer-events-none ${config.marginTop}`}>
        <svg
          viewBox="0 0 110 14"
          width={config.swooshWidth}
          height={config.swooshHeight}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`goldGrad-${uniqueId}`} x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#bfa15f" />
              <stop offset="30%" stopColor="#f0dc99" />
              <stop offset="65%" stopColor="#d4b46c" />
              <stop offset="100%" stopColor="#9c7a33" />
            </linearGradient>
            <filter id={`goldGlow-${uniqueId}`} x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="0.5" stdDeviation="0.6" floodColor="#bfa15f" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Smooth, elegant golden crescent swoosh curving gracefully under "نجمة" */}
          <path
            d="M 104 3 C 74 12, 34 12, 6 5 C 26 10, 72 10, 104 3 Z"
            fill={`url(#goldGrad-${uniqueId})`}
            filter={`url(#goldGlow-${uniqueId})`}
          />
        </svg>
      </div>
    </div>
  );
};
