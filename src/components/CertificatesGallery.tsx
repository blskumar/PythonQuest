import React from "react";
import {
  Award,
  Trophy,
  ShieldCheck,
  Crown,
  Sparkles,
  Printer,
  Calendar,
  Key,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { AwardMilestone, ClaimedCertificate, UserProgress } from "../types";
import { MILESTONES } from "../data/courseData";

interface CertificatesGalleryProps {
  progress: UserProgress;
  onOpenCertificateModal: (milestone: AwardMilestone, claimed?: ClaimedCertificate) => void;
  onGoToCurriculum: () => void;
}

export const CertificatesGallery: React.FC<CertificatesGalleryProps> = ({
  progress,
  onOpenCertificateModal,
  onGoToCurriculum,
}) => {
  const milestoneIcons = {
    foundation: Trophy,
    medium: ShieldCheck,
    advanced: Crown,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-amber-200 font-bold text-xs uppercase tracking-wider mb-2">
            <Award className="w-4 h-4" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Awards & Certificates
          </h1>
          <p className="text-amber-100 text-sm sm:text-base max-w-xl mt-2 leading-relaxed">
            Verify, celebrate, and print your Python credentials. Claim awards at Foundation (300 cr),
            Medium OOP (750 cr), and Advanced (1350 cr) milestones.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0">
          <div className="text-xs text-amber-100 font-medium">Your Credit Balance</div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {progress.totalCredits}
          </div>
          <div className="text-[11px] text-amber-200 mt-1 font-semibold">
            {progress.claimedCertificates.length} Certificates Claimed
          </div>
        </div>
      </div>

      {/* Level Milestone Awards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Milestone Award Track</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MILESTONES.map((m) => {
            const Icon = milestoneIcons[m.level];
            const isUnlocked = progress.totalCredits >= m.requiredCredits;
            const claimed = progress.claimedCertificates.find((c) => c.milestoneId === m.id);
            const isClaimed = !!claimed;
            const creditsNeeded = Math.max(0, m.requiredCredits - progress.totalCredits);

            return (
              <div
                key={m.id}
                className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
                  isClaimed
                    ? "bg-linear-to-b from-amber-50/60 to-white border-amber-300 shadow-md ring-1 ring-amber-400/30"
                    : isUnlocked
                    ? "bg-linear-to-b from-emerald-50/60 to-white border-emerald-300 shadow-md ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xs ${
                        m.level === "foundation"
                          ? "bg-amber-100 text-amber-800"
                          : m.level === "medium"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {isClaimed ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Verified</span>
                      </span>
                    ) : isUnlocked ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Available!</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>{creditsNeeded} cr required</span>
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {m.level} Tier
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {m.certificateTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {isClaimed ? (
                    <button
                      onClick={() => onOpenCertificateModal(m, claimed)}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Award className="w-4 h-4" />
                      <span>View & Print Certificate</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onOpenCertificateModal(m)}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Claim Official Award</span>
                    </button>
                  ) : (
                    <button
                      onClick={onGoToCurriculum}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>Earn Credits in Exercises</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claimed Certificates Gallery Display */}
      {progress.claimedCertificates.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Your Claimed Credentials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {progress.claimedCertificates.map((cert) => {
              const matchedMilestone = MILESTONES.find((m) => m.id === cert.milestoneId);
              return (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-white border border-amber-300 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-mono">{cert.verificationCode}</span>
                      <span>
                        {new Date(cert.claimedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900">
                      {cert.certificateTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Awarded to <strong>{cert.recipientName}</strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                      Verified
                    </span>

                    <button
                      onClick={() => {
                        if (matchedMilestone) {
                          onOpenCertificateModal(matchedMilestone, cert);
                        }
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certificate</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
