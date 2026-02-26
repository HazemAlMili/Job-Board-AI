import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './utils/errors';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// OpenRouter AI test endpoint
app.get('/api/test/openrouter', async (req, res) => {
  try {
    const { openrouterClient, openrouterModel } = await import('./config/openrouter');
    if (!openrouterClient) {
      return res.status(500).json({ error: 'OpenRouter client not initialized' });
    }
    const result = await openrouterClient.chat.completions.create({
      model: openrouterModel,
      messages: [{ role: 'user', content: 'Say "OpenRouter AI is working!" in a friendly way.' }],
    });
    const text = result.choices[0].message.content;
    res.json({ success: true, response: text });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// AI Evaluation trigger — called by frontend after submitting application to Supabase
app.post('/api/queue/evaluate/:id', async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    if (isNaN(applicationId)) {
      return res.status(400).json({ error: 'Invalid application ID' });
    }
    const { evaluationQueue } = await import('./services/queue.service');
    if (process.env.VERCEL) {
      // In serverless, we must await the evaluation since background tasks are killed
      await evaluationQueue.evaluateApplication(applicationId);
    } else {
      await evaluationQueue.add(applicationId);
    }
    res.json({ success: true, message: `Application ${applicationId} evaluation triggered` });
  } catch (error: any) {
    console.error('Queue trigger error:', error);
    res.status(500).json({ error: 'Failed to queue evaluation' });
  }
});

// Root endpoint to prevent 404 on base URL
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Job Board AI Auto-Evaluation API', status: 'online' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Start server only if not in a Vercel serverless environment
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`
🚀 Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📝 API: http://localhost:${PORT}/api
    `);
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} received: shutting down...`);
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;
