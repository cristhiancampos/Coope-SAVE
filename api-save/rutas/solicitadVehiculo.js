'use strict'

var express = require('express');
var ControladorSolicitudVehiculo = require('../controladores/solicitudVehiculo');
var ControladorEnviarCorreo = require('../controladores/enviarCorreo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarSolicitudVehiculo',ControladorSolicitudVehiculo.agregarSolicitud);
 api.get('/fechaActualServer',ControladorSolicitudVehiculo.obtenerFechaActualVehiculo);
api.post('/obtenerSolicitudesVehiculos',ControladorSolicitudVehiculo.obtenerSolicitudesvehiculos);
api.get('/obtenerTodasSolicitudesVehiculos',ControladorSolicitudVehiculo.obtenerTodasSolicitudes);
 api.put('/modificarSolicitudVehiculo',ControladorSolicitudVehiculo.modificarsolicitudVehiculo);
api.delete('/eliminarSolicitudVehiculo/:id', ControladorSolicitudVehiculo.eliminarsolicitudVehiculo);
api.get('/obtenerSolicitudVehiculo/:id',ControladorSolicitudVehiculo.obtenerSolicitudVehiculo);

api.post('/enviarCorreoVehiculo', ControladorEnviarCorreo.sendEmailVehiculo);


module.exports = api;