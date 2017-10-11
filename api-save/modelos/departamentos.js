var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloDepartamentos = Schema({
  
  nombre: String,
  color: String,
  estado: String
});

module.exports = mongoose.model('departamento',modeloDepartamentos);