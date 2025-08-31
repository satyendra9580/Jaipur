import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';
import healthRouter from './routes/health.js';
import profileRouter from './routes/profile.js';
import projectsRouter from './routes/projects.js';
import skillsRouter from './routes/skills.js';
import searchRouter from './routes/search.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';

const PORT = process.env.PORT || 4000;

// Connect DB
await connectDB(process.env.MONGODB_URI);

// Sync indexes
if (process.env.SYNC_INDEXES === 'true') {
  await Promise.all([Profile.syncIndexes(), Project.syncIndexes()]);
  console.log('MongoDB indexes synchronized');
}

const app = express();

// ✅ Setup CORS
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedSuffixes = (process.env.CORS_ORIGIN_SUFFIXES || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowedOrigin(origin) {
  // No origin (e.g., curl, same-origin) -> allow
  if (!origin) return true;
  // Exact match allowlist
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return true;
  // Suffix allowlist (e.g., .vercel.app)
  if (allowedSuffixes.length > 0) {
    try {
      const hostname = new URL(origin).hostname;
      if (allowedSuffixes.some((suf) => hostname === suf.replace(/^\./, '') || hostname.endsWith(suf))) {
        return true;
      }
    } catch (_) {
      // If URL parsing fails, fall back to plain endsWith on the full origin string
      if (allowedSuffixes.some((suf) => origin.endsWith(suf))) return true;
    }
  }
  return false;
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Explicitly handle preflight requests
app.options('*', cors(corsOptions));

// ✅ Middlewares BEFORE routes
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// ✅ Routes
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});
app.use('/health', healthRouter);
app.use('/api/profile', profileRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/search', searchRouter);

// ✅ Error handlers always last
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
