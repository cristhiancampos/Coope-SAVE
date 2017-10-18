'use strict'

var Vehiculo = require('../modelos/vehiculo');

function agregarVehiculo(req, res) {

  var vehiculo = new Vehiculo();//creamos un nuevo objeto vehiculo 
  var params = req.body;//obtenemos los datos de la peticion
  //llenamos el nuevo objeto usuario a agregar con los datos del request
  console.log(params);
  vehiculo.tipo = params.tipo;
  vehiculo.marca = params.marca;
  vehiculo.placa = params.placa;
  vehiculo.descripcion = params.descripcion;
  vehiculo.kilometraje = params.kilometraje
  vehiculo.estado =params.estado;
  vehiculo.reporte = params.reporte;
  console.log(vehiculo);
  if (
    vehiculo.tipo != null && vehiculo.marca != null && vehiculo.placa != null && vehiculo.descripcion != null && vehiculo.kilometraje != null
    && vehiculo.estado != null) {
    //guardar vehiculo
    vehiculo.save((err, vehiculoStored) => {
      if (err) {
        res.status(500).send({ message: 'Error al registrar vehiculo ' });
      } else {
        if (!vehiculoStored)//verificar que se almaceno correctamente
        {
          res.status(404).send({ message: 'No se ha registrado el vehiculo ' });
        } else {//todo correcto

          res.status(200).send({ vehiculo: vehiculoStored });
        }
      }
    });
  } else {
    res.status(200).send({ message: 'Debe rellenar todos los campos ' });
  }
}

function validarVehiculo(req, res) {
  var params = req.body;
  var placa = params.placa;
  console.log(placa);
  Vehiculo.findOne({ placa: placa }, (err, vehiculo) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!vehiculo) {
        res.status(200).send({ message: null });
      }
      else {
        res.status(200).send({ message: vehiculo });
      }
    }
  });
}

function obtenerVehiculos(req, res){
  Vehiculo.find({},(err,vehiculos)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!vehiculos){
            res.status(404).send({message:'No existen Vehiculos registrados en el sistema'});
        }else{
            res.status(200).send({message:vehiculos});
        }
    }
  }).sort('number'); 
}

module.exports = {
  agregarVehiculo,
  validarVehiculo,
  obtenerVehiculos
};