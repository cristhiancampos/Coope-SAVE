'use strict'

var express = require('express');
var ControladorSolicitudSala = require('../controladores/solicitudSala');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarSolicitudSala',ControladorSolicitudSala.agregarSolicitud);
 api.get('/fechaActual',ControladorSolicitudSala.obtenerFechaActual);
api.post('/obtenerSolicitudesSalas',ControladorSolicitudSala.obtenerSolicitudesSalas);
api.get('/obtenerTodasSolicitudes',ControladorSolicitudSala.obtenerTodasSolicitudes);
 api.put('/modificarSolicitudSala',ControladorSolicitudSala.modificarSolicitudSala);
api.delete('/eliminarSolicitudSala/:id', ControladorSolicitudSala.eliminarSolicitudSala);




// api.post('/validarSala',ControladorSala.validarSala);
// api.get('/obtenerSalasHabilitadas',ControladorSala.obtenerSalasHabilitadas);
// api.get('/obtenerSala/:id',ControladorSala.obtenerSala);
// api.delete('/eliminarSala/:id', ControladorSala.eliminarSala);
// api.put('/modificarSala',ControladorSala.modificarSala);
// api.post('/validarModificacion',ControladorSala.validarModificacion);

module.exports = api;