var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var db = require('./db');

const saltRounds = 10;

var teamSchema = mongoose.Schema({
        name: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        idea: String
    }, { collection: 'teams' });
teamSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, res) {
        if(err)
            callback(false);
        callback(res);
    });
};
var Team = mongoose.model('Team', teamSchema);

module.exports = Team;