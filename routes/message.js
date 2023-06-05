'use strict'
var express = require('express');
var MessageController = require('../controllers/message');
const mongoose = require('mongoose');
var api= express.Router();
var mongoosePaginate= require('mongoose-paginate-v2');
mongoose.plugin(mongoosePaginate);
var mr_auth = require('../midlewares/autenticated');

api.get('/probando-md',mr_auth.ensureAuth,MessageController.probando);
//api.post('/message',mr_auth.ensureAuth,MessageController.saveMessage);
api.post('/message/:id', mr_auth.ensureAuth, MessageController.saveMessage);
api.get('/messages/:page?', mr_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messagesreceive/:id/:page?', mr_auth.ensureAuth, MessageController.getEmmitMessages);
api.get('/messages2/:page?', mr_auth.ensureAuth, MessageController.getEmmitMessages2);
api.get('/unviewed-messages', mr_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/set-viewed-messages', mr_auth.ensureAuth, MessageController.setViewedMessages);
api.get('/my-messages/:page?', mr_auth.ensureAuth, MessageController.getReceivedMessages2);
module.exports =api;