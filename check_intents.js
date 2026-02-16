const mongoose = require('mongoose');
require('dotenv').config();
const Intent = require('./models/Intent');

const checkIntents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const intents = await Intent.find();
        console.log(`Found ${intents.length} intents:`);
        intents.forEach(intent => {
            console.log(`Keyword: "${intent.keyword}", Response: "${intent.response}"`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkIntents();
