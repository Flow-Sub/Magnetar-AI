import React from 'react';
import {
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Flame,
} from 'lucide-react';

export type SidebarTab = 'chat' | 'settings';

interface SidebarProps {
  currentTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenProModal: () => void;
  onLogout: () => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenProModal,
  onLogout,
  onNewChat,
}) => {
  return (
    <aside
      id="left-sidebar"
      className={`h-full bg-[#181920] text-gray-300 flex flex-col justify-between transition-all duration-300 border-r border-gray-800/60 z-20 shrink-0 select-none ${
        isCollapsed ? 'w-18' : 'w-56 lg:w-60'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="p-4">
        {/* Brand & Collapse */}
        <div className="flex items-center justify-between mb-6">
          <div
            onClick={onNewChat}
            className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
            title="Start new chat"
          >
            {/* MindMerge / Magnetar Style Logo */}
            <div className="w-8 h-8 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
              <Flame className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <span className="font-bold text-base text-white tracking-tight">
                Magnetar AI
              </span>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            id="toggle-sidebar-button"
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Clean, Focused Navigation (Other tabs removed as requested) */}
        <nav className="space-y-2">
          <button
            id="sidebar-tab-chat"
            type="button"
            onClick={() => onSelectTab('chat')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'chat'
                ? 'bg-gray-800/90 text-white shadow-xs border border-gray-700/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
            }`}
          >
            <MessageSquare
              className={`w-4 h-4 shrink-0 ${
                currentTab === 'chat' ? 'text-orange-500' : 'text-gray-400'
              }`}
            />
            {!isCollapsed && <span>AI Chat Helper</span>}
          </button>

          <button
            id="sidebar-tab-settings"
            type="button"
            onClick={() => onSelectTab('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              currentTab === 'settings'
                ? 'bg-gray-800/90 text-white shadow-xs border border-gray-700/50'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
            }`}
          >
            <Settings
              className={`w-4 h-4 shrink-0 ${
                currentTab === 'settings' ? 'text-orange-500' : 'text-gray-400'
              }`}
            />
            {!isCollapsed && <span>Settings</span>}
          </button>
        </nav>
      </div>

      {/* Bottom Section: Pro Plan Card + Logout */}
      <div className="p-4 space-y-3">
        {/* Fiery Pro Plan Card matching reference image */}
        {!isCollapsed ? (
          <div
            id="sidebar-pro-card"
            className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fb923c] text-white shadow-lg shadow-orange-500/20"
          >
            {/* Background fluid blob */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full blur-lg pointer-events-none" />

            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <h3 className="font-bold text-xs tracking-tight text-white">Pro Plan</h3>
            </div>

            <p className="text-[11px] text-white/95 leading-tight mb-3 font-normal">
              Strengthen artificial intelligence: get plan!
            </p>

            <div className="flex items-center justify-between pt-0.5">
              <span className="font-bold text-xs text-white">
                $10 <span className="font-normal text-[10px]">/ mo</span>
              </span>
              <button
                id="pro-plan-get-button"
                type="button"
                onClick={onOpenProModal}
                className="px-3 py-1 rounded-full bg-white text-orange-600 font-bold text-xs hover:bg-white/95 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                Get
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenProModal}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-center shadow-md cursor-pointer hover:opacity-90 transition-opacity"
            title="Upgrade to Pro Plan ($10/mo)"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}

        {/* Log out */}
        <button
          id="sidebar-logout-button"
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-800/40 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
};
