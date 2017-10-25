'use strict'

var SolicitudSala = require('../modelos/solicitudSala');

function agregarSolicitud(req, res) {

    var solicitud = new  SolicitudSala();
    var params = req.body;
    solicitud.sala=params.sala;
    solicitud.usuario=params.usuario;
    solicitud.fecha=params.fecha;
    solicitud.horaInicio=params.horaInicio;
    solicitud.horaFin=params.horaFin;
    solicitud.descripcion=params.descripcion;
    solicitud.cantidadPersonas=params.cantidadPersonas;
    solicitud.estado='Habilitado';
    solicitud.recursos=params.recursos;
    solicitud.created_at= new Date();
    solicitud.updated_at=params.updated_at;

    
    console.log(solicitud);
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
    res.status(200).send({ message: 'Debe rellenar todos los campos  requeridos' });
  }
}

module.exports = {
    agregarSolicitud
  };