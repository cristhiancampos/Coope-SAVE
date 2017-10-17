'use strict'

var express = require('express');
var ControladorVehiculo = require('../controladores/vehiculo');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/registrarVehiculo',ControladorVehiculo.agregarVehiculo);
api.post('/validarVehiculo',ControladorVehiculo.validarVehiculo);

module.exports = api;