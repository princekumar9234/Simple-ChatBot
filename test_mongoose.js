const mongoose = require('mongoose');
require('dotenv').config();

console.log('Connecting to:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Mongoose connected');
        process.exit(0);
    })
    .catch(err => {
        console.error('Mongoose connection error:', err);
        process.exit(1);
    });
