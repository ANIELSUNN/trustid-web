import React from 'react';

export default function TrustIDLogo({ size = 40, withText = true, textColor = '#1a2e28' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.28 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="trustid-shield" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#1a9f74" />
            <stop offset="1" stopColor="#00664f" />
          </linearGradient>
        </defs>
        <path
          d="M32 4 L56 13 V29 C56 45 46 56 32 61 C18 56 8 45 8 29 V13 Z"
          fill="url(#trustid-shield)"
        />
        <path
          d="M32 8 L52 15.5 V29 C52 42.5 43.5 51.8 32 56.4 C20.5 51.8 12 42.5 12 29 V15.5 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          opacity="0.55"
        />
        <g stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M22 32 a10 10 0 0 1 20 0" />
          <path d="M25 32 a7 7 0 0 1 14 0 c0 4 -2 6 -3 8" />
          <path d="M28 32 a4 4 0 0 1 8 0 c0 5 -2 8 -4.5 11" />
        </g>
        <path
          d="M24 33 L30 39 L41 26"
          stroke="#ffffff"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span style={{ fontSize: size * 0.55, fontWeight: 800, letterSpacing: -0.5, color: textColor }}>
          Trust<span style={{ color: '#1a9f74' }}>ID</span>
        </span>
      )}
    </div>
  );
}
