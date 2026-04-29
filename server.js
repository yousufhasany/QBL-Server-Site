const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Allowed origins for CORS
const allowedOrigins = [
  'https://qbl-client-site-wg5o.vercel.app',
  'https://qbl-client-site-ujgx.vercel.app',
  'https://qbl-server-site.vercel.app',
  'https://qbl-server-site.onrender.com',
  'http://localhost:3000',
  'http://localhost:5000',
];

// Socket.io setup
const io = new Server(server, {
  cors: {
    // Reflect the request origin to avoid Vercel preview domain churn
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

// Middleware
app.use(compression());
app.use(cors({
  // Reflect the request origin to avoid Vercel preview domain churn
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}));
app.options('/*', cors({ origin: true }));
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'QBL API is running' });
});

// Socket.io connection
socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
