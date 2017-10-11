'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloSala = Schema({
  
  nombre: String,
  cupo: String,
  descripcion: String,
  estado: String,
  reporte: String
});

module.exports = mongoose.model('sala',modeloSala);