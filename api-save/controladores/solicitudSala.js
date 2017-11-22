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
    //console.log('Año'+year+'Mes'+month+'Día'+day);
  // fecha: { year: year, month: month, day: day }
   SolicitudSala.find({fecha: { year: year, month: month, day: day },estado: { $ne: "Eliminado" }}, (err, solicitud) => {
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

// function validarModificacion(req, res) {
//   var params = req.body;
//   var nombre = params.nombre;
//   var id = params._id;

//   Sala.findOne({ _id: id, nombre: nombre, estado: { $ne: "Eliminado" } }, (err, sala) => {
//     if (err) {
//       res.status(200).send({ message: null });
//     } else {
//       if (!sala) {
//         Sala.findOne({ nombre: nombre, estado: { $ne: "Eliminado" } }, (err, salaEdit) => {
//           if (err) {
//             res.status(200).send({ message: null });
//           } else {
//             if (!salaEdit) {
//               res.status(200).send({ message: null });
//             }
//             else {
//               res.status(200).send({ message: salaEdit });
//             }
//           }
//         })
//       }
//       else {
//         res.status(200).send({ message: null });
//       }
//     }
//   });
// }

function filtrosReportes(req, res){
  var params = req.body;

  let query=params[0];
  
 console.log(query);
  // if(params.sala !=null){
  //   console.log("viene llena la sala");
  // }
  //  if(params.fechaInicio=!null){
  //    if(params.fechaInicio.year==undefined || params.fechaInicio.year==null || params.fechaInicio.year==""){
  //     console.log('fecha de incio undefinida');
  //    }else{
  //     console.log("viene llena la fecha inicio"+params.fechaInicio.year);
  //    }
  // }
  // if(params.fechaFin.year=!null){
  //   console.log("viene llena la fecha fin");
  // }

//   SolicitudSala.find(query, (err, solicitud) => {

//     if (err) {
//      req.status(500).send({ mesage: 'Error al obtener las solicitudes' });
//    } else {
//      if (!solicitud) {
//        res.status(404).send({ message: 'No existen solicitudes para esta fecha' });
//      } else {
//        res.status(200).send({ message: solicitud });
//      }
//    }
//  });
  // SolicitudSala.find({ estado: { $ne: "Eliminado" } }, (err, solicitudSalas) => {
  //   if (err) {
  //     res.status(500).send({ message: 'Error en la petición' });
  //   } else {
  //     if (!solicitudSalas) {
  //       res.status(404).send({ message: 'No existen Salas registradas en el sistema' });
  //     } else {
  //       res.status(200).send({ message: solicitudSalas });
  //     }
  //   }
  // }).sort('number');

}


function modificarSolicitudSala(req, res) {
  
 
    var params = req.body;
    var solicitudId = params._id;
    console.log(params.fecha);
    params.updated_at = new Date();

  SolicitudSala.findByIdAndUpdate(solicitudId, params, (err, solicitudModificada) => {
    if (err) {

      res.status(500).send({ message: 'Error al actualizar la solicitud' });
    } else {
      if (!solicitudModificada) {

        res.status(404).send({ message: 'No se ha podido actualizar los datos de la solicitud' });
      } else {

        res.status(200).send({ message: solicitudModificada });
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

function obtenerSolicitudSala(req, res) {
  var salicitudId = req.params.id;      
  SolicitudSala.findById(salicitudId , (err, solicitud) => {
    if (err) {
      res.status(500).send({ message: 'Error Solicitud no encontrada' });
    } else {
      if (!solicitud) {
        res.status(404).send({ message: 'No se ha encontrado la solicitud' });
      } else {
        res.status(200).send({ message: solicitud});
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
  eliminarSolicitudSala,
  obtenerSolicitudSala,
  filtrosReportes
}

