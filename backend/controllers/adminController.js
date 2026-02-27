const Intent = require('../models/Intent');

/**
 * Add new intent (keyword-response pair)
 * Admin endpoint to add chatbot knowledge
 */
const addIntent = async (req, res, next) => {
  try {
    const { keyword, response } = req.body;

    // Check if keyword already exists
    const existingIntent = await Intent.findOne({ 
      keyword: keyword.toLowerCase().trim() 
    });

    if (existingIntent) {
      // Update existing intent instead of failing
      existingIntent.response = response.trim();
      await existingIntent.save();
      
      return res.status(200).json({
        success: true,
        data: {
          intent: existingIntent
        },
        message: 'Intent updated successfully (keyword already existed)'
      });
    }

    // Create new intent
    const intent = new Intent({
      keyword: keyword.toLowerCase().trim(),
      response: response.trim()
    });

    await intent.save();

    res.status(201).json({
      success: true,
      data: {
        intent
      },
      message: 'Intent added successfully'
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all intents
 * Returns all keyword-response pairs
 */
const getAllIntents = async (req, res, next) => {
  try {
    const intents = await Intent.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        intents,
        total: intents.length
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete an intent
 */
const deleteIntent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const intent = await Intent.findByIdAndDelete(id);

    if (!intent) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Intent not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Intent deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addIntent,
  getAllIntents,
  deleteIntent
};
