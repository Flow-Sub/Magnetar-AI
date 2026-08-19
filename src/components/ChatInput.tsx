import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  isDark?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  isDark = false,
}) => {
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isLoading) return;

    onSendMessage(trimmed);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div id="chat-input-wrapper" className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-4">
      {/* Pure, clean, rounded input capsule matching reference screenshot */}
      <div
        className={`relative flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all shadow-sm ${
          isDark
            ? 'bg-[#1e1f27] border-gray-700/80 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
            : 'bg-white border-gray-200/90 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20'
        }`}
      >
        {/* Text Area */}
        <textarea
          id="chat-prompt-textarea"
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing..."
          rows={1}
          disabled={isLoading}
          className={`w-full resize-none bg-transparent py-1.5 text-sm focus:outline-hidden disabled:opacity-50 max-h-32 ${
            isDark ? 'text-gray-100 placeholder-gray-400' : 'text-gray-900 placeholder-gray-400'
          }`}
        />

        {/* Send Button */}
        <button
          id="chat-send-button"
          type="button"
          onClick={handleSubmit}
          disabled={!inputText.trim() || isLoading}
          className={`p-2.5 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
            inputText.trim() && !isLoading
              ? 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs active:scale-95'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed opacity-50'
          }`}
          title="Send message (Enter)"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Footer Research Preview Disclaimer matching image */}
      <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500 select-none">
        Free Research Preview. ChatGPT may produce inaccurate information about people, places, or facts.{' '}
        <span className="text-orange-500 font-medium">ChatGPT May 12 Version</span>
      </p>
    </div>
  );
};
