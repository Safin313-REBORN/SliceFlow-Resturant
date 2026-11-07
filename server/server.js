import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { setupSockets } from './sockets/socketHandler.js';
import { initCronJobs } from './jobs/cronJobs.js';

import authRoutes from './routes/authRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import User from './models/User.js';
import { seedDatabase } from './scripts/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

const CLIENT_ORIGIN = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});
app.set('io', io);
setupSockets(io);

// 2. Global Defensive Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://*.unsplash.com'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com', 'https://*.razorpay.com', 'https://cdn.razorpay.com'],
        workerSrc: ["'self'", 'blob:'],
        frameSrc: ["'self'", 'https://api.razorpay.com'],
        connectSrc: ["'self'", 'https://lumberjack.razorpay.com', 'ws:', 'wss:', 'http://localhost:*', 'ws://localhost:*'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      },
    },
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'sliceflow_cookie_secret'));

// 3. Rate Limiting on General API Traffic
app.use('/api', apiLimiter);

// 4. API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'SliceFlow Core Backend API',
    version: '1.0.0',
  });
});

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// 6. Serve Production Frontend if Built
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('SliceFlow Backend API Server is running. Frontend dev server is at ' + CLIENT_ORIGIN);
    }
  });
});

// 7. Centralized Error Handling Middleware
app.use(errorHandler);

// 8. Server Boot & Database Initialization
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('⚡ Empty database detected. Running automatic initial seeding...');
    await seedDatabase();
  }

  // Initialize cron schedulers
  initCronJobs();

  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🍕 SliceFlow Server is running on port ${PORT}`);
    console.log(`🌐 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`📡 Socket.IO Real-Time Engine: Ready`);
    console.log(`🔒 Security Headers & CORS Enabled for: ${CLIENT_ORIGIN}`);
    console.log(`======================================================\n`);
  });
};

// Export for test suites or run directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export { app, server, io, startServer };

