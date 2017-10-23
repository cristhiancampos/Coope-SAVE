 'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloVehiculo = Schema({
  tipo: String,
  marca: String,
  placa: String,
  descripcion: String,
  kilometraje: String,
  estado: String,
  reporte: String,
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Vehiculo',modeloVehiculo);