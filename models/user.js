'use strict'

var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
var Schema= mongoose.Schema;


var UserSchema = Schema({

        name: String,
        surname: String,
        nick: String,
        email: String,
        password: String,
        role: String,
        image: String



});
UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User',UserSchema);