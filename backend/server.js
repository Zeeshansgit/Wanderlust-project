import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import connectDB from './config/db.js';
import { PORT } from './config/utils.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
// import { connectToRedis } from './services/redis.js';

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
        origin: [
            "http://localhost",
            "http://localhost:5173"
        ],
        credentials: true,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


// Connect Database
connectDB();


// Redis disabled (not installed on VM)
// connectToRedis();


// Routes
app.use('/api/posts', postsRouter);

app.use('/api/blogs', postsRouter);

app.use('/api/auth', authRouter);


// Health Check
app.get('/', (req, res) => {

    res.status(200).json({
        success: true,
        message: 'Wanderlust Backend is Running'
    });

});


// Start Server
app.listen(port, () => {

    console.log(`🚀 Server running on port ${port}`);

    console.log(`🌍 Allowed Frontend URLs:
    - http://localhost
    - http://localhost:5173
    `);

});


export default app;