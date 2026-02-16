const connectMongo = require('connect-mongo');
console.log('connectMongo keys:', Object.keys(connectMongo));
console.log('connectMongo.MongoStore type:', typeof connectMongo.MongoStore);
if (connectMongo.MongoStore) {
    console.log('connectMongo.MongoStore.create type:', typeof connectMongo.MongoStore.create);
}
console.log('connectMongo.default type:', typeof connectMongo.default);
if (connectMongo.default) {
     console.log('connectMongo.default.create type:', typeof connectMongo.default.create);
}
