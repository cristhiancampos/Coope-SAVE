'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloSala = Schema({
  
  nombre: String,
  cupo: String,
  descripcion: String,
  estado: String,
  reporte: String,
  horario:{},
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Sala',modeloSala);