'use strict'

var express = require('express');
var ControladorRecurso = require('../controladores/recurso');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarRecurso',ControladorRecurso.agregarRecurso);
api.post('/validarRecurso',ControladorRecurso.validarRecurso);
api.get('/obtenerRecursos',ControladorRecurso.obtenerRecursos);
api.get('/obtenerRecursosHabilitados',ControladorRecurso.obtenerRecursosHabilitados);
api.get('/obtenerRecurso/:id',ControladorRecurso.obtenerRecurso);
api.delete('/eliminarRecurso/:id', ControladorRecurso.eliminarRecurso);
api.post('/validarModificacionRecurso',ControladorRecurso.validarModificacion);
api.put('/modificarRecurso',ControladorRecurso.modificarRecurso);

module.exports = api;