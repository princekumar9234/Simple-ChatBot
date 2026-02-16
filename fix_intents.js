const mongoose = require('mongoose');
require('dotenv').config();
const Intent = require('./models/Intent');

const basicIntents = [
    { keyword: 'hello', response: 'Hello! How can I help you today?' },
    { keyword: 'hi', response: 'Hi there! What can I do for you?' },
    { keyword: 'hey', response: 'Hey! How are you doing?' },
    { keyword: 'thanks', response: 'You\'re welcome! Happy to help!' },
    { keyword: 'thank you', response: 'You\'re very welcome!' },
    { keyword: 'bye', response: 'Goodbye! Have a great day!' }
];

const fixIntents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        for (const intent of basicIntents) {
            const exists = await Intent.findOne({ keyword: intent.keyword });
            if (!exists) {
                await Intent.create(intent);
                console.log(`Added missing intent: ${intent.keyword}`);
            } else {
                console.log(`Intent already exists: ${intent.keyword}`);
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixIntents();
