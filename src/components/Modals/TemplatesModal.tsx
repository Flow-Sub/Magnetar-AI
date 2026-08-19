import React from 'react';
import { X, FileCode, ArrowRight, Code, ShieldCheck, Cpu, Terminal, Sparkles } from 'lucide-react';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (prompt: string, title: string) => void;
  isDark?: boolean;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onUseTemplate,
  isDark = false,
}) => {
  if (!isOpen) return null;

  const templates = [
    {
      title: 'Interactive Form with JS Validation',
      category: 'Frontend',
      icon: Code,
      prompt: 'Write clean HTML, CSS, and vanilla JavaScript for a modern welcome sign-up form with instant field validation and custom interactive buttons.',
    },
    {
      title: 'REST API Endpoint in Node.js Express',
      category: 'Backend',
      icon: Terminal,
      prompt: 'Provide complete code for an Express.js router with CRUD routes, input schema validation, and error middleware.',
    },
    {
      title: 'Wi-Fi & Router Security Checklist',
      category: 'Networking',
      icon: ShieldCheck,
      prompt: 'Give a comprehensive, step-by-step technical guide on configuring enterprise-grade Wi-Fi security on a dual-band router.',
    },
    {
      title: 'High-Impact Workday Organization',
      category: 'Productivity',
      icon: Sparkles,
      prompt: 'Outline a realistic time-blocking schedule for a senior software engineer that balances deep work, code reviews, and meetings.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-2xl rounded-3xl p-6 border shadow-2xl overflow-hidden ${
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
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold">Prompt Templates</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-500 border border-orange-500/30">
                PRO LIBRARY
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Curated high-efficiency prompts formatted for Qwen Ollama models
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {templates.map((tpl, i) => {
            const Icon = tpl.icon;
            return (
              <div
                key={i}
                onClick={() => {
                  onUseTemplate(tpl.prompt, tpl.title);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                  isDark
                    ? 'bg-[#14151b] border-gray-800 hover:border-orange-500/60 hover:bg-[#1a1b24]'
                    : 'bg-gray-50/80 border-gray-200 hover:border-orange-400 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                      {tpl.category}
                    </span>
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1.5">
                    {tpl.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {tpl.prompt}
                  </p>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-end text-orange-500 text-xs font-semibold gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
