const mongoose = require('mongoose');

/**
 * Chat Schema
 * Stores individual chat messages between user and bot
 */
const chatSchema = new mongoose.Schema({
  userMessage: {
    type: String,
    required: [true, 'User message is required'],
    trim: true
  },
  botReply: {
    type: String,
    required: [true, 'Bot reply is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }                                                                                                              
});

// Index for faster queries on timestamp
chatSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Chat', chatSchema);
