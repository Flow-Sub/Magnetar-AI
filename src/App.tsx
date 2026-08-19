import React, { useState } from 'react';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { HistorySidebar } from './components/HistorySidebar';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessageList } from './components/ChatMessageList';
import { ChatInput } from './components/ChatInput';
import { ProModal } from './components/Modals/ProModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { UpdatesModal } from './components/Modals/UpdatesModal';
import { ChatSession, ChatMessage } from './types';
import { generateOllamaResponse } from './services/api';

function createFreshSession(model: string = 'qwen3:1.7b'): ChatSession {
  return {
    id: `session-${Date.now()}`,
    title: 'New Chat',
    category: 'General',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    model,
  };
}

export default function App() {
  // In-memory sessions initialized with a fresh empty chat session (no mock data, clears on refresh)
  const [sessions, setSessions] = useState<ChatSession[]>(() => [createFreshSession()]);

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || 'session-initial');

  // Model selection (default 'qwen3:1.7b' active, 'qwen3:4b' disabled)
  const [selectedModel, setSelectedModel] = useState<string>('qwen3:1.7b');

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Layout toggles
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<SidebarTab>('chat');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isUpdatesModalOpen, setIsUpdatesModalOpen] = useState<boolean>(false);

  // Get active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0] || createFreshSession(selectedModel);

  // Start a new chat session (isolated environment)
  const handleNewChat = () => {
    const newSession = createFreshSession(selectedModel);
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setCurrentTab('chat');
    setIsMobileSidebarOpen(false);
  };

  // Send message to live Ollama API
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      status: 'success',
    };

    // Update active session with user message
    const updatedMessages = [...activeSession.messages, userMessage];

    // Auto-generate title from first user message if still "New Chat"
    let sessionTitle = activeSession.title;
    if (activeSession.title === 'New Chat' || !activeSession.title) {
      sessionTitle = text.slice(0, 26) + (text.length > 26 ? '...' : '');
    }

    const updatedSession: ChatSession = {
      ...activeSession,
      title: sessionTitle,
      messages: updatedMessages,
      updatedAt: Date.now(),
      model: selectedModel,
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSession.id ? updatedSession : s))
    );

    setIsLoading(true);

    try {
      // POST to real live endpoint https://n8n.magnetarsolutions.com/models/api/generate
      const responseText = await generateOllamaResponse({
        model: selectedModel,
        prompt: text,
        history: activeSession.messages,
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        model: selectedModel,
        status: 'success',
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...updatedMessages, assistantMessage],
              updatedAt: Date.now(),
            };
          }
          return s;
        })
      );
    } catch (err: unknown) {
      console.error('[Magnetar AI] Error during chat completion:', err);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Unable to connect to the AI server. Please try again.',
        timestamp: Date.now(),
        model: selectedModel,
        status: 'error',
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...updatedMessages, errorMessage],
              updatedAt: Date.now(),
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate response for the latest assistant message
  const handleRegenerate = async () => {
    if (isLoading || activeSession.messages.length === 0) return;

    const lastUserMsgIndex = activeSession.messages
      .map((m) => m.role)
      .lastIndexOf('user');

    if (lastUserMsgIndex === -1) return;

    const userPrompt = activeSession.messages[lastUserMsgIndex].content;
    const historyBefore = activeSession.messages.slice(0, lastUserMsgIndex);
    const cleanMessages = activeSession.messages.slice(0, lastUserMsgIndex + 1);

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: cleanMessages,
          };
        }
        return s;
      })
    );

    setIsLoading(true);

    try {
      const responseText = await generateOllamaResponse({
        model: selectedModel,
        prompt: userPrompt,
        history: historyBefore,
      });

      const newAssistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        model: selectedModel,
        status: 'success',
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...cleanMessages, newAssistantMessage],
              updatedAt: Date.now(),
            };
          }
          return s;
        })
      );
    } catch (err: unknown) {
      console.error('[Magnetar AI] Regenerate error:', err);

      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: 'Unable to connect to the AI server. Please try again.',
        timestamp: Date.now(),
        model: selectedModel,
        status: 'error',
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSession.id) {
            return {
              ...s,
              messages: [...cleanMessages, errorMessage],
              updatedAt: Date.now(),
            };
          }
          return s;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback action (like/dislike)
  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: s.messages.map((m) =>
              m.id === messageId ? { ...m, feedback: m.feedback === feedback ? null : feedback } : m
            ),
          };
        }
        return s;
      })
    );
  };

  // Delete session
  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionId);
      if (sessionId === activeSessionId) {
        if (filtered.length > 0) {
          setActiveSessionId(filtered[0].id);
        } else {
          const fresh = createFreshSession(selectedModel);
          filtered.push(fresh);
          setActiveSessionId(fresh.id);
        }
      }
      return filtered;
    });
  };

  // Clear all history
  const handleClearHistory = () => {
    const freshSession = createFreshSession(selectedModel);
    setSessions([freshSession]);
    setActiveSessionId(freshSession.id);
  };

  // Select tab from sidebar
  const handleSelectTab = (tab: SidebarTab) => {
    setCurrentTab(tab);
    if (tab === 'settings') {
      setIsSettingsModalOpen(true);
    }
  };

  const handleLogout = () => {
    handleClearHistory();
    alert('Logged out and cleared active workspace session.');
  };

  return (
    /* Outer background dark frame with rounded container matching reference image */
    <div
      id="magnetar-app-root"
      className="flex h-screen w-screen bg-[#111216] p-1.5 sm:p-3 overflow-hidden select-text text-gray-900 font-sans"
    >
      {/* Main App Rounded Frame Card */}
      <div className="w-full h-full flex overflow-hidden rounded-[26px] sm:rounded-[30px] border border-gray-800/80 shadow-2xl bg-[#181920] relative">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenProModal={() => setIsProModalOpen(true)}
          onLogout={handleLogout}
          onNewChat={handleNewChat}
        />

        {/* Mobile Drawer Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <div className="w-60 h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar
                currentTab={currentTab}
                onSelectTab={(tab) => {
                  handleSelectTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                isCollapsed={false}
                onToggleCollapse={() => setIsMobileSidebarOpen(false)}
                onOpenProModal={() => {
                  setIsProModalOpen(true);
                  setIsMobileSidebarOpen(false);
                }}
                onLogout={handleLogout}
                onNewChat={handleNewChat}
              />
            </div>
          </div>
        )}

        {/* Center Main Chat Panel - Clean White Rounded Card */}
        <main
          id="main-chat-viewport"
          className="relative flex-1 flex flex-col h-full min-w-0 bg-white transition-colors"
        >
          {/* Header */}
          <ChatHeader
            title={activeSession.title}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            isDark={false}
            onNewChat={handleNewChat}
            onOpenInfo={() => setIsUpdatesModalOpen(true)}
            onOpenNotifications={() => setIsUpdatesModalOpen(true)}
            isHistoryOpen={isHistoryOpen}
            onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Messages Thread & Empty Suggestions */}
          <ChatMessageList
            messages={activeSession.messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onRegenerate={handleRegenerate}
            onFeedback={handleFeedback}
            isDark={false}
            selectedModel={selectedModel}
            searchFilter={searchQuery}
          />

          {/* Bottom Chat Input Bar */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isDark={false}
          />
        </main>

        {/* Right Conversation History Sidebar */}
        <HistorySidebar
          sessions={sessions.filter((s) => s.messages.length > 0)}
          activeSessionId={activeSession.id}
          onSelectSession={(id) => {
            setActiveSessionId(id);
            setCurrentTab('chat');
          }}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
          onClearHistory={handleClearHistory}
          isOpen={isHistoryOpen}
          onToggleOpen={() => setIsHistoryOpen(!isHistoryOpen)}
          isDark={false}
        />
      </div>

      {/* Pro Modal */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isDark={true}
      />

      {/* Simple Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        isDark={true}
      />

      {/* Info / Documentation Modal */}
      <UpdatesModal
        isOpen={isUpdatesModalOpen}
        onClose={() => setIsUpdatesModalOpen(false)}
        isDark={true}
      />
    </div>
  );
}
