'use strict'

var Sala = require('../modelos/salas');

function agregarSala(req, res) {

  var sala = new Sala();//creamos un nuevo objeto sala 
  var params = req.body;//obtenemos los datos de la peticion
  //llenamos el nuevo objeto usuario a agregar con los datos del request
  sala.nombre = params.nombre;
  sala.cupo = params.cupo;
  sala.descripcion = params.descripcion;
  sala.reporte = params.reporte;
  sala.estado = params.estado;
  sala.created_at = new Date();

  if (
    sala.nombre != null && sala.cupo != null && sala.descripcion != null
    && sala.estado != null
  ) {
    //guardar usuario
    sala.save((err, salaStored) => {
      if (err) {
        res.status(500).send({ message: 'Error al registrar Sala ' });
      } else {
        if (!salaStored)//verificar que se almaceno correctamente
        {
          res.status(404).send({ message: 'No se ha registrado el Sala ' });
        } else {//todo correcto

          res.status(200).send({ sala: salaStored });
        }
      }
    });
  } else {
    res.status(200).send({ message: 'Debe rellenar todos los campos ' });
  }
}

function validarSala(req, res) {
  var params = req.body;
  var nombre = params.nombre;

  Sala.findOne({ nombre: nombre, estado: { $ne: "Eliminado" } }, (err, sala) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!sala) {
        res.status(200).send({ message: null });
      }
      else {
        res.status(200).send({ message: sala });
      }
    }
  });
}

function obtenerSalas(req, res) {
  Sala.find({ estado: { $ne: "Eliminado" } }, (err, salas) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!salas) {
        res.status(404).send({ message: 'No existen Salas registradas en el sistema' });
      } else {
        res.status(200).send({ message: salas });
      }
    }
  }).sort('number');
}

function obtenerSala(req, res) {
  var salaId = req.params.id;

  Sala.find({ _id: salaId }, (err, sala) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!sala) {
        res.status(404).send({ message: 'No existen Salas registradas en el sistema' });
      } else {
        res.status(200).send({ message: sala });
      }
    }
  });
}

function eliminarSala(req, res) {
  var salaId = req.params.id;
  var update = req.body;
  Sala.findByIdAndUpdate(salaId, { $set: { estado: 'Eliminado' } }, { new: true }, (err, salaDeleted) => {
    if (err) {
      res.status(500).send({ message: 'Error al eliminar la sala' });
    } else {
      if (!salaDeleted) {
        res.status(404).send({ message: 'No se ha podido eliminar la' });
      } else {
        res.status(200).send({ message: salaDeleted });
      }
    }
  });
}

function modificarSala(req, res) {


  var params = req.body;
  var salaId = params._id;
  params.updated_at = new Date();


  Sala.findByIdAndUpdate(salaId, params, (err, modificaSala) => {
    if (err) {

      res.status(500).send({ message: 'Error al actualizar la sala' });
    } else {
      if (!modificaSala) {

        res.status(404).send({ message: 'No se ha podido actualizar la sala' });
      } else {

        res.status(200).send({ message: modificaSala });
      }
    }
  });
}

function validarModificacion(req, res) {
  var params = req.body;
  var nombre = params.nombre;
  var id = params._id;

  Sala.findOne({ _id: id, nombre: nombre, estado: { $ne: "Eliminado" } }, (err, sala) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!sala) {
        Sala.findOne({ nombre: nombre, estado: { $ne: "Eliminado" } }, (err, salaEdit) => {
          if (err) {
            res.status(200).send({ message: null });
          } else {
            if (!salaEdit) {
              res.status(200).send({ message: null });
            }
            else {
              res.status(200).send({ message: salaEdit });
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
  agregarSala,
  validarSala,
  obtenerSalas,
  obtenerSala,
  eliminarSala,
  modificarSala,
  validarModificacion
};