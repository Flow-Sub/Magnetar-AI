import React from 'react';
import { X, HelpCircle, CheckCircle2, Cpu, Zap, Terminal, Sparkles } from 'lucide-react';

interface UpdatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const UpdatesModal: React.FC<UpdatesModalProps> = ({ isOpen, onClose, isDark = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-xl rounded-3xl p-6 border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#181920] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-500 border border-orange-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Updates & Documentation</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Magnetar AI Ollama integration specifications
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs max-h-[60vh] overflow-y-auto pr-1">
          {/* Version banner */}
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-orange-900 dark:text-orange-200">Magnetar AI v1.0 Released</p>
              <p className="text-orange-700 dark:text-orange-300 text-[11px] mt-0.5">
                Connected directly to self-hosted Ollama endpoint at <code className="font-mono bg-orange-100 dark:bg-orange-900/60 px-1 py-0.5 rounded">https://n8n.magnetarsolutions.com/models/api/generate</code>.
              </p>
            </div>
          </div>

          {/* Model info */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2.5">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-orange-500" />
              Supported Models
            </h4>
            <div className="space-y-2 pl-1">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-orange-600 dark:text-orange-400">qwen3:1.7b</span>
                  <p className="text-[11px] text-gray-500">Default high-speed lightweight model (active).</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  ACTIVE
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 pt-2">
                <div>
                  <span className="font-mono font-bold text-gray-500">qwen3:4b</span>
                  <p className="text-[11px] text-gray-500">Higher quality reasoning model (disabled for rollout).</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-[10px]">
                  DISABLED
                </span>
              </div>
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-2.5 pt-1">
            <h4 className="font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h4>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                How does message history context work?
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                Previous conversation turns are combined into the prompt structure so the model can maintain context across answers without creating an external database.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Why is the model's internal thinking hidden?
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px]">
                In compliance with the API specification, the interface extracts solely the clean <code className="font-mono text-orange-500">response</code> payload and suppresses internal chain-of-thought scratchpads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
