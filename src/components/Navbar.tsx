import React, { useState } from "react";
import {
  Code2,
  Trophy,
  Sparkles,
  Flame,
  User,
  GraduationCap,
  Baby,
  Briefcase,
  Terminal,
  LayoutDashboard,
  BookOpen,
  Award,
  Edit2,
  Check,
  CheckCircle2,
  Zap,
  LogIn,
  LogOut,
  Compass,
  Info,
  ChevronDown,
  Smartphone,
  Monitor,
  X,
  Lock,
} from "lucide-react";
import { LearnerMode, UserProgress } from "../types";
import { getDailyPuzzle } from "../data/dailyPuzzles";
import { PythonMascot } from "./PythonMascot";
import { PythonQuestLogo } from "./PythonQuestLogo";
import { useDevice } from "../utils/useDevice";

interface NavbarProps {
  progress: UserProgress;
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
  onModeChange: (mode: LearnerMode) => void;
  onNameChange: (name: string) => void;
  availableClaimsCount: number;
  onOpenAuth?: (mode?: "login" | "register", gateMessage?: string) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  activeTab,
  onTabChange,
  onModeChange,
  onNameChange,
  availableClaimsCount,
  onOpenAuth,
  onLogout,
}) => {
  const device = useDevice();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.learnerName);
  const [mobileTrackMenuOpen, setMobileTrackMenuOpen] = useState(false);
  const [deviceInfoOpen, setDeviceInfoOpen] = useState(false);

  const isLoggedIn = Boolean(progress.user?.isAuthenticated);

  const todayPuzzle = getDailyPuzzle();
  const isTodayPuzzleDone = (progress.completedDailyChallenges || []).some(
    (c) => c.puzzleId === todayPuzzle.id
  );

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onNameChange(tempName.trim());
    }
    setIsEditingName(false);
  };

  const modeConfig = {
    child: {
      label: "Junior Explorer",
      title: "Young Explorer (Kids)",
      ageRange: "Ages 7–12",
      icon: Baby,
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      activeBg: "bg-emerald-600 text-white shadow-xs font-bold",
      accentColor: "text-emerald-400",
      whatItIs: "Storybook & interactive learning track tailored for young beginners.",
      whatClickingDoes:
        "Adapts all chapter lessons, code examples, and exercise hints into fun visual metaphors (Python pets, toy boxes for variables, recipe spells for functions) without dry jargon.",
    },
    student: {
      label: "Student Scholar",
      title: "Student & Academic Scholar",
      ageRange: "Ages 13–21",
      icon: GraduationCap,
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
      activeBg: "bg-indigo-600 text-white shadow-xs font-bold",
      accentColor: "text-indigo-400",
      whatItIs: "Computer Science academic track for middle, high school, and university students.",
      whatClickingDoes:
        "Frames lessons with formal CS terminology, algorithm time/space complexity, AP Computer Science exam readiness, and strict test assertions.",
    },
    pro: {
      label: "Pro & Architect",
      title: "Professional & Architect",
      ageRange: "Ages 22+",
      icon: Briefcase,
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
      activeBg: "bg-purple-600 text-white shadow-xs font-bold",
      accentColor: "text-purple-400",
      whatItIs: "Industry engineering track for developers, career-switchers, and tech professionals.",
      whatClickingDoes:
        "Unlocks enterprise OOP architectures, CPython memory internals, dunder magic protocols (__init__, __repr__, __enter__), clean code design patterns, and PEP 8 best practices.",
    },
  };

  const isUserLoggedIn = progress.user?.isAuthenticated;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name - "Python Quest" with Explorer Mascot & Motto */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onTabChange("home")}
              className="flex items-center text-left group focus:outline-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]"
              id="brand-logo-btn"
              title="Python Quest — Explore • Learn • Create • Evolve"
            >
              <PythonQuestLogo size="md" variant="horizontal" withGlow />
            </button>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              id="nav-tab-home"
              onClick={() => onTabChange("home")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "home"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Overview</span>
            </button>

            <button
              id="nav-tab-curriculum"
              onClick={() => onTabChange("curriculum")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "curriculum"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Chapters</span>
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => onTabChange("dashboard")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "dashboard"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tab-certificates"
              onClick={() => onTabChange("certificates")}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "certificates"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Certificates</span>
              {availableClaimsCount > 0 && (
                <span className="animate-pulse bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                  {availableClaimsCount} Ready
                </span>
              )}
            </button>

            <button
              id="nav-tab-leaderboard"
              onClick={() => onTabChange("leaderboard")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "leaderboard"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Leaderboard</span>
            </button>

            <button
              id="nav-tab-daily-challenge"
              onClick={() => onTabChange("daily-challenge")}
              className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "daily-challenge"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Zap className={`w-4 h-4 ${activeTab === "daily-challenge" ? "fill-slate-950 text-slate-950" : "text-amber-500 fill-amber-500"}`} />
              <span>Daily Challenge</span>
              {isTodayPuzzleDone ? (
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-xs">
                  Done
                </span>
              ) : (
                <span className="animate-bounce bg-linear-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-xs">
                  +50 cr
                </span>
              )}
            </button>

            <button
              id="nav-tab-scratchpad"
              onClick={() => onTabChange("scratchpad")}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "scratchpad"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Terminal className="w-4 h-4 text-purple-600" />
              <span>Sandbox</span>
            </button>
          </nav>

          {/* Right Section: Mode, Credits, Device Badge & Profile / Auth */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Learner Track Selector: Mobile Single Button Dropdown */}
            <div className="relative sm:hidden">
              <button
                onClick={() => setMobileTrackMenuOpen(!mobileTrackMenuOpen)}
                className="flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition-colors"
                aria-label="Change learning track"
              >
                {React.createElement(modeConfig[progress.learnerMode].icon, {
                  className: "w-3.5 h-3.5 text-amber-600 shrink-0",
                })}
                <span className="text-[11px] font-bold">
                  {modeConfig[progress.learnerMode].label.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {mobileTrackMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/20"
                    onClick={() => setMobileTrackMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-700 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                      Select Learning Track
                    </div>
                    {(["child", "student", "pro"] as LearnerMode[]).map((mode) => {
                      const cfg = modeConfig[mode];
                      const Icon = cfg.icon;
                      const isActive = progress.learnerMode === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => {
                            onModeChange(mode);
                            setMobileTrackMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2.5 p-2 rounded-xl text-left transition-all ${
                            isActive
                              ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${cfg.accentColor}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs truncate">{cfg.title}</div>
                            <div className="text-[10px] text-slate-400">{cfg.ageRange}</div>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Learner Audience Selector with Rich Tooltips */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-slate-400 hidden xl:inline uppercase tracking-wider">
                Track:
              </span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                {(["child", "student", "pro"] as LearnerMode[]).map((mode) => {
                  const cfg = modeConfig[mode];
                  const Icon = cfg.icon;
                  const isActive = progress.learnerMode === mode;
                  return (
                    <div key={mode} className="relative group/mode">
                      <button
                        id={`mode-toggle-${mode}`}
                        onClick={() => onModeChange(mode)}
                        aria-label={`Switch to ${cfg.title} (${cfg.ageRange})`}
                        className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                          isActive
                            ? cfg.activeBg
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden xl:inline">{cfg.label.split(" ")[0]}</span>
                      </button>

                      {/* Tooltip Card for Each Learner Mode Button */}
                      <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-2 hidden group-hover/mode:block group-focus-within/mode:block z-50 w-72 sm:w-80 p-3.5 bg-slate-950 text-white text-xs rounded-2xl shadow-2xl border border-slate-700 pointer-events-none transition-all animate-in fade-in zoom-in-95 duration-150">
                        <div className="absolute -top-1.5 right-4 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 bg-slate-950 border-t border-l border-slate-700 rotate-45" />
                        <div className="relative z-10 space-y-2">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center space-x-2 font-bold text-slate-100">
                              <div className="p-1 rounded-lg bg-slate-800">
                                <Icon className={`w-4 h-4 ${cfg.accentColor}`} />
                              </div>
                              <span className="text-sm">{cfg.title}</span>
                            </div>
                            <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                              {cfg.ageRange}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {cfg.whatItIs}
                          </p>
                          <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800">
                            <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider mb-1 flex items-center space-x-1">
                              <span>What clicking this does:</span>
                            </div>
                            <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                              {cfg.whatClickingDoes}
                            </p>
                          </div>
                          <div className="pt-0.5 flex items-center justify-between text-[10px]">
                            {isActive ? (
                              <span className="text-emerald-400 font-bold flex items-center space-x-1 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Active Learning Track</span>
                              </span>
                            ) : (
                              <span className="text-amber-400 font-medium flex items-center space-x-1">
                                <span>Click to switch curriculum to this mode</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Credit Score Pill - Compact on Mobile, Full on Desktop */}
            <div className="relative group/credits">
              <div
                id="credit-counter-badge"
                className="flex items-center space-x-1.5 bg-linear-to-r from-amber-50 to-yellow-100/70 border border-amber-300/80 px-2 sm:px-2.5 py-1 rounded-xl shadow-xs cursor-help"
              >
                <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="hidden sm:inline text-[9px] uppercase font-bold text-amber-800 tracking-wider">
                    Credits
                  </span>
                  <span className="text-xs font-extrabold text-amber-950 font-mono">
                    {progress.totalCredits.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 hidden group-hover/credits:block z-50 w-64 p-3 bg-slate-950 text-white text-xs rounded-xl shadow-2xl border border-slate-700 pointer-events-none animate-in fade-in duration-150">
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-slate-950 border-t border-l border-slate-700 rotate-45" />
                <div className="font-bold text-amber-400 text-xs mb-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Python Quest Credits</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  Earn credits by completing chapter coding exercises (+150 cr) and daily challenges (+50 cr).
                </p>
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-1.5">
                  Milestone Awards: <strong>300 cr</strong> (Foundation), <strong>750 cr</strong> (Medium OOP), <strong>1,350 cr</strong> (Advanced).
                </div>
              </div>
            </div>

            {/* Active Streak - Hidden on tiny screens, shown sm+ */}
            <div className="relative group/streak hidden sm:block">
              <div
                className="flex items-center space-x-1 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-xl cursor-help"
              >
                <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                <span className="text-xs font-bold text-orange-800">{progress.currentStreak}d</span>
              </div>

              <div className="absolute right-0 top-full mt-2 hidden group-hover/streak:block z-50 w-60 p-3 bg-slate-950 text-white text-xs rounded-xl shadow-2xl border border-slate-700 pointer-events-none animate-in fade-in duration-150">
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-slate-950 border-t border-l border-slate-700 rotate-45" />
                <div className="font-bold text-orange-400 text-xs mb-1 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                  <span>Daily Learning Streak</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tracks consecutive days of active coding practice. Complete at least one exercise or puzzle each day to preserve your streak!
                </p>
              </div>
            </div>

            {/* Device Profile Badge (Detects Pixel 7a, Android, iOS, or Web Desktop) */}
            <button
              onClick={() => setDeviceInfoOpen(true)}
              title={`Adaptive layout active for ${device.deviceModel} (${device.screenWidth}x${device.screenHeight})`}
              className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-mono border border-slate-200 transition-colors"
            >
              {device.isMobile ? (
                <Smartphone className="w-3 h-3 text-emerald-600" />
              ) : (
                <Monitor className="w-3 h-3 text-blue-600" />
              )}
              <span className="truncate max-w-[90px]">{device.deviceModel}</span>
            </button>

            {/* User Account / Auth Section */}
            {isUserLoggedIn ? (
              <div className="flex items-center space-x-1 sm:space-x-1.5 pl-1 border-l border-slate-200">
                <div
                  className="flex items-center space-x-1.5 px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
                  title={`Logged in as ${progress.user?.name} (Age: ${progress.user?.age}, Auth: ${progress.user?.authProvider})`}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-[11px] flex items-center justify-center">
                    {progress.learnerName.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:flex flex-col text-left leading-none">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[80px]">
                      {progress.learnerName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Age {progress.user?.age || "—"}
                    </span>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out of Python Quest"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 pl-1 border-l border-slate-200 relative group/auth">
                {onOpenAuth && (
                  <button
                    onClick={() => onOpenAuth("register")}
                    id="nav-register-btn"
                    className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Sign In</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Device Information Modal */}
        {deviceInfoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Adaptive Screen Display</h3>
                    <p className="text-[11px] text-slate-500">Device-Tailored Experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeviceInfoOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-medium">Detected Device</span>
                  <span className="font-bold text-slate-800 font-mono">{device.deviceModel}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-medium">Viewport Size</span>
                  <span className="font-bold text-slate-800 font-mono">
                    {device.screenWidth}px × {device.screenHeight}px
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-medium">Rendering Mode</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {device.isAndroid
                      ? "Android Material View (Google Pixel)"
                      : device.isIOS
                      ? "iOS Human Interface View"
                      : "Desktop Web View"}
                  </span>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  ✓ Horizontal scrolling prevented with strict boundary clipping.
                  <br />
                  ✓ Quick-keys code helper bar enabled for mobile touch screens.
                  <br />
                  ✓ Bottom touch navigation active on handheld viewports.
                </div>
              </div>

              <button
                onClick={() => setDeviceInfoOpen(false)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

