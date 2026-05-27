const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --------------- Middleware ---------------
// CORS: Allow our frontend to talk to this API with cookies
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true, // Required for cookies to be sent cross-origin
}));

// Parse JSON request bodies
app.use(express.json());

// Parse cookies from request headers
app.use(cookieParser());

// --------------- Routes ---------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/generate', require('./routes/generateRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ContentFlow AI API is running' });
});

// --------------- Error Handler ---------------
// Must be after routes — catches all unhandled errors
app.use(errorHandler);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ContentFlow AI server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
