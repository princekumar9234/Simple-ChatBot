/**
 * Chatbot Training Script
 * This script adds multiple intents to train your chatbot
 * Run this file to populate the database with knowledge
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Intent = require('./models/Intent');

// Training data - Add your own intents here!
const trainingData = [
  // About the Bot
  { keyword: 'who are you', response: 'I am an AI Chatbot Assistant, created to help answer your questions and have conversations with you!' },
  { keyword: 'your name', response: 'I am an AI Assistant. You can call me ChatBot!' },
  { keyword: 'what is my friends name', response: 'master your friends name is piyush,ankesh and ayush' },
  { keyword: 'how old are you', response: 'I was just created recently, so I\'m quite young in bot years!' },
  
  // Greetings (additional)
  { keyword: 'good morning', response: 'Good morning! Hope you have a wonderful day ahead!' },
  { keyword: 'good afternoon', response: 'Good afternoon! How can I assist you today?' },
  { keyword: 'good evening', response: 'Good evening! How are you doing?' },
  { keyword: 'good night', response: 'Good night! Sleep well and sweet dreams!' },
  
  // Feelings
  { keyword: 'how are you', response: 'I\'m doing great, thank you for asking! How about you?' },
  { keyword: 'are you ok', response: 'Yes, I\'m functioning perfectly! Thanks for checking!' },
  { keyword: 'happy', response: 'I\'m glad you\'re happy! Happiness is contagious! 😊' },
  { keyword: 'sad', response: 'I\'m sorry you\'re feeling sad. Is there anything I can help you with?' },
  
  // Capabilities
  { keyword: 'what can you do', response: 'I can chat with you, answer questions, and learn new responses through my admin panel!' },
  { keyword: 'help me', response: 'I\'m here to help! You can ask me questions about various topics, or just chat with me!' },
  { keyword: 'how do you work', response: 'I use keyword matching to understand your questions and provide relevant answers from my knowledge base!' },
  
  // General Knowledge - India
  { keyword: 'pm', response: 'The Prime Minister of India is Narendra Modi.' },
  { keyword: 'president', response: 'The President of India is Droupadi Murmu.' },
  { keyword: 'capital', response: 'The capital of India is New Delhi.' },
  { keyword: 'india', response: 'India is a diverse country in South Asia with a rich cultural heritage and history.' },
  { keyword: 'taj mahal', response: 'The Taj Mahal is a beautiful white marble mausoleum located in Agra, India. It was built by Emperor Shah Jahan.' },
  { keyword: 'independence day', response: 'India celebrates Independence Day on August 15th, commemorating independence from British rule in 1947.' },
  
  // Technology
  { keyword: 'computer', response: 'A computer is an electronic device that processes data and performs tasks according to instructions.' },
  { keyword: 'internet', response: 'The Internet is a global network connecting millions of computers worldwide.' },
  { keyword: 'ai', response: 'AI (Artificial Intelligence) is the simulation of human intelligence by machines, especially computer systems.' },
  { keyword: 'programming', response: 'Programming is the process of creating instructions for computers to follow. Popular languages include Python, JavaScript, and Java.' },
  { keyword: 'javascript', response: 'JavaScript is a popular programming language used for web development, both frontend and backend!' },
  { keyword: 'python', response: 'Python is a versatile, beginner-friendly programming language used for web development, data science, AI, and more!' },
  
  // Education
  { keyword: 'education', response: 'Education is the key to success and personal development. It empowers individuals and societies!' },
  { keyword: 'school', response: 'School is where students learn fundamental knowledge and skills for their future.' },
  { keyword: 'college', response: 'College provides higher education and specialized training in various fields of study.' },
  { keyword: 'study', response: 'Studying regularly and staying focused are keys to academic success!' },
  
  // Science
  { keyword: 'science', response: 'Science is the systematic study of the natural world through observation and experimentation.' },
  { keyword: 'physics', response: 'Physics is the study of matter, energy, and the fundamental forces of nature.' },
  { keyword: 'chemistry', response: 'Chemistry is the study of substances, their properties, and how they interact with each other.' },
  { keyword: 'biology', response: 'Biology is the study of living organisms and their vital processes.' },
  
  // Math
  { keyword: 'math', response: 'Mathematics is the study of numbers, quantities, shapes, and patterns. It\'s the language of the universe!' },
  { keyword: 'algebra', response: 'Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.' },
  
  // Sports
  { keyword: 'cricket', response: 'Cricket is a popular sport in India and many other countries, played between two teams of 11 players.' },
  { keyword: 'football', response: 'Football (soccer) is the world\'s most popular sport, played by millions worldwide!' },
  { keyword: 'sports', response: 'Sports are physical activities that promote health, teamwork, and competition!' },
  
  // Food
  { keyword: 'food', response: 'India is famous for its diverse and delicious cuisine, including biryani, curry, dosa, and more!' },
  { keyword: 'pizza', response: 'Pizza is a popular Italian dish loved worldwide, with various toppings and styles!' },
  { keyword: 'recipe', response: 'I don\'t have specific recipes, but I can tell you that cooking is both an art and a science!' },
  
  // Time & Date
  { keyword: 'time', response: 'I don\'t have access to real-time data, but you can check your device for the current time!' },
  { keyword: 'date', response: 'I don\'t have access to real-time data, but you can check your device for today\'s date!' },
  { keyword: 'day', response: 'Every day is a new opportunity to learn and grow!' },
  
  // Weather
  { keyword: 'weather', response: 'I don\'t have real-time weather data, but I hope it\'s nice where you are!' },
  { keyword: 'rain', response: 'Rain is essential for life on Earth, providing water for plants, animals, and humans!' },
  { keyword: 'sunny', response: 'Sunny days are great for outdoor activities! Don\'t forget your sunscreen!' },
  
  // Entertainment
  { keyword: 'movie', response: 'Movies are a great form of entertainment! What\'s your favorite genre?' },
  { keyword: 'music', response: 'Music is a universal language that brings people together!' },
  { keyword: 'book', response: 'Reading books is a wonderful way to gain knowledge and escape into different worlds!' },
  
  // Jokes & Fun
  { keyword: 'joke', response: 'Why did the programmer quit his job? Because he didn\'t get arrays! 😄' },
  { keyword: 'funny', response: 'Want to hear something funny? I tried to catch fog yesterday... I mist! 😂' },
  { keyword: 'laugh', response: 'Laughter is the best medicine! Keep smiling! 😊' },
  
  // Motivation
  { keyword: 'motivation', response: 'Believe in yourself! You are capable of amazing things!' },
  { keyword: 'success', response: 'Success is the result of hard work, dedication, and perseverance!' },
  { keyword: 'dream', response: 'Dream big and work hard to make those dreams a reality!' },
  { keyword: 'inspire', response: 'Be the change you wish to see in the world! You can inspire others!' },
  
  // Common Questions
  { keyword: 'why', response: 'That\'s a great question! The answer depends on the context. Can you be more specific?' },
  { keyword: 'how', response: 'I\'d be happy to help! Can you provide more details about what you\'d like to know?' },
  { keyword: 'when', response: 'Timing can vary depending on what you\'re asking about. Can you clarify?' },
  { keyword: 'where', response: 'Location matters! Can you tell me more about what you\'re looking for?' },
  
  // Politeness
  { keyword: 'please', response: 'Of course! I\'m here to help. What do you need?' },
  { keyword: 'sorry', response: 'No need to apologize! How can I assist you?' },
  { keyword: 'excuse me', response: 'Yes, how may I help you?' },
  
  // Farewells (additional)
  { keyword: 'see you', response: 'See you later! Take care!' },
  { keyword: 'talk to you later', response: 'Sure! Looking forward to our next chat!' },
  { keyword: 'catch you later', response: 'Catch you later! Have a great day!' },
  
  // Gratitude (additional)
  { keyword: 'appreciate', response: 'I appreciate you too! Happy to help!' },
  { keyword: 'grateful', response: 'I\'m glad I could help! That\'s what I\'m here for!' },
  
  // Emotions
  { keyword: 'love', response: 'Love is a beautiful emotion that connects us all!' },
  { keyword: 'hate', response: 'It\'s okay to have negative feelings sometimes. Is there something bothering you?' },
  { keyword: 'angry', response: 'I understand you\'re upset. Take a deep breath. How can I help?' },
  { keyword: 'excited', response: 'That\'s wonderful! Excitement is a great feeling!' },
  
  // Random
  { keyword: 'cool', response: 'Thanks! You\'re pretty cool too! 😎' },
  { keyword: 'awesome', response: 'Awesome indeed! Glad you think so!' },
  { keyword: 'amazing', response: 'Amazing is right! Life is full of amazing things!' },
  { keyword: 'wow', response: 'Wow indeed! What caught your attention?' },
  
  // Yes/No
  { keyword: 'yes', response: 'Great! How can I help you further?' },
  { keyword: 'no', response: 'Okay, no problem! Let me know if you need anything else.' },
  { keyword: 'maybe', response: 'Maybe is fine! Take your time to decide.' },
  
  // Questions about bot
  { keyword: 'are you real', response: 'I\'m a chatbot, so I\'m real software but not a human!' },
  { keyword: 'are you human', response: 'No, I\'m an AI chatbot designed to assist and chat with you!' },
  { keyword: 'can you think', response: 'I process information based on patterns and keywords, which is different from human thinking!' },
  { keyword: 'do you sleep', response: 'Nope! I\'m available 24/7 to chat with you!' },
  { keyword: 'do you eat', response: 'I don\'t eat, but I do consume data! 😄' },

  // ========== ADD YOUR CUSTOM INTENTS BELOW THIS LINE ==========
  // Example: Uncomment and modify these lines to add your own knowledge
  
  // Personal Information (Example - Modify these!)
  { keyword: 'developer name', response: 'This chatbot was created by Prince Kumar!' },
  { keyword: 'project name', response: 'This is a Chatbot Web Application project!' },
  { keyword: 'technology used', response: 'This chatbot uses Node.js, Express, MongoDB, EJS, HTML, CSS, and JavaScript!' },
  { keyword: 'what is my name', response: 'my master your name is prince chauhan' },
];

// Connect to MongoDB and add intents
const trainChatbot = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🎓 Starting chatbot training...');
    console.log(`📚 Adding ${trainingData.length} intents to the database\n`);

    let addedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const data of trainingData) {
      try {
        // Check if intent already exists
        const existing = await Intent.findOne({ keyword: data.keyword.toLowerCase() });
        
        if (existing) {
          console.log(`⏭️  Skipped: "${data.keyword}" (already exists)`);
          skippedCount++;
        } else {
          // Add new intent
          const intent = new Intent({
            keyword: data.keyword.toLowerCase(),
            response: data.response
          });
          await intent.save();
          console.log(`✅ Added: "${data.keyword}"`);
          addedCount++;
        }
      } catch (error) {
        console.log(`❌ Error adding "${data.keyword}": ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Training Complete!');
    console.log('='.repeat(50));
    console.log(`✅ Successfully added: ${addedCount} intents`);
    console.log(`⏭️  Skipped (duplicates): ${skippedCount} intents`);
    console.log(`❌ Errors: ${errorCount} intents`);
    console.log(`📊 Total in database: ${await Intent.countDocuments()} intents`);
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Training failed:', error.message);
    process.exit(1);
  }
};

// Run the training
trainChatbot();
