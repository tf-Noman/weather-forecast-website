import React from 'react';

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName = 'Noman Sheikh',
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sign Out"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-slate-900/90 backdrop-blur-2xl shadow-2xl text-white p-5 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        <h3 className="font-bold text-center text-lg mb-1">Sign Out of Aurora?</h3>
        <p className="text-xs text-center text-white/60 mb-6">
          You are signed in as <strong className="text-white">{userName}</strong>. Signing out resets session preferences and active regional cache.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 px-3 rounded-xl bg-red-600/80 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
