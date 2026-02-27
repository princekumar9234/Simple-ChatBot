require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import middlewares
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();

// ========== MIDDLEWARE CONFIGURATION ==========

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'chatbot_secret_key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.default.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Passport config and middleware
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Request logging middleware
app.use(logger);

// ========== STATIC FILES ==========

// Serve React build files (production)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Serve old public folder (images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ========== DATABASE CONNECTION ==========

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');

    // Clear chat history on server start
    await clearChatHistory();

    // Seed initial intents if database is empty
    await seedIntents();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Clear chat history
const clearChatHistory = async () => {
  const Chat = require('./models/Chat');
  try {
    await Chat.deleteMany({});
    console.log('🧹 Chat history cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing chat history:', error.message);
  }
};

// Seed sample intents
const seedIntents = async () => {
  const Intent = require('./models/Intent');
  const count = await Intent.countDocuments();

  if (count === 0) {
    console.log('📝 Seeding initial chatbot intents...');

    const sampleIntents = [
      { keyword: 'hello', response: 'Hello! How can I help you today?' },
      { keyword: 'hi', response: 'Hi there! What can I do for you?' },
      { keyword: 'hey', response: 'Hey! How are you doing?' },
      { keyword: 'how are you', response: 'I\'m doing great, thank you for asking! How about you?' },
      { keyword: 'what is your name', response: 'I\'m an AI Chatbot Assistant, here to help you!' },
      { keyword: 'help', response: 'I can answer your questions! Try asking me about greetings, time, weather, or general queries.' },
      { keyword: 'bye', response: 'Goodbye! Have a great day!' },
      { keyword: 'goodbye', response: 'See you later! Take care!' },
      { keyword: 'thanks', response: 'You\'re welcome! Happy to help!' },
      { keyword: 'thank you', response: 'You\'re very welcome!' },
      { keyword: 'weather', response: 'I don\'t have real-time weather data, but I hope it\'s nice where you are!' },
      { keyword: 'time', response: 'I don\'t have access to real-time clock, but you can check your device!' },
      { keyword: 'joke', response: 'Why did the programmer quit his job? Because he didn\'t get arrays! 😄' },
      { keyword: 'who created you', response: 'I was created by a talented developer as a chatbot project!' },
      { keyword: 'what can you do', response: 'I can chat with you, answer questions, and learn new responses through my admin panel!' }
    ];

    await Intent.insertMany(sampleIntents);
    console.log('✅ Sample intents added successfully');
  }
};

// Connect to database
connectDB();

// ========== ROUTES ==========

// Auth routes (JSON API)
app.use('/auth', authRoutes);

// API route: check current session user (for React auth check)
app.get('/api/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ success: true, user: req.session.user });
  }
  return res.json({ success: false, user: null });
});

// Chat API routes (protected)
const { ensureAuthenticated } = require('./middlewares/auth');
app.use('/api', ensureAuthenticated, chatRoutes);
app.use('/api/admin', adminRoutes);

// Serve React app for all other routes (client-side routing)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ========== ERROR HANDLING ==========

app.use(errorHandler);

// ========== SERVER START ==========

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚛️  React frontend: http://localhost:${PORT}`);
});

module.exports = app;
