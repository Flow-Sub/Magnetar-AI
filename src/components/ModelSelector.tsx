import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Sparkles, Zap, Lock } from 'lucide-react';
import { AVAILABLE_MODELS } from '../services/api';

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  isDark?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onSelectModel,
  isDark = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div id="model-selector-container" className="relative" ref={dropdownRef}>
      <button
        id="model-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
          isDark
            ? 'bg-[#1a1b22] border-gray-700/80 text-gray-200 hover:border-orange-500/50'
            : 'bg-white border-gray-200 text-gray-800 hover:border-orange-500/50'
        }`}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono font-medium">{activeModelObj.name}</span>
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-[10px]">
          {activeModelObj.tag}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          id="model-selector-menu"
          className={`absolute left-0 mt-1.5 w-64 rounded-2xl border p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 ${
            isDark
              ? 'bg-[#181920] border-gray-700 text-gray-200'
              : 'bg-white border-gray-200 text-gray-800'
          }`}
        >
          <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800 mb-1">
            Available Models
          </div>

          <div className="space-y-1">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === selectedModel;
              return (
                <button
                  key={model.id}
                  type="button"
                  disabled={!model.enabled}
                  onClick={() => {
                    if (model.enabled) {
                      onSelectModel(model.id);
                      setIsOpen(false);
                    }
                  }}
                  className={`w-full text-left p-2 rounded-xl transition-all flex flex-col gap-0.5 ${
                    !model.enabled
                      ? 'opacity-60 cursor-not-allowed bg-gray-50/50 dark:bg-gray-800/30'
                      : isSelected
                      ? 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/50'
                      : 'hover:bg-gray-100/80 dark:hover:bg-gray-800 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {model.id === 'qwen3:1.7b' ? (
                        <Zap className="w-3.5 h-3.5 text-orange-500" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      )}
                      <span className="font-mono text-xs font-bold">{model.name}</span>
                    </div>

                    {!model.enabled ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9.5px] font-semibold rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <Lock className="w-2.5 h-2.5" /> Disabled
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] font-semibold text-orange-600 dark:text-orange-400">
                        Active
                      </span>
                    ) : null}
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                    {model.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
