'use strict'
 //FUCHERO PRINCIPAL DE CONFIGURACIÓN DE EXPRESS
var express = require('express');
var bodyParser = require('body-parser');

//objeto de express
var app = express();

//cargar rutas
var user_routes = require('./rutas/usuario');
var sala_routes = require('./rutas/sala');
var vehiculo_routes = require('./rutas/vehiculos');
var recurso_routes = require('./rutas/recurso');
var departamento_routes = require('./rutas/departamento');
var solicitudSala_routes = require('./rutas/solicitudSala');
var solicitudVehiculo_routes = require('./rutas/solicitadVehiculo');

//recibir las peticiones http
app.use(bodyParser.urlencoded({extended:false}));
//convertir a json los datos que llegan mediante las peticiones http
app.use(bodyParser.json());


//configurar cabeceras https
app.use((req,res,next)=>{
    //cabecera para que puedan acceder todos los dominios
    res.header('Access-Control-Allow-Origin','*');
    //cabeceras necesarias para que le api a nivel del ajax funcione
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
    //permitir los metodos http mas comunes
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas base
 app.use('/api',user_routes);
 app.use('/api',sala_routes);
 app.use('/api',vehiculo_routes);
 app.use('/api',recurso_routes);
 app.use('/api',departamento_routes);
 app.use('/api',solicitudSala_routes);
 app.use('/api',solicitudVehiculo_routes);
 
//exportar modulo
module.exports = app;
