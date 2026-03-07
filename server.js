const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const socketHandler = require('./sockets/socketHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'https://qbl-server-site.vercel.app',
      'https://qbl-server-site.onrender.com',
      'http://localhost:3000',
      'http://localhost:5000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: [
    'https://qbl-server-site.vercel.app',
    'https://qbl-server-site.onrender.com',
    'http://localhost:3000',
    'http://localhost:5000',
  ],
  methods: ['GET', 'POST'],
  credentials: true,
}));
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
