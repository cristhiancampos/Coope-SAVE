'use strict'

var express = require('express');
var ControladorSolicitudSala = require('../controladores/solicitudSala');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

 api.post('/registrarSolicitudSala',ControladorSolicitudSala.agregarSolicitud);
// api.post('/validarSala',ControladorSala.validarSala);
// api.get('/obtenerSalas',ControladorSala.obtenerSalas);
// api.get('/obtenerSalasHabilitadas',ControladorSala.obtenerSalasHabilitadas);
// api.get('/obtenerSala/:id',ControladorSala.obtenerSala);
// api.delete('/eliminarSala/:id', ControladorSala.eliminarSala);
// api.put('/modificarSala',ControladorSala.modificarSala);
// api.post('/validarModificacion',ControladorSala.validarModificacion);

module.exports = api;