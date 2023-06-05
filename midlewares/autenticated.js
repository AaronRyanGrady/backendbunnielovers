'use sctrict'

var jwt= require('jwt-simple');
var moment = require('moment');
var secret='clave_secreta_admin_backend';


exports.ensureAuth = function(req, res, next) {

    if (!req.headers.authorization) {
        return res.status(403).send({message:' la petición no tiene la cabecera de autenticación'});
    

    }
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if(payload.exp<= moment().unix()){
            return res.status(401).send({message: 'el token ha expirado'});
        }
        
    } catch (ex) {

        return res.status(404).send({message: 'el token no es valido'});

        
    }
    //require.user = payload;

    req.user = payload;

    next();
    
    





}