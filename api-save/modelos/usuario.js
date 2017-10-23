 'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloUsuario = Schema({
 // codigoUsuario: String,
  nombre: String,
  apellidos: String,
  correo: String,
  contrasena:String,
  rol: String,
  departamento: String,
  estado: String,
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Usuario',modeloUsuario);
