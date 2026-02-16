console.log('Testing requires...');
try {
    require('dotenv').config();
    console.log('dotenv ok');
    require('express');
    console.log('express ok');
    require('mongoose');
    console.log('mongoose ok');
    require('connect-mongo');
    console.log('connect-mongo ok');
    require('./middlewares/logger');
    console.log('logger ok');
    require('./middlewares/errorHandler');
    console.log('errorHandler ok');
    require('./routes/authRoutes');
    console.log('authRoutes ok');
    require('./routes/viewRoutes');
    console.log('viewRoutes ok');
    require('./routes/chatRoutes');
    console.log('chatRoutes ok');
    require('./routes/adminRoutes');
    console.log('adminRoutes ok');
    console.log('All top-level requires ok');
} catch (e) {
    console.error('Error during require:', e);
}
