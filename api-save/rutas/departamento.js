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
api.post('/validarModificacionDepartamento',ControladorDepartamento.validarModificacion);
api.put('/modificarDepartamento',ControladorDepartamento.modificarDepartamento);

module.exports = api;