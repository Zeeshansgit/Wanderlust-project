// import compression from 'compression';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';
// import express from 'express';
// import connectDB from './config/db.js';
// import { PORT } from './config/utils.js';
// import authRouter from './routes/auth.js';
// import postsRouter from './routes/posts.js';
// import { connectToRedis } from './services/redis.js';

// const app = express();
// const port = PORT || 5000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(cookieParser());
// app.use(compression());

// // Connect to database
// connectDB();

// // Connect to redis
// connectToRedis();

// // API routes
// app.use('/api/posts', postsRouter);
// app.use('/api/blogs', postsRouter); // ✅ Added compatibility route
// app.use('/api/auth', authRouter);

// app.get('/', (req, res) => {
//   res.send('Yay!! Backend of wanderlust prod app is now accessible');
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// export default app;

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import connectDB from './config/db.js';
import { PORT } from './config/utils.js';

import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

import { connectToRedis } from './services/redis.js';

const app = express();
const port = PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect Database
connectDB();

// Connect Redis
connectToRedis();

// Routes
app.use('/api/posts', postsRouter);
app.use('/api/blogs', postsRouter); // Compatibility route
app.use('/api/auth', authRouter);

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Wanderlust Backend is Running',
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL}`);
});

export default app;