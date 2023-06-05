'use strict'
var express = require('express');
//const multer = require('multer');
var PublicationController = require('../controllers/publication');
//const upload = multer({ dest: 'uploads/' }); // Indica el directorio donde se guardarán las imágenes
var api= express.Router();
var md_auth = require('../midlewares/autenticated');
var multipart = require('connect-multiparty');
var md_upload=multipart({uploadDir: './uploads/publications'});
const path = require('path');
//api.use('/uploads', express.static(path.join(__dirname, '../uploads')));
api.get('/probando-pub',md_auth.ensureAuth,PublicationController.probando);
api.post('/publication',md_auth.ensureAuth,PublicationController.savePublication);
api.get('/publications/:page?',md_auth.ensureAuth,PublicationController.getPublications);
api.get('/publications-user/:user/:page?',md_auth.ensureAuth,PublicationController.getPublicationsUser);
api.get('/publication/:id',md_auth.ensureAuth,PublicationController.getPublication);
api.delete('/publication/:id',md_auth.ensureAuth,PublicationController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth,md_upload],PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

//api.get('/users',UserController.listUsers);

module.exports = api;