'use strict'

var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var Schema = mongoose.Schema;

var MessageSchema = Schema({
        text: String,
        viewed:String,

        create_at:String,
        emitter:{ type: Schema.ObjectId, ref:'User'},
        receiver:{ type: Schema.ObjectId, ref:'User'}
});
MessageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Message', MessageSchema);