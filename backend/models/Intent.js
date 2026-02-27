const mongoose = require('mongoose');

/**
 * Intent Schema
 * Stores chatbot keywords and their corresponding responses
 */
const intentSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: [true, 'Keyword is required'],
    trim: true,
    lowercase: true,
    unique: true
  },
  response: {
    type: String,
    required: [true, 'Response is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// No need for explicit index as unique: true already creates one
// intentSchema.index({ keyword: 1 });

module.exports = mongoose.model('Intent', intentSchema);
