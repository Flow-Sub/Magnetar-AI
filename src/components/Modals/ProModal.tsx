import React from 'react';
import { X, Sparkles, Check, Zap, Shield, Rocket, Cpu } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose, isDark = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#181920] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        {/* Background gradient flare */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-400 text-white shadow-md shadow-orange-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Magnetar Pro Plan</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Strengthen artificial intelligence with priority high-throughput GPU clusters
            </p>
          </div>
        </div>

        {/* Price Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 text-white my-4 shadow-md">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl font-black">$10 <span className="text-sm font-normal opacity-90">/ month</span></span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 uppercase tracking-wider">
              Early Access
            </span>
          </div>
          <p className="text-xs text-white/90">
            Billed monthly. Cancel or change plan anytime from your settings.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5 my-4">
          {[
            { icon: Zap, text: 'Unlimited access to Qwen 3 (1.7B & upcoming 4B models)' },
            { icon: Cpu, text: 'Zero latency queuing with dedicated Ollama server resources' },
            { icon: Rocket, text: 'Expanded context window (up to 32,768 tokens)' },
            { icon: Shield, text: 'Full export of conversation datasets and code workbooks' },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
              </div>
            );
          })}
        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              alert('Thank you! Pro Plan subscription simulated successfully for demo workspace.');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            Upgrade to Pro ($10/mo)
          </button>
        </div>
      </div>
    </div>
  );
};
