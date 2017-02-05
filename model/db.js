var mongoose = require('mongoose');

var mongodbURL = 'mongodb://localhost/codespace';
mongoose.connect(mongodbURL);

module.exports = mongoose;