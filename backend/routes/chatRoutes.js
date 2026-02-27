const express = require('express');
const router = express.Router();
const { processMessage, getChatHistory } = require('../controllers/chatController');
const { validateChatMessage } = require('../middlewares/validator');

/**
 * POST /api/chat
 * Process user message and return bot response
 */
router.post('/chat', validateChatMessage, processMessage);

/**
 * GET /api/chat/history
 * Get chat conversation history
 */
router.get('/chat/history', getChatHistory);

module.exports = router;
