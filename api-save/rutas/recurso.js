'use strict'

var express = require('express');
var ControladorRecurso = require('../controladores/recurso');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarRecurso',ControladorRecurso.agregarRecurso);
api.post('/validarRecurso',ControladorRecurso.validarRecurso);
api.get('/obtenerRecursos',ControladorRecurso.obtenerRecursos);

module.exports = api;