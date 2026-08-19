
  {
    id: 'qwen3:1.7b',
    name: 'qwen3:1.7b',
    tag: 'Fast & Default',
    description: 'Fast, lightweight and responsive model for instant answers & code.',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'qwen3:4b',
    name: 'qwen3:4b',
    tag: 'Higher Quality (Soon)',
    description: 'Higher quality reasoning and deep domain expertise (Disabled for now).',
    enabled: false,
    isDefault: false,
  },
];

/**
 * Formats conversation history into a structured prompt context
 * for Ollama models to retain multi-turn context.
 */
export function buildContextPrompt(messages: ChatMessage[], newPrompt: string): string {
  if (!messages || messages.length === 0) {
    return newPrompt;
  }

  const recentMessages = messages.slice(-6);
  let formattedHistory = '';

  for (const msg of recentMessages) {
    if (msg.role === 'user') {
      formattedHistory += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant' && msg.content) {
      formattedHistory += `Assistant: ${msg.content}\n\n`;
    }
  }

  formattedHistory += `User: ${newPrompt}\n\nAssistant:`;
  return formattedHistory;
}

export interface GenerateOptions {
  model: string;
  prompt: string;
  history?: ChatMessage[];
  timeoutMs?: number;
}

/**
 * Send real generate request to Ollama endpoint (via server proxy or direct fallback)
 */
export async function generateOllamaResponse({
  model = 'qwen3:1.7b',
  prompt,
  history = [],
  timeoutMs = 180000,
}: GenerateOptions): Promise<string> {
  const fullPrompt = buildContextPrompt(history, prompt);

  const payload = {
    model,
    prompt: fullPrompt,
    stream: false,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Strategy 1: Try local proxy /api/generate (bypasses browser CORS completely)
  try {
    const proxyRes = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (proxyRes.ok) {
      clearTimeout(timeoutId);
      const data = await proxyRes.json();
      if (typeof data.response === 'string') {
        return data.response;
      }
    }
  } catch (proxyErr) {
    console.warn('[Magnetar AI] Proxy request error, falling back to direct endpoint:', proxyErr);
  }

  // Strategy 2 removed — direct browser calls cause CORS/cross-region issues.
  // Always go through the server proxy.
  throw new Error('Unable to connect to the AI server. Please try again.');
}
