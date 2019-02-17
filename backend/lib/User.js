var mongoose = require('mongoose');

// User schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, required: true, index:true, unique:true,sparse:true},
    password: {type: String, required:true},
    firstname:{type: String, required: [true,'First name is required']},
    lastname: {type: String, required: [true,'Last name is required']},
    skills: {type: Array}
  });

var User = mongoose.model('user', userSchema);

module.exports = User;

module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}

// module.exports.comparePassword = function(candidatePassword)
