import React, { useState } from 'react';
import { X, Server, Check, AlertCircle, Sliders, RefreshCw } from 'lucide-react';
import { DIRECT_API_URL } from '../../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDark = true,
}) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');

  if (!isOpen) return null;

  const handleTestEndpoint = async () => {
    setTestStatus('testing');
    setTestResult('Sending test prompt to Ollama endpoint...');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'qwen3:1.7b',
          prompt: 'Say hello in one short sentence.',
          stream: false,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTestStatus('success');
        setTestResult(`Server responded (${data.model}): "${data.response}"`);
      } else {
        setTestStatus('error');
        setTestResult(`Status ${res.status}: Server was unable to respond.`);
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestResult('Connection error. Please check network.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-md rounded-3xl p-6 border shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#181920] border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-orange-500/20 text-orange-500 border border-orange-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Ollama API Settings</h3>
            <p className="text-xs text-gray-400">Live AI service connection configuration</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Active Live URL */}
          <div>
            <label className="font-semibold block mb-1 text-gray-300">Live Generate Endpoint:</label>
            <div className="p-2.5 rounded-xl bg-[#121318] border border-gray-800 font-mono text-[11px] text-orange-400 break-all select-all">
              {DIRECT_API_URL}
            </div>
          </div>

          {/* Test Connection Button */}
          <div>
            <button
              type="button"
              onClick={handleTestEndpoint}
              disabled={testStatus === 'testing'}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              <span>{testStatus === 'testing' ? 'Testing Live Connection...' : 'Test Connection'}</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : 'bg-gray-800 border-gray-700 text-gray-300'
              }`}
            >
              {testStatus === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <span className="leading-snug">{testResult}</span>
            </div>
          )}

          {/* Information */}
          <div className="p-3 rounded-2xl bg-gray-800/40 border border-gray-800 text-gray-400 text-[11px] space-y-1">
            <p>
              • <strong className="text-gray-200">Default Model:</strong> <code className="text-orange-400">qwen3:1.7b</code>
            </p>
            <p>
              • <strong className="text-gray-200">Thinking Field:</strong> Filtered out automatically from UI.
            </p>
            <p>
              • <strong className="text-gray-200">Session State:</strong> In-memory only (clean on refresh).
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end pt-3 border-t border-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
