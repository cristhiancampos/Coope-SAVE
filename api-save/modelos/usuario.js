 'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloUsuario = Schema({
  codigoUsuario: String,
  nombre: String,
  apellidos: String,
  correo: String,
  rol: String,
  departamento: String,
  estado: String
});

module.exports = mongoose.model('usuario',modeloUsuario);
