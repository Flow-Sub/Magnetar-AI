import React, { useState } from 'react';
import {
  Trash2,
  Search,
  CheckSquare,
  Square,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { ChatSession } from '../types';

interface HistorySidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onClearHistory: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  isDark?: boolean;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearHistory,
  isOpen,
  onToggleOpen,
  isDark = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredSessions = sessions.filter((s) => {
    const titleMatch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const snippetMatch = s.messages.some((m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return titleMatch || snippetMatch;
  });

  const toggleSelectSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Split Collapse Toggle Button */}
      <button
        id="history-toggle-pill"
        type="button"
        onClick={onToggleOpen}
        className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-5 h-10 rounded-l-lg items-center justify-center border-y border-l shadow-sm transition-all cursor-pointer ${
          isOpen ? 'mr-64 lg:mr-72' : 'mr-0'
        } ${
          isDark
            ? 'bg-[#1e1f27] border-gray-700 text-gray-400 hover:text-white'
            : 'bg-white border-gray-300 text-gray-500 hover:text-gray-900'
        }`}
        title={isOpen ? 'Collapse history' : 'Open history'}
      >
        {isOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* History Sidebar Panel */}
      <aside
        id="history-sidebar"
        className={`h-full transition-all duration-300 flex flex-col justify-between shrink-0 z-20 select-none ${
          isOpen ? 'w-64 lg:w-72 border-l' : 'w-0 overflow-hidden border-none'
        } ${
          isDark
            ? 'bg-[#181920] border-gray-800/80 text-gray-200'
            : 'bg-white border-gray-200/80 text-gray-800'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900 dark:text-white">History</h2>
            <span className="text-xs font-mono text-gray-400">
              {sessions.length}/50
            </span>
          </div>

          {/* Search History */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className={`w-full pl-8.5 pr-3 py-1.5 rounded-xl text-xs border transition-all focus:outline-hidden ${
                isDark
                  ? 'bg-[#131419] border-gray-700/80 text-gray-200 focus:border-orange-500'
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-orange-500'
              }`}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <MessageSquare className="w-7 h-7 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-xs text-gray-400">No active history</p>
              <button
                type="button"
                onClick={onNewChat}
                className="mt-2 text-xs text-orange-500 hover:underline font-semibold cursor-pointer"
              >
                Start a new chat
              </button>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isChecked = selectedIds.includes(session.id);
              const firstUserMsg = session.messages.find((m) => m.role === 'user')?.content || 'New chat session';
              const snippet = firstUserMsg.length > 50 ? `${firstUserMsg.substring(0, 50)}...` : firstUserMsg;

              return (
                <div
                  key={session.id}
                  id={`history-item-${session.id}`}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative rounded-2xl p-3 transition-all cursor-pointer border ${
                    isActive
                      ? isDark
                        ? 'bg-[#22242f] border-gray-700 shadow-md ring-1 ring-orange-500/30'
                        : 'bg-white border-gray-200/90 shadow-md ring-1 ring-orange-500/30'
                      : isDark
                      ? 'bg-transparent border-transparent hover:bg-gray-800/40'
                      : 'bg-transparent border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => toggleSelectSession(e, session.id)}
                      className="mt-0.5 text-gray-400 hover:text-orange-500 cursor-pointer shrink-0 transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-3.5 h-3.5 text-orange-500" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold truncate text-gray-900 dark:text-white mb-0.5">
                        {session.title || 'Untitled Chat'}
                      </h4>

                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug line-clamp-2">
                        {snippet}
                      </p>
                    </div>
                  </div>

                  {/* Delete icon */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 top-2 p-1 rounded text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Action: Clear history */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800/80">
          <button
            id="clear-history-button"
            type="button"
            onClick={onClearHistory}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              isDark
                ? 'border-gray-700/80 text-gray-400 hover:text-red-400 hover:bg-gray-800/60'
                : 'border-gray-200 text-gray-600 hover:text-red-600 hover:bg-gray-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        </div>
      </aside>
    </>
  );
};
