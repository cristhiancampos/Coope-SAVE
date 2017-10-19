'use strict'

var Sala = require('../modelos/salas');

function agregarSala(req, res) {
    
      var sala = new Sala();//creamos un nuevo objeto sala 
      var params = req.body;//obtenemos los datos de la peticion
      //llenamos el nuevo objeto usuario a agregar con los datos del request
      sala.nombre = params.nombre;
      sala.cupo = params.cupo;
      sala.descripcion = params.descripcion;
      sala.reporte= params.reporte;
      sala.estado = params.estado;
     
          console.log(sala);
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

function validarSala(req, res)
{
  var params = req.body;
  var nombre = params.nombre;
  console.log(nombre);
  Sala.findOne({ nombre: nombre }, (err, sala) => {
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

function obtenerSalas(req, res){
  Sala.find({},(err,salas)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!salas){
            res.status(404).send({message:'No existen Salas registradas en el sistema'});
        }else{
            res.status(200).send({message:salas});
        }
    }
  }).sort('number'); 
}

function obtenerSala(req, res){
  var salaId = req.params.id;
  Sala.find({_id: salaId},(err,sala)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!sala){
            res.status(404).send({message:'No existen Salas registradas en el sistema'});
        }else{
            res.status(200).send({message:sala});
        }
    }
  });
}

module.exports = {
    agregarSala,
    validarSala,
    obtenerSalas,
    obtenerSala
  };