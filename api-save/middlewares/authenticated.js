'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'token_acceso_sistemas_SAVE';

exports.ensureAuth = function(req, res ,next){
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La petición no tiene cabecera de autentificación'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,''); 
    try {
        var payload =jwt.decode(token,secret);
        if(payload.exp <= moment().unix())
        {
         res.status(401).send({message: 'El Token ha expirado'});
        }
    } catch (error) {
      //  console.log(error);
        res.status(404).send({message: 'Token no válido'});
    }
    req.user = payload;
    next();
};