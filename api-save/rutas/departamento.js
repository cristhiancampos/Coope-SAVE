'use strict'

var express = require('express');
var ControladorDepartamento = require('../controladores/departamento');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarDepartamento',ControladorDepartamento.agregarDepartamento);
api.post('/validarDepartamento',ControladorDepartamento.validarDepartamento);
api.get('/obtenerDepartamentos',ControladorDepartamento.obtenerDepartamentos);

module.exports = api;