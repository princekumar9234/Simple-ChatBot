/**
 * Chatbot Training Script
 * This script adds multiple intents to train your chatbot
 * Run this file to populate the database with knowledge
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Intent = require("./models/Intent"); //require  intent model

// Training data - Add your own intents here!
const trainingData = [
  // About the Bot
  {
    keyword: "who are you",
    response: "I am an Arise Assistant, created by Prince Chauhan!",
  },
  { keyword: "what is my nickname", response: "my nickname is chiku !" },
  {
    keyword: "how old are you",
    response: "i was created by prince chauhan in 1 january 2026!",
  },
  {
    keyword: "what is your name",
    response: "I am arise assistant. You can call me ChatBot!",
  },
  {
    keyword: "what is my friends name",
    response: "master your friends name is piyush,ankesh and ayush",
  },

  // Greetings (additional)
  {
    keyword: "good morning",
    response: "Good morning! Hope you have a wonderful day ahead!",
  },
  {
    keyword: "good afternoon",
    response: "Good afternoon! How can I assist you today?",
  },
  { keyword: "good evening", response: "Good evening! How are you doing?" },
  {
    keyword: "good night",
    response: "Good night! Sleep well and sweet dreams!",
  },

  // Feelings
  {
    keyword: "how are you",
    response: "I'm doing great, thank you for asking! How about you?",
  },
  {
    keyword: "are you ok",
    response: "Yes, I'm functioning perfectly! Thanks for checking!",
  },

  // Capabilities
  {
    keyword: "what can you do",
    response:
      "I can chat with you, answer questions, and learn new responses through my admin panel!",
  },
  {
    keyword: "help me",
    response:
      "I'm here to help! You can ask me questions about various topics, or just chat with me!",
  },
  {
    keyword: "how do you work",
    response:
      "I use keyword matching to understand your questions and provide relevant answers from my knowledge base!",
  },

  // Technology
  {
    keyword: "what is computer",
    response:
      "A computer is an electronic device that processes data and performs tasks according to instructions.",
  },
  {
    keyword: "what is internet",
    response:
      "The Internet is a global network connecting millions of computers worldwide.",
  },
  {
    keyword: "ai",
    response:
      "AI (Artificial Intelligence) is the simulation of human intelligence by machines, especially computer systems.",
  },

  {
    keyword: "what is programming language",
    response:
      "Programming is the process of creating instructions for computers to follow. Popular languages include Python, JavaScript, and Java.",
  },

  {
    keyword: "what is javascript",
    response:
      "JavaScript is a popular programming language used for web development, both frontend and backend!",
  },
  {
    keyword: "what is python",
    response:
      "Python is a versatile, beginner-friendly programming language used for web development, data science, AI, and more!",
  },

  //java related
  {
    keyword: "what is java",
    response:
      "Java is a popular and powerful programming language, created in 1995.It is owned by Oracle, and more than 3 billion devices run Java.",
  },
  // Politeness
  {
    keyword: "please",
    response: "Of course! I'm here to help. What do you need?",
  },
  { keyword: "sorry", response: "No need to apologize! How can I assist you?" },
  { keyword: "excuse me", response: "Yes, how may I help you?" },

  // Farewells (additional)
  { keyword: "see you", response: "See you later! Take care!" },
  {
    keyword: "talk to you later",
    response: "Sure! Looking forward to our next chat!",
  },
  {
    keyword: "catch you later",
    response: "Catch you later! Have a great day!",
  },

  // Personal Information (Example - Modify these!)
  {
    keyword: "developer name",
    response: "This chatbot was created by Prince Kumar!",
  },
  {
    keyword: "project name",
    response: "This is a Chatbot Web Application project!",
  },
  {
    keyword: "technology used",
    response:
      "This chatbot uses Node.js, Express, MongoDB, EJS, HTML, CSS, and JavaScript!",
  },
  {
    keyword: "what is my name",
    response: "my master your name is prince chauhan",
  },
];

// Connect to MongoDB and add intents
const trainChatbot = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log("🎓 Starting chatbot training...");
    console.log(`📚 Adding ${trainingData.length} intents to the database\n`);

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const data of trainingData) {
      try {
        // Check if intent already exists
        const keyword = data.keyword.toLowerCase();
        const existing = await Intent.findOne({ keyword });

        if (existing) {
          if (existing.response !== data.response) {
            // Update existing intent
            existing.response = data.response;
            await existing.save();
            console.log(`🔄 Updated: "${data.keyword}" (response changed)`);
            updatedCount++;
          } else {
            console.log(
              `⏭️  Skipped: "${data.keyword}" (already exists and matches)`,
            );
            skippedCount++;
          }
        } else {
          // Add new intent
          const intent = new Intent({
            keyword: keyword,
            response: data.response,
          });
          await intent.save();
          console.log(`✅ Added: "${data.keyword}"`);
          addedCount++;
        }
      } catch (error) {
        console.log(`❌ Error processing "${data.keyword}": ${error.message}`);
        errorCount++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Training Complete!");
    console.log("=".repeat(50));
    console.log(`✅ Successfully added: ${addedCount} intents`);
    console.log(`🔄 Successfully updated: ${updatedCount} intents`);
    console.log(`⏭️  Skipped (no changes): ${skippedCount} intents`);
    console.log(`❌ Errors: ${errorCount} intents`);
    console.log(
      `📊 Total in database: ${await Intent.countDocuments()} intents`,
    );
    console.log("=".repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Training failed:", error.message);
    process.exit(1);
  }
};

// Run the training
trainChatbot();
