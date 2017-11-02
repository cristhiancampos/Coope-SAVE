'use strict'

var SolicitudSala = require('../modelos/solicitudSala');

function agregarSolicitud(req, res) {
  var solicitud = new SolicitudSala();
  var params = req.body;
  solicitud.sala = params.sala;
  solicitud.usuario = params.usuario;
  solicitud.fecha = params.fecha;
  solicitud.horaInicio = params.horaInicio;
  solicitud.horaFin = params.horaFin;
  solicitud.descripcion = params.descripcion;
  solicitud.cantidadPersonas = params.cantidadPersonas;
  solicitud.estado = 'Habilitado';
  solicitud.recursos = params.recursos;
  solicitud.created_at = new Date();
  //solicitud.updated_at = params.updated_at;

  if (
    solicitud.sala != null && solicitud.usuario != null && solicitud.fecha != null
    && solicitud.horaInicio != null && solicitud.horaFin != null && solicitud.descripcion != null
    && solicitud.cantidadPersonas != null && solicitud.created_at != null && solicitud.estado != null
  ) {
    //guardar usuario
    solicitud.save((err, solicitudStored) => {
      if (err) {
        res.status(500).send({ message: 'Error al registrar Solicitud' });
      } else {
        if (!solicitudStored)//verificar que se almaceno correctamente
        {
          res.status(404).send({ message: 'No se ha registrado la Solicitud ' });
        } else {//todo correcto

          res.status(200).send({ message: solicitudStored });
        }
      }
    });
  } else {
    res.status(200).send({ message: 'Debe rellenar todos los campos  requeridos y de la manera correcta.' });
  }
}

function obtenerFechaActual(req, res) {
  var hoy = new Date();
  res.status(200).send({ currentDate: hoy });
}

function obtenerSolicitudesSalas(req, res) {
  let date = new Date(req.body.fecha.toString())
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  console.log(date);

  SolicitudSala.find({ fecha: { year: year, month: month, day: day } }, (err, solicitud) => {
    if (err) {
      req.status(500).send({ mesage: 'Error al obtener las solicitudes' });
    } else {
      if (!solicitud) {
        res.status(404).send({ message: 'No existen solicitudes para esta fecha' });
      } else {
        res.status(200).send({ message: solicitud });
      }
    }
  });
}

function obtenerTodasSolicitudes(req, res){
  SolicitudSala.find({ estado: { $ne: "Eliminado" } }, (err, solicitudSalas) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!solicitudSalas) {
        res.status(404).send({ message: 'No existen Salas registradas en el sistema' });
      } else {
        res.status(200).send({ message: solicitudSalas });
      }
    }
  }).sort('number');

}


function modificarSolicitudSala(req, res) {
  
  
    var params = req.body;
    var solicitudId = params._id;
    params.updated_at = new Date();
  
  
    SolicitudSala.findByIdAndUpdate(solicitudId, params, (err, modificarSolicitud) => {
      if (err) {
  
        res.status(500).send({ message: 'Error al actualizar la sala' });
      } else {
        if (!modificarSolicitud) {
  
          res.status(404).send({ message: 'No se ha podido actualizar la sala' });
        } else {
  
          res.status(200).send({ message: modificarSolicitud });
        }
      }
    });
  }

    function eliminarSolicitudSala(req, res) {
      var salicitudId = req.params.id;
      var update = req.body;
      SolicitudSala.findByIdAndUpdate(salicitudId, { $set: { estado: 'Eliminado' } }, { new: true }, (err, salicitudDeleted) => {
        if (err) {
          res.status(500).send({ message: 'Error al eliminar la sala' });
        } else {
          if (!salicitudDeleted) {
            res.status(404).send({ message: 'No se ha podido eliminar la' });
          } else {
            res.status(200).send({ message: salicitudDeleted });
          }
        }
      });
    }
  

module.exports = {
  agregarSolicitud,
  obtenerFechaActual,
  obtenerSolicitudesSalas,
  obtenerTodasSolicitudes,
  modificarSolicitudSala,
  eliminarSolicitudSala
}

