'use strict'
var express = require('express');
//const multer = require('multer');
var FollowController = require('../controllers/follow');
//const upload = multer({ dest: 'uploads/' }); // Indica el directorio donde se guardarán las imágenes
var api= express.Router();
var md_auth = require('../midlewares/autenticated');
/*var multipart = require('connect-multiparty');
var md_upload=multipart({uploadDir: './uploads/follows'});
const path = require('path');*/
//api.use('/uploads', express.static(path.join(__dirname, '../uploads')));
api.get('/pruebass',md_auth.ensureAuth,FollowController.prueba);
api.post('/follow',md_auth.ensureAuth,FollowController.saveFollow);
api.delete('/follow/:id',md_auth.ensureAuth,FollowController.deleteFollow);
api.get('/following/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?',md_auth.ensureAuth,FollowController.getFollowedUsers);
api.get('/get-my-follows/:followed?',md_auth.ensureAuth,FollowController.getMyFollows);

//api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
//api.get('/users',UserController.listUsers);

module.exports = api;