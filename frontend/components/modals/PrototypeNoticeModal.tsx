import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Shield, ArrowRight } from 'lucide-react';

interface PrototypeNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDownloads?: () => void;
}

export const PrototypeNoticeModal: React.FC<PrototypeNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('vectornet_hide_prototype_notice');
      if (stored === 'true') {
        setDontShowAgain(true);
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleDismiss = () => {
    if (typeof window !== 'undefined' && dontShowAgain) {
      localStorage.setItem('vectornet_hide_prototype_notice', 'true');
    }
    onClose();
  };

  const DRIVE_LINK = 'https://drive.google.com/drive/folders/1TY6I3fmB93jGXdZJuPXU9AXoURNfWqlt?usp=sharing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prototype-dialog-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 id="prototype-dialog-title" className="text-sm font-bold text-slate-900 tracking-tight">
                Prototype evaluation notice
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                SIH 2026 • Problem Statement 26155
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Concise Body Content */}
        <div className="px-5 py-4 space-y-3.5 text-xs text-slate-600">
          <p className="leading-relaxed">
            This deployment is an interactive demonstration prototype for jury evaluation. Core multi-vendor configuration parsing, CIS/NIST compliance scoring, and automated remediation generation are operational. Live SSH telemetry collectors and distributed warehouse storage are planned for production.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-800">
              Evaluation benchmark configurations (Google Drive)
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Download test configs for Cisco, Juniper, Palo Alto, and Fortinet devices with test audit scenarios:
            </p>
            <a
              href={DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full px-3.5 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <span>Download test configs from Google Drive</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-90" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 text-orange-600 border-slate-300 rounded focus:ring-0"
            />
            <span className="text-[11px] text-slate-600">Don&apos;t show again</span>
          </label>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
