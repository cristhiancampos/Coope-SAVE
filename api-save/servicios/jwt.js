'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'token_acceso_sistemas_SAVE';

exports.createToken = function(usuario){
 var payload ={
    id: usuario._id,
    codigoUsuario: usuario.codigoUsuario,
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    correo: usuario.correo,
    estado: usuario.estado,
    rol: usuario.rol,
    departamento: usuario.departamento,
    iat: moment().unix(),
    exp: moment().add(30,'days').unix()

 };
 return jwt.encode(payload,secret);
};