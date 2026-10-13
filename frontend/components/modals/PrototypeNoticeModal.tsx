import React, { useState, useEffect } from 'react';
import { Info, ExternalLink, FolderDown, X, Shield, ArrowRight } from 'lucide-react';

interface PrototypeNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDownloads?: () => void;
}

export const PrototypeNoticeModal: React.FC<PrototypeNoticeModalProps> = ({
  isOpen,
  onClose,
  onNavigateToDownloads,
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

  const handleOpenDownloads = () => {
    handleDismiss();
    if (onNavigateToDownloads) {
      onNavigateToDownloads();
    }
  };

  const DRIVE_LINK = 'https://drive.google.com/drive/folders/1TY6I3fmB93jGXdZJuPXU9AXoURNfWqlt?usp=sharing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prototype-dialog-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h2 id="prototype-dialog-title" className="text-sm font-bold text-slate-900 tracking-tight">
                Evaluation notice for Smart India Hackathon jury
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Prototype build • Network Configuration Compliance Auditor
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

        {/* Body Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {/* Status Box */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-800">
              <span className="font-semibold text-amber-950 block">
                Demonstration prototype in active evaluation
              </span>
              <p className="text-[11px] text-amber-900/90 leading-normal">
                This deployment serves as an interactive demonstration prototype for jury review. Core parsing, AST extraction, vendor fingerprinting, rule evaluation, and automated remediation generation are fully operational.
              </p>
            </div>
          </div>

          {/* Scope Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-[11px] font-semibold text-slate-900 uppercase font-mono tracking-wider">
                Active in this prototype
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                <li>Multi-vendor AST parsing (Cisco, Juniper, Palo Alto, Fortinet)</li>
                <li>CIS Benchmark and NIST SP 800-53 deterministic audits</li>
                <li>Automated CLI remediation and rollback script generation</li>
                <li>Role-based access control and team task allocation</li>
                <li>PDF and OSCAL compliance report generation</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="text-[11px] font-semibold text-slate-900 uppercase font-mono tracking-wider">
                Production architecture roadmap
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                <li>Live SSH / NETCONF continuous streaming collectors</li>
                <li>PostgreSQL distributed warehouse and AWS S3 object store</li>
                <li>Enterprise LDAP / Active Directory SSO federation</li>
                <li>Zero-egress on-premises air-gapped container appliance</li>
                <li>Automated GitOps repository sync for network CI/CD</li>
              </ul>
            </div>
          </div>

          {/* Dataset download notice */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-900 uppercase font-mono tracking-wider">
                Evaluation benchmark configurations
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Google Drive folder</span>
            </div>
            <p className="text-[11px] text-slate-600">
              To evaluate VectorNet with standardized test cases containing intentional security misconfigurations (weak cryptography, cleartext Telnet, default SNMP strings, firewall bypasses), access the official configuration repository below.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={DRIVE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-md text-xs font-medium transition-colors"
              >
                <span>Download test configs from Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleOpenDownloads}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-md text-xs font-medium transition-colors"
              >
                <FolderDown className="w-3.5 h-3.5 text-slate-600" />
                <span>Open sample configs hub in app</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 text-orange-600 border-slate-300 rounded focus:ring-0"
            />
            <span className="text-[11px] text-slate-600">Do not display this notice automatically on launch</span>
          </label>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-semibold transition-colors"
          >
            <span>Proceed to audit console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
