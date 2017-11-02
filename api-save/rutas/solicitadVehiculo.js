'use strict'

var express = require('express');
var ControladorSolicitudVehiculo = require('../controladores/solicitudVehiculo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarSolicitudVehiculo',ControladorSolicitudVehiculo.agregarSolicitud);
 api.get('/fechaActualServer',ControladorSolicitudVehiculo.obtenerFechaActual);
api.post('/obtenerSolicitudesVehiculos',ControladorSolicitudVehiculo.obtenerSolicitudesvehiculos);
api.get('/obtenerTodasSolicitudesVehiculos',ControladorSolicitudVehiculo.obtenerTodasSolicitudes);
 api.put('/modificarSolicitudVehiculo',ControladorSolicitudVehiculo.modificarsolicitudVehiculo);
api.delete('/eliminarSolicitudSala/:id', ControladorSolicitudVehiculo.eliminarsolicitudVehiculo);


module.exports = api;