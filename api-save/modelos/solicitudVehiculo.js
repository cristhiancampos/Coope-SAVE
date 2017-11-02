
'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloSolicitudVehiculo = Schema({      
    vehiculo:String,
    departamento: string,
    usuario:String,
    fecha :{},
    horaSalida:{} ,
    horaRegreso : {} ,
    destino: {},
    descripcion :String,
    estado :String,
    acompanantes :{},
    created_at: String,
    updated_at: String
});
module.exports = mongoose.model('SolicitudVehiculo',modeloSolicitudSala);
