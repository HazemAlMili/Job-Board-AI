import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database';
import { errorHandler } from './utils/errors';
import db from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import jobsRoutes from './routes/jobs.routes';
import applicationsRoutes from './routes/applications.routes';
import hrRoutes from './routes/hr.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5147;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
// Express 5: Explicitly set extended to true (default is now false)
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gemini AI test endpoint
app.get('/api/test/gemini', async (req, res) => {
  try {
    const { geminiClient, geminiModel } = await import('./config/gemini');
    
    if (!geminiClient) {
      return res.status(500).json({ 
        error: 'Gemini client not initialized',
        message: 'Please set GEMINI_API_KEY in your .env file'
      });
    }

    const testPrompt = 'Say "Gemini AI is working!" in a friendly way.';
    
    const model = geminiClient.getGenerativeModel({ model: geminiModel });
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      message: 'Gemini AI connection successful!',
      model: geminiModel,
      prompt: testPrompt,
      response: text,
    });
  } catch (error: any) {
    console.error('Gemini test error:', error);
    res.status(500).json({
      success: false,
      error: 'Gemini test failed',
      message: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/hr', hrRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
// Express 5: app.listen now passes errors to callback
async function startServer() {
  let server: any = null;

  const gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} signal received: starting graceful shutdown...`);

    if (server) {
      server.close(() => {
        console.log('HTTP server closed');
      });

      // Force close server after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    }

    // Close database connection
    try {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
          process.exit(1);
        } else {
          console.log('Database connection closed');
          console.log('Graceful shutdown completed');
          process.exit(0);
        }
      });
    } catch (error) {
      console.error('Error during database shutdown:', error);
      process.exit(1);
    }
  };

  // Handle shutdown signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  try {
    await initDatabase();
    
    server = app.listen(PORT, (error?: Error) => {
      if (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
      console.log(`
🚀 Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📝 API: http://localhost:${PORT}/api
      `);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

startServer();

export default app;
