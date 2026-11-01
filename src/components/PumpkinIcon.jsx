import React from 'react';

/**
 * High-quality Jack-o'-Lantern Pumpkin SVG
 */
export function PumpkinSVG({ className = "w-7 h-7", glow = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} ${glow ? 'scale-110' : ''} transition-transform duration-200`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pumpkin Stem */}
      <path
        d="M50 20 C48 10 56 4 63 3 C61 9 57 14 53 20 Z"
        fill="#22c55e"
        stroke="#15803d"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Pumpkin Outer Lobes (Shadow/Depth) */}
      <ellipse cx="32" cy="56" rx="20" ry="26" fill="#ea580c" />
      <ellipse cx="68" cy="56" rx="20" ry="26" fill="#ea580c" />
      
      {/* Pumpkin Middle Lobes */}
      <ellipse cx="40" cy="57" rx="19" ry="28" fill="#f97316" />
      <ellipse cx="60" cy="57" rx="19" ry="28" fill="#f97316" />
      
      {/* Pumpkin Center Lobe */}
      <ellipse cx="50" cy="58" rx="18" ry="29" fill="#fb923c" />

      {/* Pumpkin Highlight Rim */}
      <path
        d="M32 35 C42 30 58 30 68 35"
        stroke="#fed7aa"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Carved Left Eye */}
      <polygon
        points="37,45 44,53 32,53"
        fill="#180b02"
        stroke="#7c2d12"
        strokeWidth="1"
      />
      
      {/* Carved Right Eye */}
      <polygon
        points="63,45 68,53 56,53"
        fill="#180b02"
        stroke="#7c2d12"
        strokeWidth="1"
      />

      {/* Carved Nose */}
      <polygon
        points="50,54 53,60 47,60"
        fill="#180b02"
        stroke="#7c2d12"
        strokeWidth="0.8"
      />

      {/* Carved Wicked Smile */}
      <path
        d="M30 66 
           C 35 72, 40 76, 50 76 
           C 60 76, 65 72, 70 66 
           L 66 69 L 63 66 L 59 70 L 55 66 L 50 71 L 45 66 L 41 70 L 37 66 L 34 69 Z"
        fill="#180b02"
        stroke="#7c2d12"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Inner glow inside mouth & eyes */}
      <polygon points="38,47 42,52 35,52" fill="#ffd166" opacity="0.6" />
      <polygon points="62,47 66,52 59,52" fill="#ffd166" opacity="0.6" />
      <path d="M38 69 Q50 75 62 69" stroke="#ffd166" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}

/**
 * Returns raw HTML string for Leaflet DivIcon (GPU-Accelerated, zero expensive drop-shadow filters)
 */
export function getPumpkinMarkerHtml(isActive = false) {
  const activeClass = isActive ? 'is-active' : '';
  return `
    <div class="pumpkin-marker ${activeClass}">
      <div class="pumpkin-aura"></div>
      <svg viewBox="0 0 100 100" class="pumpkin-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 20 C48 10 56 4 63 3 C61 9 57 14 53 20 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.5" stroke-linejoin="round"/>
        <ellipse cx="32" cy="56" rx="20" ry="26" fill="#ea580c"/>
        <ellipse cx="68" cy="56" rx="20" ry="26" fill="#ea580c"/>
        <ellipse cx="40" cy="57" rx="19" ry="28" fill="#f97316"/>
        <ellipse cx="60" cy="57" rx="19" ry="28" fill="#f97316"/>
        <ellipse cx="50" cy="58" rx="18" ry="29" fill="#fb923c"/>
        <polygon points="37,45 44,53 32,53" fill="#180b02" stroke="#7c2d12" stroke-width="1"/>
        <polygon points="63,45 68,53 56,53" fill="#180b02" stroke="#7c2d12" stroke-width="1"/>
        <polygon points="50,54 53,60 47,60" fill="#180b02" stroke="#7c2d12" stroke-width="0.8"/>
        <path d="M30 66 C 35 72, 40 76, 50 76 C 60 76, 65 72, 70 66 L 66 69 L 63 66 L 59 70 L 55 66 L 50 71 L 45 66 L 41 70 L 37 66 L 34 69 Z" fill="#180b02" stroke="#7c2d12" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="38,47 42,52 35,52" fill="#ffd166" opacity="0.8"/>
        <polygon points="62,47 66,52 59,52" fill="#ffd166" opacity="0.8"/>
        <path d="M38 69 Q50 75 62 69" stroke="#ffd166" stroke-width="1.5" fill="none" opacity="0.8"/>
      </svg>
    </div>
  `;
}

/**
 * Returns raw HTML string for the Orange Circle Ring Marker (Generator Click Pick)
 */
export function getOrangeCircleMarkerHtml() {
  return `
    <div class="orange-circle-pin"></div>
  `;
}

export default PumpkinSVG;
