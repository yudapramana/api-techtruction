const dbConfig = require('../../config/db.config.js');
const mongoose = require('mongoose');



mongoose.Promise = global.Promise;

const db = {}
db.mongoose = mongoose

db.url = dbConfig.url
db.tasks = require('./task.model')(mongoose)

module.exports = db