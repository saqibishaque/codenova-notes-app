const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { initSchema } = require('./database');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/notes', notesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CodeNova Notes API'
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CodeNova Notes Application API',
    endpoints: {
      notes: '/api/notes',
      health: '/api/health'
    }
  });
});

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.'
  });
});

// Initialize database schema and start server
async function startServer() {
  try {
    await initSchema();
    app.listen(PORT, () => {
      console.log(`🚀 CodeNova Notes Server running at http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
