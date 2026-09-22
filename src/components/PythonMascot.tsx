import React from "react";

interface PythonMascotProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  withGlow?: boolean;
  withCrown?: boolean;
}

export const PythonMascot: React.FC<PythonMascotProps> = ({
  size = "md",
  className = "",
  withGlow = false,
  withCrown = true,
}) => {
  const dimensionMap = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    hero: "w-36 h-36 sm:w-44 sm:h-44",
  };

  const dim = dimensionMap[size] || dimensionMap.md;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${dim} ${className}`}
      role="img"
      aria-label="Python Quest Serpent Mascot"
    >
      {withGlow && (
        <div className="absolute inset-0 bg-linear-to-tr from-amber-400/40 via-emerald-400/30 to-yellow-300/40 rounded-full blur-xl animate-pulse pointer-events-none" />
      )}

      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          {/* Gradient for Upper Serpent Body (Python Blue/Cyan to Emerald) */}
          <linearGradient id="serpentBody1" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#0284c7" />
            <stop offset="70%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Gradient for Lower Serpent Body (Python Gold to Amber) */}
          <linearGradient id="serpentBody2" x1="140" y1="140" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Scale Pattern Gradient */}
          <radialGradient id="scaleHighlight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* Golden Crown Gradient */}
          <linearGradient id="crownGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Eye Gradient */}
          <radialGradient id="eyeGlow" cx="40%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="85%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#854d0e" />
          </radialGradient>
        </defs>

        {/* Circular Background Aura */}
        <circle cx="80" cy="80" r="72" fill="#0f172a" fillOpacity="0.08" />

        {/* LOWER COIL (Golden Tail Wrapping Forward) */}
        <path
          d="M48 112 C 40 128, 62 144, 92 142 C 120 140, 136 122, 130 98 C 124 78, 102 72, 88 84 C 76 94, 68 112, 48 112 Z"
          fill="url(#serpentBody2)"
          stroke="#b45309"
          strokeWidth="3"
        />

        {/* Tail tip details */}
        <path
          d="M48 112 C 42 116, 32 120, 24 116 C 20 114, 22 108, 28 106 C 36 104, 44 108, 48 112 Z"
          fill="url(#serpentBody2)"
          stroke="#b45309"
          strokeWidth="2.5"
        />

        {/* Golden belly ridges */}
        <path d="M70 134 Q 85 138 102 134" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.4" strokeLinecap="round" />
        <path d="M78 124 Q 92 127 108 122" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />

        {/* UPPER SERPENT BODY (The Grand Python S-Curvature) */}
        <path
          d="M80 32 C 108 32, 126 50, 122 76 C 118 96, 96 102, 78 98 C 58 94, 44 82, 48 64 C 52 46, 64 32, 80 32 Z"
          fill="url(#serpentBody1)"
          stroke="#065f46"
          strokeWidth="3.5"
        />

        {/* SERPENT HEAD */}
        <ellipse cx="80" cy="52" rx="34" ry="26" fill="url(#serpentBody1)" stroke="#065f46" strokeWidth="3" />
        <ellipse cx="80" cy="50" rx="30" ry="22" fill="url(#scaleHighlight)" />

        {/* SNOUT / CHEEKS */}
        <ellipse cx="80" cy="62" rx="20" ry="12" fill="#34d399" />
        <ellipse cx="80" cy="62" rx="16" ry="9" fill="url(#scaleHighlight)" />

        {/* Nostrils */}
        <ellipse cx="74" cy="58" rx="2" ry="1.5" fill="#064e3b" />
        <ellipse cx="86" cy="58" rx="2" ry="1.5" fill="#064e3b" />

        {/* Friendly Python Smile */}
        <path
          d="M71 65 Q 80 73 89 65"
          stroke="#064e3b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Playful Pink Tongue */}
        <path
          d="M80 69 Q 80 75 77 78 M 77 78 L 74 81 M 77 78 L 80 81"
          stroke="#f43f5e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* EYES (Expressive, Intelligent, Cartoonish) */}
        {/* Left Eye */}
        <ellipse cx="65" cy="46" rx="9" ry="10" fill="#ffffff" stroke="#064e3b" strokeWidth="2" />
        <circle cx="66" cy="46" r="6" fill="#0f172a" />
        <circle cx="66" cy="46" r="4.5" fill="url(#eyeGlow)" />
        <circle cx="66" cy="46" r="3" fill="#0f172a" />
        <circle cx="64" cy="43" r="2" fill="#ffffff" />
        <circle cx="68" cy="48" r="0.8" fill="#ffffff" />

        {/* Right Eye */}
        <ellipse cx="95" cy="46" rx="9" ry="10" fill="#ffffff" stroke="#064e3b" strokeWidth="2" />
        <circle cx="94" cy="46" r="6" fill="#0f172a" />
        <circle cx="94" cy="46" r="4.5" fill="url(#eyeGlow)" />
        <circle cx="94" cy="46" r="3" fill="#0f172a" />
        <circle cx="92" cy="43" r="2" fill="#ffffff" />
        <circle cx="96" cy="48" r="0.8" fill="#ffffff" />

        {/* Friendly Eyebrows */}
        <path d="M57 37 Q 66 33 72 38" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M103 37 Q 94 33 88 38" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* GOLDEN QUEST CROWN (Optional / Signature) */}
        {withCrown && (
          <g transform="translate(0, -6)">
            <path
              d="M66 26 L 68 12 L 75 19 L 80 9 L 85 19 L 92 12 L 94 26 Z"
              fill="url(#crownGold)"
              stroke="#854d0e"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* Jewels on crown */}
            <circle cx="80" cy="12" r="1.8" fill="#ef4444" />
            <circle cx="69" cy="15" r="1.5" fill="#3b82f6" />
            <circle cx="91" cy="15" r="1.5" fill="#10b981" />
            <rect x="67" y="24" width="26" height="3" rx="1.5" fill="#fef08a" stroke="#854d0e" strokeWidth="0.8" />
          </g>
        )}

        {/* Python Iconic Code Bracket Orb in Tail */}
        <g transform="translate(98, 86)">
          <circle cx="16" cy="16" r="15" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          {/* Blue/Yellow Python code icon */}
          <path d="M11 12 H 18 V 16 H 13" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M21 20 H 14 V 16 H 19" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="13" cy="14" r="0.8" fill="#38bdf8" />
          <circle cx="19" cy="18" r="0.8" fill="#fbbf24" />
        </g>
      </svg>
    </div>
  );
};
