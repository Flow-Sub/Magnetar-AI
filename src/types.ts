export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  model?: string;
  status?: 'sending' | 'success' | 'error';
  errorMessage?: string;
  codeSnippets?: {
    language: string;
    code: string;
    filename?: string;
  }[];
  feedback?: 'like' | 'dislike' | null;
}

export interface ChatSession {
  id: string;
  title: string;
  category?: 'General' | 'Coding' | 'Career' | 'Instructions' | 'Onboarding' | 'Design';
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface AIModel {
  id: string;
  name: string;
  tag: string;
  description: string;
  enabled: boolean;
  isDefault?: boolean;
}

export interface OllamaGenerateResponse {
  model?: string;
  created_at?: string;
  response?: string;
  thinking?: string;
  done?: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}
