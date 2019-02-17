var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, required: true, index:true, unique:true,sparse:true},
    password: {type: String, required:true},
});

var User = mongoose.model('user', userSchema);

module.exports = User;

module.exports.getUserByEmail = function(email, callback){
  var query = {email: email};
  User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
 User.findById(id, callback);
}
module.exports.getUserByUsername = function (email, callback) {
 const query = { email: email }
 User.findOne(query, callback);
}
module.exports.addUser = function (newUser, callback) {
 bcrypt.genSalt(10, (err, salt) => {
   bcrypt.hash(newUser.password, salt, (err, hash) => {
     if (err) throw err;
     newUser.password = hash;
     newUser.save(callback);
   });
 });
}
module.exports.comparePassword = function (candidatePassword, hash, callback) {
 bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
   if (err) throw err;
   callback(null, isMatch);
 });
}
