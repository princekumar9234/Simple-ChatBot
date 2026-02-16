require('dotenv').config();
const MongoStore = require('connect-mongo');
console.log('Testing MongoStore.create with URL:', process.env.MONGODB_URI);
try {
    const store = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
    console.log('MongoStore.create called successfully');
} catch (e) {
    console.error('MongoStore.create failed:', e);
}
