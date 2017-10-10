
'use strict'
//conexión a base de datos
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://172.30.23.149:27017/api-save',(err,res) =>{
  if(err)
  {
    throw err;
    //console.log('error');
  }else {
    console.log("La conexión a la base de datos se realiza correctamente...");
    try {
      app.listen(port,function() {
      console.log("servidor escuchando...");
    });
    } catch (error) {
      console.log('No se pudo conectar al servidor');
    }
    
  }
});
  