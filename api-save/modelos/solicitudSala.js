
'use strict'

var mongoose = require('mongoose');//Este se necesita para trabajar con la base de datos
var Schema = mongoose.Schema;

var modeloSolicitudSala = Schema({      
    sala:String,
    usuario:String,
    fecha :Date,
    horaInicio :Date,
    horaFin :Date,
    descripcion :String,
    cantidadPersonas :String,
    estado :String,
    recursos :{},
    created_at: String,
    updated_at: String
});
module.exports = mongoose.model('SolicitudSala',modeloSolicitudSala);
