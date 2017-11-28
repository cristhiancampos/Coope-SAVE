'use strict'

var Departamento = require('../modelos/departamentos');

function agregarDepartamento(req, res) {

  var departamento = new Departamento();//creamos un nuevo objeto departamento
  var params = req.body;//obtenemos los datos de la peticion
  //llenamos el nuevo objeto usuario a agregar con los datos del request
  departamento.nombre = params.nombre;
  departamento.color = params.color;
  departamento.estado = params.estado;
  departamento.created_at = new Date();
  if ( departamento.nombre != null && departamento.color != null && departamento.estado != null) {
    //guardar usuario
    departamento.save((err, departamentoStored) => {
      if (err) {
        res.status(500).send({ message: 'Error al registrar Departamento ' });
      } else {
        if (!departamentoStored)//verificar que se almaceno correctamente
        {
          res.status(404).send({ message: 'No se ha registrado el Departamento ' });
        } else {//todo correcto

          res.status(200).send({ message: departamentoStored });
        }
      }
    });
  } else {
    res.status(200).send({ message: 'Debe rellenar todos los campos ' });
  }
}

function validarDepartamento(req, res) {
  var params = req.body;
  var nombre = params.nombre;
  Departamento.findOne({ nombre: nombre, estado: { $ne: "Eliminado" } }, (err, departamento) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!departamento) {
        res.status(200).send({ message: null });
      }
      else {
        res.status(200).send({ message: departamento }); 
      }
    }
  });
}

function obtenerDepartamentos(req, res) {
  Departamento.find({ estado: { $ne: "Eliminado" } }, (err, departamentos) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!departamentos) {
        res.status(404).send({ message: 'No existen departamentos  registradas en el sistema' });
      } else {
        res.status(200).send({ message: departamentos });
      }
    }
  }).sort('number');
}

function obtenerDepartamento(req, res){
  var departamentoId = req.params.id;
  Departamento.find({_id: departamentoId},(err,departamento)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!departamento){
            res.status(404).send({message:'No existen Salas registradas en el sistema'});
        }else{
            res.status(200).send({message:departamento});
        }
    }
  });
}

function eliminarDepartamento(req, res) {
  var departamentoId = req.params.id;
  var update = req.body;
  Departamento.findByIdAndUpdate(departamentoId, { $set: { estado: 'Eliminado' } }, { new: true }, (err, departamentoDeleted) => {
    if (err) {
      res.status(500).send({ message: 'Error al eliminar el departamento' });
    } else {
      if (!departamentoDeleted) {
        res.status(404).send({ message: 'No se ha podido eliminar el departamento' });
      } else {
        res.status(200).send({ message: departamentoDeleted });
      }
    }
  });
}

function modificarDepartamento(req, res) {
    var params = req.body;
    var departamentoId = params._id;
    params.updated_at = new Date();
    
    Departamento.findByIdAndUpdate(departamentoId, params, (err, modificaDepartamento) => {
      if (err) {
  
        res.status(500).send({ message: 'Error al actualizar el Departamento' });
      } else {
        if (!modificaDepartamento) {
  
          res.status(404).send({ message: 'No se ha podido actualizar el Departamento' });
        } else {
  
          res.status(200).send({ message: modificaDepartamento });
        }
      }
    });
}

function validarModificacion(req, res) {
    var params = req.body;
    var nombre = params.nombre;
    var id = params._id;
    Departamento.findOne({ _id: id, nombre: nombre, estado: { $ne: "Eliminado" } }, (err, departamento) => {
      if (err) {
        res.status(200).send({ message: null });
      } else {
        if (!departamento) {
          Departamento.findOne({ nombre: nombre, estado: { $ne: "Eliminado" } }, (err, departamentoEdit) => {
            if (err) {
              res.status(200).send({ message: null });
            } else {
              if (!departamentoEdit) {
                res.status(200).send({ message: null });
              }
              else {
                res.status(200).send({ message: departamentoEdit});
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
  agregarDepartamento,
  validarDepartamento,
  obtenerDepartamentos,
  obtenerDepartamento,
  eliminarDepartamento,
  validarModificacion,
  modificarDepartamento
  
};