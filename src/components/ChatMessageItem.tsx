import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCw,
  AlertCircle,
  ExternalLink,
  Bot,
  User,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { CodeBlock } from './CodeBlock';

interface ChatMessageItemProps {
  message: ChatMessage;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
  onFeedback?: (messageId: string, feedback: 'like' | 'dislike') => void;
  isDark?: boolean;
  isLoading?: boolean;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
  onFeedback,
  isDark = false,
  isLoading = false,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy text:', e);
    }
  };

  // Detect if message has Codepen or external project reference for special action pill
  const hasCodepenMention = message.content.includes('Codepen') || message.content.includes('project in your');

  return (
    <div
      id={`chat-message-${message.id}`}
      className={`group flex w-full flex-col py-3 px-2 sm:px-4 transition-colors ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      {/* Sender Header info */}
      <div className={`flex items-center gap-2 mb-1 text-xs font-semibold ${isUser ? 'flex-row-reverse text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300'}`}>
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shadow-xs ${
            isUser
              ? 'bg-orange-500 text-white font-bold'
              : 'bg-gray-800 text-orange-400 dark:bg-gray-700'
          }`}
        >
          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>
        <span>{isUser ? 'You' : 'Magnetar AI'}</span>
        {message.model && !isUser && (
          <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
            {message.model}
          </span>
        )}
      </div>

      {/* Message Content Bubble */}
      <div
        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-xs ${
          isUser
            ? 'bg-orange-500 text-white rounded-tr-xs'
            : isDark
            ? 'bg-[#1e1f26] border border-gray-800 text-gray-100 rounded-tl-xs'
            : 'bg-white border border-gray-200/90 text-gray-800 rounded-tl-xs'
        } ${isError ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : ''}`}
      >
        {isError ? (
          <div className="flex items-start gap-2.5 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{message.content || 'Unable to connect to the AI server.'}</p>
              <p className="text-xs text-red-500/80 mt-1">
                Please verify your network connection or server endpoint and try again.
              </p>
              {onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="mt-2 text-xs font-semibold px-3 py-1 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 text-red-700 dark:text-red-300 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" /> Retry Request
                </button>
              )}
            </div>
          </div>
        ) : isUser ? (
          <div className="whitespace-pre-wrap font-sans text-white break-words">
            {message.content}
          </div>
        ) : (
          <div className="markdown-body space-y-3 break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');

                  // If multi-line or block code
                  if (match || codeString.includes('\n')) {
                    return (
                      <CodeBlock
                        language={match ? match[1] : 'javascript'}
                        value={codeString}
                        isDark={isDark}
                      />
                    );
                  }
                  // Inline code
                  return (
                    <code
                      className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-orange-600 dark:text-orange-400 font-mono text-[12.5px]"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                p({ children }) {
                  return <p className="mb-2.5 last:mb-0 text-sm leading-relaxed">{children}</p>;
                },
                ul({ children }) {
                  return <ul className="list-disc pl-5 mb-2.5 space-y-1">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-5 mb-2.5 space-y-1">{children}</ol>;
                },
                li({ children }) {
                  return <li className="text-sm">{children}</li>;
                },
                blockquote({ children }) {
                  return (
                    <blockquote className="border-l-3 border-orange-500 pl-3 italic text-gray-600 dark:text-gray-400 my-2">
                      {children}
                    </blockquote>
                  );
                },
                h1({ children }) {
                  return <h1 className="text-lg font-bold mt-3 mb-1.5 text-gray-900 dark:text-white">{children}</h1>;
                },
                h2({ children }) {
                  return <h2 className="text-base font-bold mt-2.5 mb-1 text-gray-900 dark:text-white">{children}</h2>;
                },
                h3({ children }) {
                  return <h3 className="text-sm font-semibold mt-2 mb-1 text-gray-900 dark:text-white">{children}</h3>;
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 underline inline-flex items-center gap-0.5"
                    >
                      {children} <ExternalLink className="w-3 h-3 ml-0.5 inline" />
                    </a>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Action Link Pill (like in reference screenshot: "I have created a project in your Codepen account [View]") */}
        {hasCodepenMention && !isUser && !isError && (
          <div className="mt-3.5 flex items-center justify-between p-2.5 px-3 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              I have created a project ready in your workspace
            </span>
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-orange-500 font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <ExternalLink className="w-3 h-3" />
              <span>View</span>
            </button>
          </div>
        )}
      </div>

      {/* Assistant Footer Actions (Thumbs up/down, Copy, Regenerate) */}
      {!isUser && !isError && (
        <div className="flex flex-wrap items-center gap-2 mt-2 ml-1">
          {/* Reaction Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onFeedback && onFeedback(message.id, 'like')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                message.feedback === 'like'
                  ? 'text-orange-500 bg-orange-50 dark:bg-orange-950/40'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Helpful response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onFeedback && onFeedback(message.id, 'dislike')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                message.feedback === 'dislike'
                  ? 'text-red-500 bg-red-50 dark:bg-red-950/40'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleCopyText}
              className="p-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Regenerate Button (Shown prominently on last assistant message matching reference image) */}
          {isLastAssistant && onRegenerate && (
            <button
              id="regenerate-response-button"
              type="button"
              disabled={isLoading}
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200/90 dark:border-gray-700 shadow-2xs hover:bg-gray-50 dark:hover:bg-gray-750 text-xs font-semibold text-gray-700 dark:text-gray-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3 h-3 text-orange-500 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate response</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
