'use strict'

var SolicitudVehiculo = require('../modelos/solicitudVehiculo');

function agregarSolicitud(req, res) {
 
  var solicitud = new SolicitudVehiculo();
  var params = req.body;
  
  //let hora= {minute: params.horaRegreso.minute, hour: params.horaRegreso.hour};
  solicitud.usuario= params.usuario,
  solicitud.vehiculo = params.vehiculo;
  solicitud.departamento = params.departamento;
  solicitud.fecha = params.fecha;
  solicitud.horaSalida = {second: 0,  minute: params.horaSalida.minute, hour: params.horaSalida.hour};
  solicitud.horaRegreso= {second: 0,  minute: params.horaRegreso.minute, hour: params.horaRegreso.hour};
  solicitud.descripcion = params.descripcion;
  solicitud.estado = 'Habilitado';
  solicitud.acompanantes= params.acompanantes;
  solicitud.created_at = new Date();
  solicitud.updated_at = params.updated_at;
  solicitud.destino = params.destino;
  console.log(solicitud);
  if (
    solicitud.vehiculo != null  && solicitud.fecha != null
    && solicitud.horaSalida != null && solicitud.horaRegreso != null && solicitud.descripcion != null
    && solicitud.created_at != null && solicitud.estado != null
  ) {
    //guardar departamento
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

function obtenerFechaActualVehiculo(req, res) {
  var hoy = new Date();
  res.status(200).send({ currentDate: hoy });
}

function obtenerSolicitudesvehiculos(req, res) {
  let date = new Date(req.body.fecha.toString())
  let year = date.getFullYear();
  let month = (date.getMonth() + 1);
  let day = date.getDate();
  console.log(date);

  SolicitudVehiculo.find({ fecha: { year: year, month: month, day: day } }, (err, solicitud) => {
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
  SolicitudVehiculo.find({ estado: { $ne: "Eliminado" } }, (err, solicitudVehiculos) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!solicitudVehiculos) {
        res.status(404).send({ message: 'No existen vehiculos registradas en el sistema' });
      } else {
        res.status(200).send({ message: solicitudVehiculos });
      }
    }
  }).sort('number');

}


function modificarsolicitudVehiculo(req, res) {
  
  
    var params = req.body;
    var solicitudId = params._id;
    params.updated_at = new Date();
  
  
    SolicitudVehiculo.findByIdAndUpdate(solicitudId, params, (err, modificarSolicitud) => {
      if (err) {
  
        res.status(500).send({ message: 'Error al actualizar la vehiculo' });
      } else {
        if (!modificarSolicitud) {
  
          res.status(404).send({ message: 'No se ha podido actualizar la vehiculo' });
        } else {
  
          res.status(200).send({ message: modificarSolicitud });
        }
      }
    });
  }

    function eliminarsolicitudVehiculo(req, res) {
      var salicitudId = req.params.id;
      var update = req.body;
      SolicitudVehiculo.findByIdAndUpdate(salicitudId, { $set: { estado: 'Eliminado' } }, { new: true }, (err, salicitudDeleted) => {
        if (err) {
          res.status(500).send({ message: 'Error al eliminar la vehiculo' });
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
  obtenerFechaActualVehiculo,
  obtenerSolicitudesvehiculos,
  obtenerTodasSolicitudes,
  modificarsolicitudVehiculo,
  eliminarsolicitudVehiculo
}

