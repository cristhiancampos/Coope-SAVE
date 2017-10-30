'use strict'

var express = require('express');
var ControladorVehiculo = require('../controladores/vehiculo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarVehiculo',ControladorVehiculo.agregarVehiculo);
api.post('/validarVehiculo',ControladorVehiculo.validarVehiculo);
api.get('/obtenerVehiculos',ControladorVehiculo.obtenerVehiculos);
api.get('/obtenerVehiculo/:id',ControladorVehiculo.obtenerVehiculo);
api.delete('/eliminarVehiculo/:id', ControladorVehiculo.eliminarVehiculo);
api.post('/validarModificacionVehiculo',ControladorVehiculo.validarModificacion);
api.put('/modificarVehiculo',ControladorVehiculo.modificarVehiculo);
api.put('/modificarHorario',ControladorVehiculo.modificarHorario);

module.exports = api;