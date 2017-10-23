'use strict'

var Vehiculo = require('../modelos/vehiculo');

function agregarVehiculo(req, res) {

  var vehiculo = new Vehiculo();//creamos un nuevo objeto vehiculo 
  var params = req.body;//obtenemos los datos de la peticion
  //llenamos el nuevo objeto usuario a agregar con los datos del request
  vehiculo.tipo = params.tipo;
  vehiculo.marca = params.marca;
  vehiculo.placa = params.placa;
  vehiculo.descripcion = params.descripcion;
  vehiculo.kilometraje = params.kilometraje
  vehiculo.estado =params.estado;
  vehiculo.reporte = params.reporte;
  vehiculo.created_at = new Date();

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

  Vehiculo.findOne({ placa: placa, estado: { $ne: "Eliminado" } }, (err, vehiculo) => {
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
  Vehiculo.find({ estado: { $ne: "Eliminado" } },(err,vehiculos)=>{
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

function obtenerVehiculo(req, res){
  var vehiculoId = req.params.id;
  Vehiculo.find({_id: vehiculoId},(err,vehiculo)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!vehiculo){
            res.status(404).send({message:'No existen Salas registradas en el sistema'});
        }else{
            res.status(200).send({message:vehiculo});
        }
    }
  });

  
     
}

function eliminarVehiculo(req, res) {
  var vehiculoId = req.params.id;
  var update = req.body;
  Vehiculo.findByIdAndUpdate(vehiculoId, { $set: { estado: 'Eliminado' } }, { new: true }, (err, vehiculoDeleted) => {
    if (err) {
      res.status(500).send({ message: 'Error al eliminar el vehículo' });
    } else {
      if (!vehiculoDeleted) {
        res.status(404).send({ message: 'No se ha podido eliminar el vehículo' });
      } else {
        res.status(200).send({ message: vehiculoDeleted });
      }
    }
  });
}

function modificarVehiculo(req, res) {
    var params =req.body;
    var vehiculoId = params._id;
    params.updated_at= new Date();
  
    Vehiculo.findByIdAndUpdate(vehiculoId, params, (err, modificarVehiculo) => {
      if (err) {
        
        res.status(500).send({ message: 'Error al actualizar la sala' });
      } else {
        if (!modificarVehiculo) {
         
          res.status(404).send({ message: 'No se ha podido actualizar la sala' });
        } else {
          
          res.status(200).send({ message: modificarVehiculo });
        }
      }
    });
  }

  function validarModificacion(req, res) {
    var params = req.body;
    var placa = params.placa;
    var id = params._id;
    Vehiculo.findOne({ _id: id, placa: placa, estado: { $ne: "Eliminado" } }, (err, vehiculo) => {
      if (err) {
        res.status(200).send({ message: null });
      } else {
        if (!vehiculo) {
          Vehiculo.findOne({ placa: placa, estado: { $ne: "Eliminado" } }, (err, vehiculoEdit) => {
            if (err) {
              res.status(200).send({ message: null });
            } else {
              if (!vehiculoEdit) {
                res.status(200).send({ message: null });
              }
              else {
                res.status(200).send({ message: vehiculoEdit});
              }
            }
          })
        }
        else {
          res.status(200).send({ message: null });
        }
      }
    });
  }

module.exports = {
  agregarVehiculo,
  validarVehiculo,
  obtenerVehiculos,
  obtenerVehiculo,
  eliminarVehiculo,
  modificarVehiculo,
  validarModificacion
};