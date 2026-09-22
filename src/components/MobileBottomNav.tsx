import React from "react";
import {
  Compass,
  BookOpen,
  LayoutDashboard,
  Award,
  Trophy,
  Zap,
  Terminal,
  Lock,
} from "lucide-react";
import { DeviceInfo } from "../utils/useDevice";

interface MobileBottomNavProps {
  activeTab:
    | "home"
    | "curriculum"
    | "dashboard"
    | "certificates"
    | "scratchpad"
    | "daily-challenge"
    | "leaderboard";
  onTabChange: (
    tab:
      | "home"
      | "curriculum"
      | "dashboard"
      | "certificates"
      | "scratchpad"
      | "daily-challenge"
      | "leaderboard"
  ) => void;
  device: DeviceInfo;
  isDailyChallengeDone?: boolean;
  isAuthenticated?: boolean;
}

interface NavItem {
  id:
    | "home"
    | "curriculum"
    | "dashboard"
    | "certificates"
    | "scratchpad"
    | "daily-challenge"
    | "leaderboard";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  device,
  isDailyChallengeDone = false,
  isAuthenticated = false,
}) => {
  const navItems: NavItem[] = [
    { id: "home", label: "Overview", icon: Compass },
    { id: "curriculum", label: "Chapters", icon: BookOpen },
    {
      id: "daily-challenge",
      label: "Daily",
      icon: Zap,
      badge: !isDailyChallengeDone ? "+50" : undefined,
    },
    { id: "leaderboard", label: "Ranks", icon: Trophy },
    { id: "dashboard", label: "Stats", icon: LayoutDashboard },
    { id: "scratchpad", label: "Sandbox", icon: Terminal },
    { id: "certificates", label: "Awards", icon: Award },
  ];

  const isAndroid = device.isAndroid;
  const isIOS = device.isIOS;

  return (
    <nav
      id="mobile-bottom-navigation-bar"
      aria-label="Mobile Bottom Navigation"
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 safe-pb shadow-[0_-4px_20px_rgba(0,0,0,0.06)] transition-all ${
        isAndroid ? "border-slate-300 font-sans" : isIOS ? "rounded-t-2xl shadow-xl" : ""
      }`}
    >
      <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all select-none min-w-[46px] min-h-[46px] ${
                isActive
                  ? isAndroid
                    ? "bg-amber-100/90 text-amber-950 font-bold"
                    : "text-amber-600 font-bold"
                  : "text-slate-500 hover:text-slate-900 active:scale-95"
              }`}
            >
              {/* Active indicator dot or pill */}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-amber-600 stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 bg-orange-500 text-white text-[9px] font-black px-1 py-0.2 rounded-full shadow-2xs leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-0.5 leading-none ${
                  isActive ? "text-amber-900 font-extrabold" : "text-slate-500 font-medium"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
