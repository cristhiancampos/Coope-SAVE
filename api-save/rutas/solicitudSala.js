'use strict'

var express = require('express');
var ControladorSolicitudSala = require('../controladores/solicitudSala');
var ControladorEnviarCorreo = require('../controladores/enviarCorreo');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarSolicitudSala',ControladorSolicitudSala.agregarSolicitud);
 api.get('/fechaActual',ControladorSolicitudSala.obtenerFechaActual);
api.post('/obtenerSolicitudesSalas',ControladorSolicitudSala.obtenerSolicitudesSalas);
api.get('/obtenerSolicitudSala/:id',ControladorSolicitudSala.obtenerSolicitudSala);
api.get('/obtenerTodasSolicitudes',ControladorSolicitudSala.obtenerTodasSolicitudes);
 api.put('/modificarSolicitudSala',ControladorSolicitudSala.modificarSolicitudSala);
api.delete('/eliminarSolicitudSala/:id', ControladorSolicitudSala.eliminarSolicitudSala);

api.post('/enviarCorreo', ControladorEnviarCorreo.sendEmailSala);
api.post('/filtroReporteSalas',ControladorSolicitudSala.filtrosReportes);




// api.post('/validarSala',ControladorSala.validarSala);
// api.get('/obtenerSalasHabilitadas',ControladorSala.obtenerSalasHabilitadas);
// api.get('/obtenerSala/:id',ControladorSala.obtenerSala);
// api.delete('/eliminarSala/:id', ControladorSala.eliminarSala);
// api.put('/modificarSala',ControladorSala.modificarSala);
// api.post('/validarModificacion',ControladorSala.validarModificacion);

module.exports = api;