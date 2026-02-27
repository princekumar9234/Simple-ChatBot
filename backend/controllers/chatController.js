const Chat = require('../models/Chat');
const Intent = require('../models/Intent');

/**
 * Process user message and generate bot response
 * Uses rule-based matching with keywords from database
 */
const processMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userMessage = message.trim();

    // Convert user message to lowercase for matching
    const lowerMessage = userMessage.toLowerCase();

    // Fetch all intents from database
    const intents = await Intent.find();

    // Find matching intent based on keyword
    let botReply = "I'm sorry, I didn't understand that. Can you please rephrase?";
    
    for (const intent of intents) {
      if (lowerMessage.includes(intent.keyword)) {
        botReply = intent.response;
        break;
      }
    }

    // Save chat to database
    const chat = new Chat({
      userMessage,
      botReply
    });

    await chat.save();

    // Send response
    res.status(200).json({
      success: true,
      data: {
        userMessage,
        botReply,
        timestamp: chat.timestamp
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get chat history
 * Returns all stored conversations
 */
const getChatHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const chats = await Chat.find()
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Chat.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        chats: chats.reverse(), // Reverse to show oldest first
        total,
        limit,
        skip
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  processMessage,
  getChatHistory
};
