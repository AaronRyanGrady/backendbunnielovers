'use strict'

var mongoose = require('mongoose');
var Schema= mongoose.Schema;

/*var PublicationSchema = Schema({

        text: String,
        file: String,
        create_at: String,
        user: {type: Schema.ObjectId,ref: 'User'}
        



});*/

const PublicationSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    file: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publication',PublicationSchema);
