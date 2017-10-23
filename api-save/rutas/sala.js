'use strict'

var express = require('express');
var ControladorSala = require('../controladores/sala');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarSala',ControladorSala.agregarSala);
api.post('/validarSala',ControladorSala.validarSala);
api.get('/obtenerSalas',ControladorSala.obtenerSalas);
api.get('/obtenerSala/:id',ControladorSala.obtenerSala);
api.delete('/eliminarSala/:id', ControladorSala.eliminarSala);

module.exports = api;