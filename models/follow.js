'user strict'

var mongoose = require('mongoose');
var Schema= mongoose.Schema;

/*var PublicationSchema = Schema({

        text: String,
        file: String,
        create_at: String,
        user: {type: Schema.ObjectId,ref: 'User'}
        



});*/

const FollowSchema = Schema({
    user: { type: Schema.ObjectId, ref: 'User' },
    followed: { type: Schema.ObjectId, ref: 'User' }
    
});

module.exports = mongoose.model('Follow',FollowSchema);