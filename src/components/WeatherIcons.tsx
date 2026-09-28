import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: 'grid' | 'chart' | 'globe' | 'cal' | 'gear' | 'out' | 'plus' | 'search' | 'bell' | 'pin' | 'wind' | 'drop' | 'gust' | 'cloud' | 'cloud2' | 'hail' | 'sun' | 'avatar';
  size?: number | string;
}

export const WeatherIcon: React.FC<IconProps> = ({ name, size = 24, className = '', ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <use href={`#i-${name}`} />
    </svg>
  );
};

export const LogoSvg: React.FC<{ size?: number | string; className?: string }> = ({ size = 40, className = '' }) => {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-label="Aurora Weather Logo">
      <defs>
        <clipPath id="logo-clip-inner">
          <circle cx="20" cy="20" r="13" />
        </clipPath>
      </defs>
      <rect width="40" height="40" rx="12" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
      <g clipPath="url(#logo-clip-inner)" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 11 Q12 9 20 11 T36 11" />
        <path d="M4 14 Q12 12 20 14 T36 14" />
        <path d="M4 17 Q12 15 20 17 T36 17" />
        <path d="M4 20 Q12 18 20 20 T36 20" />
        <path d="M4 23 Q12 21 20 23 T36 23" />
        <path d="M4 26 Q12 24 20 26 T36 26" />
        <path d="M4 29 Q12 27 20 29 T36 29" />
      </g>
    </svg>
  );
};
