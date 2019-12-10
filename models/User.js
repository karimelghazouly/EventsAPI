const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  age: {type: Number, required: false},
  events: [{type: Schema.Types.ObjectId, ref:"Event"}]
});

var User = db.model('User', UserSchema);

module.exports = User;
