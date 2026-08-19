import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_OLLAMA_API =
  process.env.OLLAMA_API_URL || 'https://n8n.magnetarsolutions.com/models/api/generate';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Real Ollama AI proxy endpoint to bypass any browser CORS restrictions
  app.post('/api/generate', async (req, res) => {
    try {
      const { model = 'qwen3:1.7b', prompt, stream = false } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      console.log(`[Server] Proxying real Ollama request for model: ${model}`);

      const response = await fetch(TARGET_OLLAMA_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: Boolean(stream),
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error(`[Server] Ollama upstream error (${response.status}):`, errBody);
        return res.status(response.status).json({
          error: `Upstream Ollama returned status ${response.status}`,
          details: errBody,
        });
      }

      const data = await response.json();

      // Ensure ONLY response is sent to the client, suppressing internal thinking
      return res.json({
        model: data.model || model,
        response: data.response || '',
        done: data.done ?? true,
        created_at: data.created_at || new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('[Server] Internal proxy exception:', err);
      return res.status(500).json({
        error: 'Unable to connect to the AI server. Please try again.',
        details: err?.message || String(err),
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      endpoint: TARGET_OLLAMA_API,
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware in dev mode / static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Magnetar AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
