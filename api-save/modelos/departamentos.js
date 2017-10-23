var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloDepartamentos = Schema({
  nombre: String,
  color: String,
  estado: String,
  created_at: String,
  updated_at: String
});

module.exports = mongoose.model('Departamento',modeloDepartamentos);