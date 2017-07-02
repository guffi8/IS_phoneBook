var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Scheme = new Schema({
    name: {type: String},
    token : {type: String},
    phone: {type: String},
});

module.exports = mongoose.model('PhoneBookSchema', Scheme);