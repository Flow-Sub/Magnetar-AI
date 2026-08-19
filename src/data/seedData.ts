import { ChatSession } from '../types';

// Start with empty clean sessions for real live requests (no mock data)
export const INITIAL_CHAT_SESSIONS: ChatSession[] = [];

export const PROMPT_SUGGESTIONS = [
  {
    title: 'Create welcome form',
    subtitle: 'Write code (HTML, CSS and JS) for an interactive form',
    prompt: 'Write code (HTML, CSS and JS) for a simple welcome form with interactive buttons.',
  },
  {
    title: 'Test Live Connection',
    subtitle: 'Say hello in one short sentence',
    prompt: 'Say hello in one short sentence.',
  },
  {
    title: 'Productivity Tips',
    subtitle: 'Tips to improve productivity at work',
    prompt: 'What are the top 3 practical tips to improve productivity at work?',
  },
  {
    title: 'Wi-Fi Setup Instructions',
    subtitle: 'How to set up a Wi-Fi wireless network securely',
    prompt: 'How to set up a Wi-Fi wireless network securely?',
  },
];
