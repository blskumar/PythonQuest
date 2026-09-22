import React from "react";

interface PythonQuestLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  variant?: "full" | "icon" | "horizontal" | "badge";
  className?: string;
  withGlow?: boolean;
}

/**
 * High-fidelity vector rendition of the official Python Quest Master Logo & Mascot:
 * Features the blue explorer reptile with round spectacles, holding the glowing Python
 * lightbulb, the 3D 'Python Quest' typography with compass-needle inside the 'Q',
 * and the 'Explore • Learn • Create • Evolve' motto.
 */
export const PythonQuestLogo: React.FC<PythonQuestLogoProps> = ({
  size = "md",
  variant = "horizontal",
  className = "",
  withGlow = false,
}) => {
  // Dimensions for different sizes
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    hero: "w-40 h-40 sm:w-56 sm:h-56",
  };

  if (variant === "icon") {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${iconDimensions[size]} ${className}`}
        role="img"
        aria-label="Python Quest Explorer Mascot"
      >
        {withGlow && (
          <div className="absolute inset-0 bg-linear-to-tr from-amber-400/40 via-sky-400/30 to-yellow-300/40 rounded-3xl blur-xl animate-pulse pointer-events-none" />
        )}
        <svg
          viewBox="0 0 160 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md select-none"
        >
          <defs>
            <linearGradient id="pqLizardBlue" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="pqBellyYellow" x1="40" y1="70" x2="110" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <radialGradient id="pqBulbGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <linearGradient id="pqGoldCompass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Background Rounded Shield */}
          <rect x="8" y="8" width="144" height="144" rx="36" fill="#0f172a" fillOpacity="0.06" />
          <rect x="8" y="8" width="144" height="144" rx="36" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.3" />

          {/* Back Backpack Strap */}
          <path d="M50 78 C42 86, 42 108, 54 116" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />

          {/* Explorer Reptile Body (Blue) */}
          <path
            d="M52 130 C45 105, 54 75, 78 68 C102 62, 118 78, 114 106 C110 128, 92 138, 52 130 Z"
            fill="url(#pqLizardBlue)"
            stroke="#0369a1"
            strokeWidth="3"
          />

          {/* Yellow Belly & Ridges */}
          <path
            d="M62 128 C58 110, 64 88, 82 82 C94 78, 102 90, 98 112 C95 125, 84 132, 62 128 Z"
            fill="url(#pqBellyYellow)"
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <path d="M66 102 Q 80 100 90 106" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
          <path d="M68 114 Q 80 112 88 118" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />

          {/* Golden Spots on Blue Back */}
          <circle cx="106" cy="92" r="5" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="104" cy="110" r="4" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="94" cy="74" r="3.5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

          {/* Head */}
          <ellipse cx="80" cy="52" rx="32" ry="26" fill="url(#pqLizardBlue)" stroke="#0369a1" strokeWidth="3" />
          <path d="M72 40 C66 30, 84 28, 88 38" fill="url(#pqLizardBlue)" stroke="#0369a1" strokeWidth="2" />

          {/* Cheerful Mouth / Smile with Pink Tongue */}
          <path d="M66 62 Q 80 74 96 62" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M74 68 Q 80 78 86 68 Z" fill="#f43f5e" />

          {/* Glasses Frame (Round Black Spectacles) */}
          {/* Left Lens */}
          <circle cx="68" cy="50" r="13" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
          <circle cx="70" cy="49" r="6" fill="#1e293b" />
          <circle cx="72" cy="47" r="2.5" fill="#ffffff" />
          <circle cx="68" cy="52" r="1.2" fill="#ffffff" />

          {/* Right Lens */}
          <circle cx="92" cy="50" r="13" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
          <circle cx="90" cy="49" r="6" fill="#1e293b" />
          <circle cx="92" cy="47" r="2.5" fill="#ffffff" />
          <circle cx="88" cy="52" r="1.2" fill="#ffffff" />

          {/* Glasses Bridge and Temple */}
          <path d="M78 49 Q 80 47 82 49" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
          <path d="M57 48 L48 44" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M103 48 L112 44" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" />

          {/* Raised Arm Holding Python Lightbulb */}
          <path d="M102 78 C116 72, 126 56, 122 42" stroke="#0284c7" strokeWidth="8" strokeLinecap="round" />

          {/* Lightbulb Glow Aura & Rays */}
          <circle cx="126" cy="34" r="19" fill="url(#pqBulbGlow)" opacity="0.35" />
          <line x1="126" y1="10" x2="126" y2="6" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="144" y1="18" x2="148" y2="15" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="108" y1="18" x2="104" y2="15" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Lightbulb Glass Bulb */}
          <path
            d="M120 42 C116 38, 116 28, 122 24 C128 20, 134 24, 136 30 C138 36, 134 40, 130 42 Z"
            fill="url(#pqBulbGlow)"
            stroke="#d97706"
            strokeWidth="2"
          />
          {/* Bulb Screw Base */}
          <rect x="122" y="42" width="8" height="5" rx="1.5" fill="#64748b" stroke="#334155" strokeWidth="1" />

          {/* Mini Python Logo inside Bulb */}
          {/* Blue Snake Half */}
          <path
            d="M125 28 C125 26, 129 26, 129 28 L129 31 L126 31 C124 31, 124 32, 124 33"
            stroke="#0284c7"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Yellow Snake Half */}
          <path
            d="M127 34 C127 36, 123 36, 123 34 L123 31 L126 31 C128 31, 128 30, 128 29"
            stroke="#eab308"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mini Compass Accent in Bottom Corner */}
          <circle cx="36" cy="124" r="16" fill="#fef3c7" stroke="url(#pqGoldCompass)" strokeWidth="3" />
          <polygon points="36,112 40,124 36,128 32,124" fill="#dc2626" />
          <polygon points="36,136 40,124 36,120 32,124" fill="#1e293b" />
          <circle cx="36" cy="124" r="2.5" fill="#f59e0b" />
        </svg>
      </div>
    );
  }

  // Horizontal navbar format with Mascot Icon + 3D Styled Typography
  if (variant === "horizontal") {
    return (
      <div className={`flex items-center space-x-2 sm:space-x-3 text-left select-none max-w-full ${className}`}>
        {/* Mascot Mark */}
        <div className="relative shrink-0">
          <PythonQuestLogo size={size === "sm" ? "sm" : "md"} variant="icon" withGlow={withGlow} />
        </div>

        {/* Wordmark Typography */}
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-1.5 leading-none">
            {/* 3D Styled 'Python' */}
            <span
              className="font-black text-lg sm:text-2xl tracking-tight text-slate-900 drop-shadow-xs"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 1px 2px rgba(15, 23, 42, 0.12)",
              }}
            >
              Python
            </span>

            {/* 3D Gold 'Quest' with Compass 'Q' */}
            <span
              className="font-black text-lg sm:text-2xl tracking-tight bg-linear-to-r from-amber-500 via-amber-600 to-yellow-500 bg-clip-text text-transparent flex items-center"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                filter: "drop-shadow(0 1px 1px rgba(180, 83, 9, 0.3))",
              }}
            >
              <span className="relative inline-flex items-center justify-center">
                Quest
              </span>
            </span>

            {/* Explorer Badge */}
            <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-linear-to-r from-amber-100 to-yellow-100 text-amber-900 border border-amber-300 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Academy</span>
            </span>
          </div>

          {/* Official Motto from Logo Ribbon - hidden on small mobile to conserve horizontal space */}
          <div className="hidden sm:flex items-center space-x-1 text-[11px] text-slate-500 font-bold tracking-tight mt-0.5">
            <span className="text-amber-600">Explore</span>
            <span>•</span>
            <span className="text-indigo-600">Learn</span>
            <span>•</span>
            <span className="text-emerald-600">Create</span>
            <span>•</span>
            <span className="text-blue-600">Evolve</span>
          </div>
        </div>
      </div>
    );
  }

  // Master Badge / Hero Emblem
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center text-center select-none ${className}`}
      role="img"
      aria-label="Python Quest Master Brand Emblem"
    >
      {/* Outer ambient glow */}
      {withGlow && (
        <div className="absolute -inset-4 bg-linear-to-tr from-amber-500/20 via-sky-400/20 to-yellow-400/20 rounded-3xl blur-2xl pointer-events-none" />
      )}

      {/* SVG Canvas for Master Emblem */}
      <div className={`${iconDimensions[size]} relative`}>
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xl"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="emblemLizardBlue" x1="100" y1="50" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="emblemBelly" x1="140" y1="120" x2="240" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            <radialGradient id="emblemBulbLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            <linearGradient id="woodSign" x1="50" y1="280" x2="350" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#92400e" />
              <stop offset="100%" stopColor="#582606" />
            </linearGradient>

            <linearGradient id="ribbonScroll" x1="70" y1="340" x2="330" y2="380" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#ffedd5" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>

            <linearGradient id="goldCompassRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>

            <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================================
              WOODEN BASE PLAQUE & NATURE LEAVES
             ======================================================== */}
          {/* Leaves Behind Sign */}
          <path d="M40 290 C20 260, 45 230, 80 260 C75 285, 55 300, 40 290 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
          <path d="M48 270 Q 60 275 70 268" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
          <path d="M355 285 C380 255, 355 225, 320 255 C325 280, 345 295, 355 285 Z" fill="#22c55e" stroke="#15803d" strokeWidth="3" />
          <path d="M350 265 Q 338 270 330 262" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />

          {/* Wooden Sign Base Plaque */}
          <path
            d="M50 280 C60 265, 340 265, 350 280 C360 295, 355 350, 340 360 C320 375, 80 375, 60 360 C45 350, 40 295, 50 280 Z"
            fill="url(#woodSign)"
            stroke="#451a03"
            strokeWidth="5"
          />
          {/* Wood Plaque Screws/Rivets */}
          <circle cx="70" cy="300" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <circle cx="330" cy="300" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <line x1="68" y1="300" x2="72" y2="300" stroke="#334155" strokeWidth="1.5" />
          <line x1="328" y1="300" x2="332" y2="300" stroke="#334155" strokeWidth="1.5" />

          {/* ========================================================
              COMPASS (RIGHT SIDE BEHIND MASCOT)
             ======================================================== */}
          <g transform="translate(265, 120)">
            {/* Top Loop */}
            <circle cx="50" cy="0" r="14" fill="none" stroke="url(#goldCompassRim)" strokeWidth="6" />
            {/* Compass Case */}
            <circle cx="50" cy="50" r="48" fill="#fef3c7" stroke="url(#goldCompassRim)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="#fffbeb" stroke="#b45309" strokeWidth="2" />
            {/* Compass Dial markings */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3 4" />
            <text x="50" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#78350f">N</text>
            <text x="76" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">E</text>
            <text x="50" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">S</text>
            <text x="24" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">W</text>
            {/* Compass Needle */}
            <polygon points="50,22 55,50 50,55 45,50" fill="#dc2626" />
            <polygon points="50,78 55,50 50,45 45,50" fill="#1e293b" />
            <circle cx="50" cy="50" r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          </g>

          {/* ========================================================
              STACK OF BOOKS (LEFT SIDE: LEARN, PRACTICE, BUILD, GROW)
             ======================================================== */}
          {/* Bottom Book: GROW (Purple) */}
          <rect x="25" y="236" width="70" height="15" rx="3" fill="#7e22ce" stroke="#581c87" strokeWidth="2" />
          <text x="60" y="247" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ffffff" letterSpacing="1">GROW</text>
          {/* Book 2: BUILD (Orange) */}
          <rect x="28" y="220" width="68" height="15" rx="3" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <text x="62" y="231" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ffffff" letterSpacing="1">BUILD</text>
          {/* Book 3: PRACTICE (Blue) */}
          <rect x="26" y="204" width="72" height="15" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
          <text x="62" y="215" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#ffffff" letterSpacing="0.5">PRACTICE</text>
          {/* Book 4: LEARN (Green) */}
          <rect x="30" y="188" width="66" height="15" rx="3" fill="#16a34a" stroke="#15803d" strokeWidth="2" />
          <text x="63" y="199" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ffffff" letterSpacing="1">LEARN</text>

          {/* Open Laptop with Python Logo */}
          <polygon points="80,150 165,150 185,215 100,215" fill="#334155" stroke="#1e293b" strokeWidth="3" />
          <polygon points="84,153 161,153 178,208 101,208" fill="#1e293b" />
          {/* Python Logo on Laptop Lid */}
          <circle cx="138" cy="180" r="14" fill="#0f172a" />
          <path d="M134 174 C134 170 142 170 142 174 L142 180 L137 180" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M142 186 C142 190 134 190 134 186 L134 180 L139 180" stroke="#facc15" strokeWidth="3.5" strokeLinecap="round" fill="none" />

          {/* ========================================================
              BLUE EXPLORER REPTILE MASCOT (CENTER)
             ======================================================== */}
          {/* Backpack Straps */}
          <path d="M150 140 C130 160, 130 210, 155 235" stroke="#92400e" strokeWidth="12" strokeLinecap="round" />
          <path d="M230 140 C245 160, 245 200, 230 230" stroke="#92400e" strokeWidth="10" strokeLinecap="round" />

          {/* Body */}
          <path
            d="M135 240 C120 180, 140 120, 195 105 C250 95, 280 125, 275 190 C270 240, 225 260, 135 240 Z"
            fill="url(#emblemLizardBlue)"
            stroke="#0369a1"
            strokeWidth="5"
          />

          {/* Yellow Belly with Segmentation */}
          <path
            d="M160 238 C148 200, 160 150, 205 135 C230 125, 250 150, 245 195 C240 225, 215 245, 160 238 Z"
            fill="url(#emblemBelly)"
            stroke="#ca8a04"
            strokeWidth="3.5"
          />
          <path d="M170 175 Q 195 170 225 180" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M172 195 Q 195 190 220 200" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M174 215 Q 195 210 215 220" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />

          {/* Golden Yellow Spots on Blue Skin */}
          <circle cx="260" cy="155" r="9" fill="#fde047" stroke="#ca8a04" strokeWidth="2.5" />
          <circle cx="255" cy="190" r="7.5" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="230" cy="115" r="6" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />

          {/* Mascot Head */}
          <ellipse cx="195" cy="80" rx="60" ry="50" fill="url(#emblemLizardBlue)" stroke="#0369a1" strokeWidth="5" />
          {/* Top Head crest */}
          <path d="M185 36 C170 18, 210 18, 215 36" fill="url(#emblemLizardBlue)" stroke="#0369a1" strokeWidth="4" />

          {/* Big Open Smile with Tongue */}
          <path d="M168 95 Q 195 118 226 95" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M182 105 Q 195 124 210 105 Z" fill="#f43f5e" />

          {/* Round Black Glasses Frame */}
          {/* Left Eyeball & Glasses */}
          <circle cx="170" cy="74" r="24" fill="#ffffff" stroke="#0f172a" strokeWidth="7" />
          <circle cx="174" cy="72" r="11" fill="#1e293b" />
          <circle cx="178" cy="68" r="4.5" fill="#ffffff" />
          <circle cx="170" cy="76" r="2" fill="#ffffff" />

          {/* Right Eyeball & Glasses */}
          <circle cx="216" cy="74" r="24" fill="#ffffff" stroke="#0f172a" strokeWidth="7" />
          <circle cx="212" cy="72" r="11" fill="#1e293b" />
          <circle cx="216" cy="68" r="4.5" fill="#ffffff" />
          <circle cx="208" cy="76" r="2" fill="#ffffff" />

          {/* Glasses Bridge and Temples */}
          <path d="M192 73 Q 195 70 196 73" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" />
          <path d="M148 70 L135 62" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
          <path d="M238 70 L252 62" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />

          {/* ========================================================
              GLOWING PYTHON LIGHTBULB (RIGHT HAND)
             ======================================================== */}
          {/* Raised Arm */}
          <path d="M245 130 C275 115, 290 85, 282 55" stroke="#0284c7" strokeWidth="15" strokeLinecap="round" />

          {/* Lightbulb Glow Rays & Background Aura */}
          <circle cx="295" cy="40" r="45" fill="url(#emblemBulbLight)" opacity="0.3" filter="url(#dropGlow)" />
          <line x1="295" y1="8" x2="295" y2="0" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="330" y1="18" x2="338" y2="12" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="260" y1="18" x2="252" y2="12" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="345" y1="45" x2="355" y2="45" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

          {/* Glass Lightbulb Bulb */}
          <path
            d="M280 55 C272 45, 272 25, 285 16 C298 7, 312 15, 316 26 C320 38, 312 48, 304 55 Z"
            fill="url(#emblemBulbLight)"
            stroke="#d97706"
            strokeWidth="3.5"
          />
          {/* Bulb Metal Base */}
          <rect x="286" y="55" width="16" height="8" rx="2" fill="#64748b" stroke="#334155" strokeWidth="2" />

          {/* Python Logo Inside Bulb */}
          <path
            d="M292 28 C292 23, 302 23, 302 28 L302 34 L296 34 C292 34, 292 37, 292 39"
            stroke="#0284c7"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="296" cy="27" r="1.5" fill="#ffffff" />
          <path
            d="M298 42 C298 47, 288 47, 288 42 L288 36 L294 36 C298 36, 298 33, 298 31"
            stroke="#eab308"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="294" cy="43" r="1.5" fill="#78350f" />

          {/* ========================================================
              3D TYPOGRAPHY: "Python Quest"
             ======================================================== */}
          {/* "Python" White 3D Text with Deep Blue Contour */}
          <g transform="translate(200, 240)">
            {/* 3D Extrusion Shadow */}
            <text x="0" y="8" textAnchor="middle" fontSize="62" fontWeight="900" fill="#0c4a6e" letterSpacing="0.5">
              Python
            </text>
            <text x="0" y="4" textAnchor="middle" fontSize="62" fontWeight="900" fill="#0284c7" letterSpacing="0.5">
              Python
            </text>
            {/* Front White Face */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontSize="62"
              fontWeight="900"
              fill="#ffffff"
              stroke="#0369a1"
              strokeWidth="3"
              letterSpacing="0.5"
            >
              Python
            </text>
          </g>

          {/* "Quest" Golden 3D Text with Compass Needle in 'Q' */}
          <g transform="translate(200, 310)">
            {/* 3D Extrusion */}
            <text x="0" y="8" textAnchor="middle" fontSize="72" fontWeight="900" fill="#78350f" letterSpacing="1">
              Quest
            </text>
            <text x="0" y="4" textAnchor="middle" fontSize="72" fontWeight="900" fill="#b45309" letterSpacing="1">
              Quest
            </text>
            {/* Front Gold Face */}
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fontSize="72"
              fontWeight="900"
              fill="#fde047"
              stroke="#ca8a04"
              strokeWidth="3"
              letterSpacing="1"
            >
              Quest
            </text>

            {/* Compass Needle inside the Q */}
            <g transform="translate(-104, -20)">
              <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
              <polygon points="0,-13 4,0 0,3 -4,0" fill="#f59e0b" />
              <polygon points="0,13 4,0 0,-3 -4,0" fill="#ffffff" />
              <circle cx="0" cy="0" r="3" fill="#dc2626" />
            </g>
          </g>

          {/* ========================================================
              BOTTOM SCROLL RIBBON: "Explore • Learn • Create • Evolve"
             ======================================================== */}
          <path
            d="M80 345 C120 340, 280 340, 320 345 C335 352, 330 375, 315 378 C280 384, 120 384, 85 378 C70 375, 65 352, 80 345 Z"
            fill="url(#ribbonScroll)"
            stroke="#9a3412"
            strokeWidth="3"
          />
          {/* Ribbon Ends */}
          <polygon points="75,348 55,360 75,372 65,360" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <polygon points="325,348 345,360 325,372 335,360" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />

          {/* Ribbon Text */}
          <text
            x="200"
            y="366"
            textAnchor="middle"
            fontSize="12.5"
            fontWeight="bold"
            fill="#78350f"
            letterSpacing="1.2"
          >
            Explore • Learn • Create • Evolve
          </text>
        </svg>
      </div>
    </div>
  );
};
