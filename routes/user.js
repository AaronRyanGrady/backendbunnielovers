'use strict'

var express = require('express');
const multer = require('multer');
var UserController = require('../controllers/user')
const upload = multer({ dest: 'uploads/' }); // Indica el directorio donde se guardarán las imágenes
var api= express.Router();
var md_auth = require('../midlewares/autenticated');
var multipart = require('connect-multiparty');
var md_upload=multipart({uploadDir: './uploads/users'});
const path = require('path');
api.use('/uploads', express.static(path.join(__dirname, '../uploads')));
api.get('/home',UserController.home);
api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers);
api.get('/counters/:id?',md_auth.ensureAuth,UserController.getCounters);
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
api.get('/get-image-user/:imageFile',UserController.getImageFile);
api.post('/userimage/:id', upload.single('image'), UserController.getUserImage);
api.post('/users/:id/image',upload.single('image'), UserController.updateUserImage);
api.get('/imageview/:id/image',upload.single('image'), UserController. getUserImageUrl);
//api.get('/users',UserController.listUsers);
module.exports = api;