'use strict'

var express = require('express');
var ControladorSala = require('../controladores/sala');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarSala',ControladorSala.agregarSala);
api.post('/validarSala',ControladorSala.validarSala);

module.exports = api;