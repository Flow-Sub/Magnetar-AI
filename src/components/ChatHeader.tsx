import React from 'react';
import {
  Search,
  Bell,
  Info,
  Plus,
  PanelRight,
  Menu,
} from 'lucide-react';
import { ModelSelector } from './ModelSelector';

interface ChatHeaderProps {
  title: string;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  isDark: boolean;
  onNewChat: () => void;
  onOpenInfo: () => void;
  onOpenNotifications: () => void;
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  selectedModel,
  onSelectModel,
  isDark,
  onNewChat,
  onOpenInfo,
  onOpenNotifications,
  isHistoryOpen,
  onToggleHistory,
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header
      id="chat-header-bar"
      className={`h-16 px-4 sm:px-6 flex items-center justify-between border-b transition-colors shrink-0 select-none ${
        isDark
          ? 'bg-[#181920] border-gray-800/80 text-gray-100'
          : 'bg-white border-gray-200/80 text-gray-900'
      }`}
    >
      {/* Left: Mobile Menu + Title + Model Selector */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
          AI Chat Helper
        </h1>

        {/* Model Selector Dropdown */}
        <ModelSelector
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
          isDark={isDark}
        />
      </div>

      {/* Right: Search, Notification, Info, New Chat, History Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Search Input Bar (matching reference screenshot) */}
        <div className="hidden md:flex items-center relative">
          <Search className="w-3.5 h-3.5 absolute left-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className={`w-32 sm:w-44 pl-8.5 pr-3 py-1.5 text-xs rounded-xl border transition-all focus:outline-hidden ${
              isDark
                ? 'bg-[#131419] border-gray-700/80 text-gray-200 focus:border-orange-500'
                : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-orange-500'
            }`}
          />
        </div>

        {/* Notification Bell */}
        <button
          id="header-notifications-button"
          type="button"
          onClick={onOpenNotifications}
          className={`p-2 rounded-xl border text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ${
            isDark ? 'border-gray-700/80 bg-[#131419]' : 'border-gray-200 bg-white'
          }`}
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Info Icon Button */}
        <button
          id="header-info-button"
          type="button"
          onClick={onOpenInfo}
          className={`p-2 rounded-xl border text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ${
            isDark ? 'border-gray-700/80 bg-[#131419]' : 'border-gray-200 bg-white'
          }`}
          title="Information"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Quick New Chat Button */}
        <button
          id="header-new-chat-button"
          type="button"
          onClick={onNewChat}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] active:scale-95 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          title="New Chat"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>

        {/* Toggle History Sidebar button */}
        <button
          type="button"
          onClick={onToggleHistory}
          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
            isHistoryOpen
              ? 'text-orange-500 border-orange-500/40 bg-orange-50/20'
              : 'text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700/80'
          }`}
          title={isHistoryOpen ? 'Hide history' : 'Show history'}
        >
          <PanelRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
