var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var db = require('./db');

const saltRounds = 10;

var userSchema = mongoose.Schema({
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        name: String
    });
userSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, res) {
        if(err)
            callback(false);
        callback(res);
    });
};
var User = mongoose.model('User', userSchema);

module.exports = User;