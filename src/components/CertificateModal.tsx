import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Award,
  X,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Crown,
  Sparkles,
  Calendar,
  Key,
} from "lucide-react";
import { AwardMilestone, ClaimedCertificate, UserProgress } from "../types";
import { PythonMascot } from "./PythonMascot";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: AwardMilestone | null;
  claimedCert: ClaimedCertificate | null;
  progress: UserProgress;
  onClaim?: (milestone: AwardMilestone) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  milestone,
  claimedCert,
  progress,
  onClaim,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#fbbf24"],
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || (!milestone && !claimedCert)) return null;

  const currentMilestone = milestone;
  const isAlreadyClaimed = !!claimedCert;

  const certTitle =
    claimedCert?.certificateTitle ||
    currentMilestone?.certificateTitle ||
    "Python Mastery Certificate";

  const recipientName = claimedCert?.recipientName || progress.learnerName || "Python Scholar";

  const issueDate = claimedCert?.claimedAt
    ? new Date(claimedCert.claimedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const verificationCode =
    claimedCert?.verificationCode ||
    `PY-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).substring(3, 7).toUpperCase()}`;

  const skills = claimedCert?.skills || currentMilestone?.skillsCertified || [];

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const text = `I just earned the ${certTitle} on Python Academy with ${progress.totalCredits} credits!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: certTitle,
          text,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Certificate achievement copied to clipboard!");
    }
  };

  const levelColorMap = {
    foundation: {
      badge: "bg-amber-100 text-amber-800 border-amber-300",
      seal: "from-amber-600 to-yellow-500",
      accent: "text-amber-700",
    },
    medium: {
      badge: "bg-slate-200 text-slate-800 border-slate-400",
      seal: "from-slate-600 to-slate-400",
      accent: "text-blue-700",
    },
    advanced: {
      badge: "bg-yellow-100 text-yellow-900 border-yellow-400",
      seal: "from-amber-500 via-yellow-400 to-amber-600",
      accent: "text-purple-700",
    },
  };

  const activeLevel = (claimedCert?.level || currentMilestone?.level || "foundation") as
    | "foundation"
    | "medium"
    | "advanced";
  const colors = levelColorMap[activeLevel];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden print:shadow-none print:border-none">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800 text-sm">
              Official Credential Award
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              id="print-certificate-btn"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleShare}
              id="share-certificate-btn"
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              onClick={onClose}
              id="close-certificate-modal-btn"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            PRINTABLE CERTIFICATE BODY (Artisan Parchment Style)
           ======================================================== */}
        <div
          ref={certificateRef}
          className="p-8 sm:p-12 bg-linear-to-b from-amber-50/40 via-white to-amber-50/20 text-center relative select-none"
        >
          {/* Classical Inner Double Border */}
          <div className="border-4 border-double border-amber-800/40 rounded-xl p-6 sm:p-10 relative bg-white/70 shadow-inner">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-amber-700/60 font-serif text-2xl leading-none">
              ❖
            </div>
            <div className="absolute top-2 right-2 text-amber-700/60 font-serif text-2xl leading-none">
              ❖
            </div>
            <div className="absolute bottom-2 left-2 text-amber-700/60 font-serif text-2xl leading-none">
              ❖
            </div>
            <div className="absolute bottom-2 right-2 text-amber-700/60 font-serif text-2xl leading-none">
              ❖
            </div>

            {/* Header / Academy Crest */}
            <div className="mb-4">
              <div className="flex items-center justify-center space-x-2 text-amber-900 font-extrabold tracking-widest text-xs uppercase mb-1">
                <PythonMascot size="sm" withCrown />
                <span>✦ PYTHON QUEST CERTIFICATION BOARD ✦</span>
              </div>
              <h1
                style={{ fontFamily: "'Cinzel', serif" }}
                className="text-2xl sm:text-4xl font-extrabold tracking-wide text-slate-900 uppercase"
              >
                Certificate of Achievement
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 italic font-serif">
                This certifies that the following candidate has demonstrated verified competency
              </p>
            </div>

            {/* Recipient Name Display */}
            <div className="my-6">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
                Proudly Presented To
              </div>
              <div className="text-3xl sm:text-5xl font-extrabold text-amber-900 font-serif tracking-tight border-b-2 border-amber-500/30 inline-block px-8 py-2">
                {recipientName}
              </div>
            </div>

            {/* Award Reason & Description */}
            <div className="max-w-xl mx-auto text-slate-700 text-sm sm:text-base leading-relaxed mb-6 font-serif">
              For exemplary completion of practical coding exercises, algorithmic problem solving,
              and comprehensive mastery in:
              <div className="font-sans font-bold text-lg sm:text-xl text-slate-900 mt-1">
                {certTitle}
              </div>
            </div>

            {/* Skills Certified Grid */}
            <div className="max-w-lg mx-auto mb-8 bg-amber-50/60 border border-amber-200/70 rounded-xl p-3 sm:p-4 text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Verified Curriculum Competencies:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                {skills.map((skill, i) => (
                  <div key={i} className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Row: Date, Seal, and Signatures */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-amber-200/60 gap-6 sm:gap-0">
              {/* Date & Verification ID */}
              <div className="text-left font-sans text-xs text-slate-500 space-y-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong>Date:</strong> {issueDate}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong>Credential ID:</strong>{" "}
                    <span className="font-mono text-slate-700">{verificationCode}</span>
                  </span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Platform Assessment</span>
                </div>
              </div>

              {/* Gold Ribbon Seal Emblem */}
              <div className="relative group flex items-center justify-center">
                <div
                  className={`w-20 h-20 rounded-full bg-linear-to-tr ${colors.seal} p-1 shadow-lg shadow-amber-500/30 flex items-center justify-center text-white border-2 border-amber-200`}
                >
                  <div className="w-full h-full rounded-full border border-amber-100/60 flex flex-col items-center justify-center text-center p-1">
                    <Award className="w-6 h-6 stroke-[2]" />
                    <span className="text-[9px] font-extrabold uppercase tracking-tighter leading-tight mt-0.5">
                      OFFICIAL
                      <br />
                      SEAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="text-right font-sans">
                <div className="font-serif italic text-lg sm:text-xl text-slate-800 tracking-wide">
                  Guido van Rossum Tribute
                </div>
                <div className="w-36 h-0.5 bg-slate-300 ml-auto my-1" />
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Academic Board of Directors
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button if not yet claimed */}
        {!isAlreadyClaimed && currentMilestone && onClaim && (
          <div className="p-4 bg-amber-50 border-t border-amber-200 flex items-center justify-between print:hidden">
            <div className="text-xs text-amber-900">
              <strong>Congratulations!</strong> You earned enough credits to add this certificate to your permanent profile gallery.
            </div>
            <button
              onClick={() => {
                onClaim(currentMilestone);
              }}
              id="claim-award-action-btn"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim & Save to Profile</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
