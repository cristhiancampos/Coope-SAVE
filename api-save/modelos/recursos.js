'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloRecursos = Schema({
  
  nombre: String,
  codigoActivo: String,
  descripcion: String,
  estado: String,
  reporte: String,
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Recurso', modeloRecursos);