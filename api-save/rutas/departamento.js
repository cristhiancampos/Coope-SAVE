'use strict'

var express = require('express');
var ControladorDepartamento = require('../controladores/departamento');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarDepartamento',ControladorDepartamento.agregarDepartamento);
api.post('/validarDepartamento',ControladorDepartamento.validarDepartamento);
api.get('/obtenerDepartamentos',ControladorDepartamento.obtenerDepartamentos);
api.get('/obtenerDepartamento/:id',ControladorDepartamento.obtenerDepartamento);
api.delete('/eliminarDepartamento/:id', ControladorDepartamento.eliminarDepartamento);
module.exports = api;