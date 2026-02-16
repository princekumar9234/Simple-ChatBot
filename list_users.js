const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const get_users = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'username password');
        console.log('List of users:');
        users.forEach(user => {
            console.log(`Username: ${user.username}, Password (Hashed): ${user.password}`);
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

get_users();
