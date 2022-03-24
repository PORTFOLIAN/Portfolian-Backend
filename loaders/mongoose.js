const mongoose = require('mongoose');

const {  MONGO_URI } = process.env;

module.exports = function loadMongoose(app) {
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Successfully connected to mongodb'))
    .catch(e => console.error(e));
}