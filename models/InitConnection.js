const mongoose = require('mongoose');
const config = require('config');

let ConnectionString = config.get("DB_Connection_String");

global.db = mongoose.createConnection(ConnectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false });