import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./components/HomePage";
import { AuthModal } from "./components/AuthModal";
import { Dashboard } from "./components/Dashboard";
import { ChapterViewer } from "./components/ChapterViewer";
import { ExerciseWorkspace } from "./components/ExerciseWorkspace";
import { CertificatesGallery } from "./components/CertificatesGallery";
import { CertificateModal } from "./components/CertificateModal";
import { Scratchpad } from "./components/Scratchpad";
import { DailyChallenge } from "./components/DailyChallenge";
import { GlobalLeaderboard } from "./components/GlobalLeaderboard";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { AuthGateScreen } from "./components/AuthGateScreen";
import { CHAPTERS, MILESTONES } from "./data/courseData";
import { useDevice } from "./utils/useDevice";
import {
  loadUserProgress,
  saveUserProgress,
  updateLearnerMode,
  updateLearnerName,
  recordExerciseCompletion,
  claimCertificate,
  logoutUser,
} from "./utils/storage";
import {
  AwardMilestone,
  ClaimedCertificate,
  ExerciseSubmission,
  LearnerMode,
  UserProgress,
} from "./types";
import { Sparkles, Trophy, CheckCircle2, ArrowRight } from "lucide-react";

export default function App() {
  const device = useDevice();
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeTab, setActiveTab] = useState<
    | "home"
    | "curriculum"
    | "dashboard"
    | "certificates"
    | "scratchpad"
    | "daily-challenge"
    | "leaderboard"
  >(() => {
    const loaded = loadUserProgress();
    return loaded.user?.isAuthenticated ? "curriculum" : "home";
  });

  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: "login" | "register";
    gateMessage?: string;
  }>({
    isOpen: false,
    mode: "register",
  });

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    CHAPTERS[0].id
  );
  const [curriculumView, setCurriculumView] = useState<"lesson" | "exercise">(
    "lesson"
  );

  const handleTabChange = (
    tab:
      | "home"
      | "curriculum"
      | "dashboard"
      | "certificates"
      | "scratchpad"
      | "daily-challenge"
      | "leaderboard"
  ) => {
    setActiveTab(tab);
    if (tab === "curriculum") {
      setCurriculumView("lesson");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Certificate Modal state
  const [certModal, setCertModal] = useState<{
    isOpen: boolean;
    milestone: AwardMilestone | null;
    claimedCert: ClaimedCertificate | null;
  }>({
    isOpen: false,
    milestone: null,
    claimedCert: null,
  });

  // Calculate available unclaimed milestone awards
  const availableUnclaimedMilestones = MILESTONES.filter(
    (m) =>
      progress.totalCredits >= m.requiredCredits &&
      !progress.claimedCertificates.some((c) => c.milestoneId === m.id)
  );

  const currentChapterIndex = CHAPTERS.findIndex((c) => c.id === selectedChapterId);
  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];

  const handleModeChange = (mode: LearnerMode) => {
    const updated = updateLearnerMode(mode);
    setProgress(updated);
  };

  const handleNameChange = (name: string) => {
    const updated = updateLearnerName(name);
    setProgress(updated);
  };

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setCurriculumView("lesson");
    setActiveTab("curriculum");
  };

  const handleExerciseComplete = (submission: ExerciseSubmission) => {
    const { progress: updated, creditsAdded, isFirstCompletion } =
      recordExerciseCompletion(selectedChapterId, submission);
    setProgress(updated);

    // Check if new milestone was achieved
    const justUnlocked = MILESTONES.find(
      (m) =>
        updated.totalCredits >= m.requiredCredits &&
        updated.totalCredits - creditsAdded < m.requiredCredits
    );

    if (justUnlocked) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"],
        });
      } catch (e) {}
    }
  };

  const handleClaimAward = (milestone: AwardMilestone) => {
    const newCert: ClaimedCertificate = {
      id: `cert-${Date.now()}`,
      milestoneId: milestone.id,
      recipientName: progress.learnerName,
      certificateTitle: milestone.certificateTitle,
      level: milestone.level,
      claimedAt: new Date().toISOString(),
      verificationCode: `PY-${milestone.level.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      totalCredits: progress.totalCredits,
      skills: milestone.skillsCertified,
    };

    const updated = claimCertificate(newCert);
    setProgress(updated);
    setCertModal({
      isOpen: true,
      milestone,
      claimedCert: newCert,
    });
  };

  const handleOpenCertificateModal = (
    milestone: AwardMilestone,
    claimed?: ClaimedCertificate
  ) => {
    setCertModal({
      isOpen: true,
      milestone,
      claimedCert: claimed || null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Navigation Bar */}
      <Navbar
        progress={progress}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onModeChange={handleModeChange}
        onNameChange={handleNameChange}
        availableClaimsCount={availableUnclaimedMilestones.length}
        onOpenAuth={(mode = "register", gateMessage) =>
          setAuthModal({ isOpen: true, mode, gateMessage })
        }
        onLogout={() => {
          const updated = logoutUser();
          setProgress(updated);
          setActiveTab("home");
        }}
      />

      {/* Unlocked Award Banner if eligible */}
      {availableUnclaimedMilestones.length > 0 && activeTab !== "certificates" && (
        <div className="bg-linear-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 px-4 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs font-bold">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 fill-slate-950" />
              <span>
                Level Milestone Achieved! You have unlocked the{" "}
                <strong className="underline">
                  {availableUnclaimedMilestones[0].certificateTitle}
                </strong>
                .
              </span>
            </div>
            <button
              onClick={() => {
                handleOpenCertificateModal(availableUnclaimedMilestones[0]);
              }}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg shadow-xs transition-transform hover:scale-105 flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Claim Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-24 md:pb-12 overflow-x-hidden">
        {/* TAB 0: HOME & INTRODUCTORY OVERVIEW */}
        {activeTab === "home" && (
          <HomePage
            progress={progress}
            chapters={CHAPTERS}
            onOpenAuth={(mode = "register", gateMessage) =>
              setAuthModal({ isOpen: true, mode, gateMessage })
            }
            onStartLearning={() => {
              setActiveTab("curriculum");
              setCurriculumView("lesson");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectChapter={(chapterId, view = "lesson") => {
              setSelectedChapterId(chapterId);
              setActiveTab("curriculum");
              setCurriculumView(view);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectAgeMode={(mode) => {
              handleModeChange(mode);
              setActiveTab("curriculum");
              setCurriculumView("lesson");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (tab === "curriculum") setCurriculumView("lesson");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {/* TAB 1: CURRICULUM & EXERCISES */}
        {activeTab === "curriculum" && (
          <div>
            {curriculumView === "lesson" ? (
              <ChapterViewer
                chapter={currentChapter}
                learnerMode={progress.learnerMode}
                onGoToExercise={() => setCurriculumView("exercise")}
                isCompleted={progress.completedChapters.includes(currentChapter.id)}
                chapters={CHAPTERS}
                completedChapterIds={progress.completedChapters}
                onSelectChapter={(id) => {
                  setSelectedChapterId(id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPrevChapter={
                  currentChapterIndex > 0
                    ? () => setSelectedChapterId(CHAPTERS[currentChapterIndex - 1].id)
                    : undefined
                }
                onNextChapter={
                  currentChapterIndex < CHAPTERS.length - 1
                    ? () => setSelectedChapterId(CHAPTERS[currentChapterIndex + 1].id)
                    : undefined
                }
              />
            ) : (
              <ExerciseWorkspace
                chapter={currentChapter}
                learnerMode={progress.learnerMode}
                onExerciseComplete={handleExerciseComplete}
                onBackToLesson={() => setCurriculumView("lesson")}
                prevSubmission={progress.exerciseSubmissions[currentChapter.id]}
                progress={progress}
                onNextChapter={
                  currentChapterIndex < CHAPTERS.length - 1
                    ? () => {
                        setSelectedChapterId(CHAPTERS[currentChapterIndex + 1].id);
                        setCurriculumView("lesson");
                      }
                    : undefined
                }
              />
            )}
          </div>
        )}

        {/* TAB 2: PROGRESS DASHBOARD */}
        {activeTab === "dashboard" && (
          <Dashboard
            progress={progress}
            chapters={CHAPTERS}
            onSelectChapter={handleSelectChapter}
            onOpenCertificateModal={handleOpenCertificateModal}
            onGoToCurriculum={() => {
              setActiveTab("curriculum");
              setCurriculumView("lesson");
            }}
            onGoToScratchpad={() => {
              setActiveTab("scratchpad");
            }}
            onGoToDailyChallenge={() => {
              setActiveTab("daily-challenge");
            }}
            onGoToLeaderboard={() => {
              setActiveTab("leaderboard");
            }}
          />
        )}

        {/* TAB 3: AWARDS & CERTIFICATES */}
        {activeTab === "certificates" && (
          <CertificatesGallery
            progress={progress}
            onOpenCertificateModal={handleOpenCertificateModal}
            onGoToCurriculum={() => {
              setActiveTab("curriculum");
              setCurriculumView("lesson");
            }}
          />
        )}

        {/* TAB 4: GLOBAL LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <GlobalLeaderboard
            progress={progress}
            onGoToCurriculum={() => {
              setActiveTab("curriculum");
              setCurriculumView("lesson");
            }}
            onGoToDailyChallenge={() => {
              setActiveTab("daily-challenge");
            }}
          />
        )}

        {/* TAB 5: INTERACTIVE PYTHON SANDBOX */}
        {activeTab === "scratchpad" && (
          <Scratchpad
            learnerMode={progress.learnerMode}
            progress={progress}
            onProgressUpdated={setProgress}
          />
        )}

        {/* TAB 6: DAILY CHALLENGE */}
        {activeTab === "daily-challenge" && (
          <DailyChallenge
            progress={progress}
            onProgressUpdated={setProgress}
            onGoToCurriculum={() => {
              setActiveTab("curriculum");
              setCurriculumView("lesson");
            }}
            learnerMode={progress.learnerMode}
          />
        )}
      </main>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModal.isOpen}
        onClose={() => setCertModal((prev) => ({ ...prev, isOpen: false }))}
        milestone={certModal.milestone}
        claimedCert={certModal.claimedCert}
        progress={progress}
        onClaim={handleClaimAward}
      />

      {/* Login & Registration Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal((prev) => ({ ...prev, isOpen: false }))}
        initialMode={authModal.mode}
        gateMessage={authModal.gateMessage}
        defaultEmail="subrahmanya.boddapati@gmail.com"
        onSuccess={(updated) => {
          setProgress(updated);
          setActiveTab("curriculum");
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
          });
        }}
      />

      {/* Mobile Touch Bottom Navigation (Pixel 7a / Android / iOS Optimized) */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        device={device}
        isAuthenticated={Boolean(progress.user?.isAuthenticated)}
        isDailyChallengeDone={(progress.completedDailyChallenges || []).length > 0}
      />
    </div>
  );
}
