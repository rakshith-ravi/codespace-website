var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var db = require('./db');

var userSchema = mongoose.Schema({
        name : String,
        email: String,
        vitian: Boolean,
        regno: String,
        university: String
    });
var User = mongoose.model('User', userSchema);

module.exports = User;