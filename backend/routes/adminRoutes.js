const express = require('express');
const router = express.Router();
const { addIntent, getAllIntents, deleteIntent } = require('../controllers/adminController');
const { validateIntent } = require('../middlewares/validator');

/**
 * POST /api/admin/intent
 * Add new chatbot intent (keyword-response pair)
 */
router.post('/intent', validateIntent, addIntent);

/**
 * GET /api/admin/intents
 * Get all intents
 */
router.get('/intents', getAllIntents);

/**
 * DELETE /api/admin/intent/:id
 * Delete an intent
 */
router.delete('/intent/:id', deleteIntent);

module.exports = router;
