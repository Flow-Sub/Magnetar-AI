import React, { useRef, useEffect } from 'react';
import { Sparkles, Code, Lightbulb, Compass, Zap, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { ChatMessageItem } from './ChatMessageItem';
import { PROMPT_SUGGESTIONS } from '../data/seedData';

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  isDark?: boolean;
  selectedModel: string;
  searchFilter?: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onRegenerate,
  onFeedback,
  isDark = false,
  selectedModel,
  searchFilter = '',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or loading state toggles
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const filteredMessages = searchFilter
    ? messages.filter((m) => m.content.toLowerCase().includes(searchFilter.toLowerCase()))
    : messages;

  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf('assistant');

  return (
    <div id="chat-messages-container" className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-4">
      {messages.length === 0 ? (
        /* Empty State / Welcome Screen */
        <div className="max-w-2xl mx-auto py-8 px-4 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
          {/* Logo & Headline */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/20 mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-[#131418] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-orange-500" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
            How can Magnetar AI assist you today?
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6 leading-relaxed">
            Connected to high-speed self-hosted Ollama (<span className="font-mono text-orange-500 font-semibold">{selectedModel}</span>). Get instant code generation, deep explanations, and workflow assistance.
          </p>

          {/* Quick Starter Suggestions */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {PROMPT_SUGGESTIONS.map((item, index) => {
              const icons = [Code, Zap, Compass, Lightbulb];
              const Icon = icons[index % icons.length];

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSendMessage(item.prompt)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                    isDark
                      ? 'bg-[#181922] border-gray-800 hover:border-orange-500/60 hover:bg-[#1d1f2b]'
                      : 'bg-white border-gray-200/90 hover:border-orange-400 hover:bg-orange-50/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">
                    {item.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Messages Thread */
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredMessages.map((msg, index) => {
            const isLastAssistant = index === lastAssistantIndex;
            return (
              <ChatMessageItem
                key={msg.id}
                message={msg}
                isLastAssistant={isLastAssistant}
                onRegenerate={isLastAssistant ? onRegenerate : undefined}
                onFeedback={onFeedback}
                isDark={isDark}
                isLoading={isLoading}
              />
            );
          })}

          {/* Thinking / Loading Animation Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 px-2 sm:px-4 py-2 animate-in fade-in duration-150">
              <div className="w-6 h-6 rounded-full bg-gray-800 text-orange-400 flex items-center justify-center text-xs shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div
                className={`rounded-2xl rounded-tl-xs px-4 py-3 text-xs flex items-center gap-2 border shadow-xs ${
                  isDark
                    ? 'bg-[#1e1f26] border-gray-800 text-gray-300'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" />
                </div>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  Magnetar AI is computing response with {selectedModel}...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};
