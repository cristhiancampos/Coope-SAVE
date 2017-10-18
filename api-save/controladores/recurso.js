'use strict'

var Recurso = require('../modelos/recursos');

function agregarRecurso(req, res) {
    
      var recurso = new Recurso();//creamos un nuevo objeto recurso 
      var params = req.body;//obtenemos los datos de la peticion
      //llenamos el nuevo objeto usuario a agregar con los datos del request
      recurso.nombre = params.nombre;
      recurso.codigoActivo = params.codigoActivo;
      recurso.descripcion = params.descripcion;
      recurso.reporte= '';
      recurso.estado = 'Hablilitado';
     
          console.log(recurso);
          if (
            recurso.nombre != null && recurso.codigoActivo != null && recurso.descripcion != null
            && recurso.estado != null 
          ) {
            //guardar usuario
            recurso.save((err, recursoStored) => {
              if (err) {
                res.status(500).send({ message: 'Error al registrar recurso ' });
              } else {
                if (!recursoStored)//verificar que se almaceno correctamente
                {
                  res.status(404).send({ message: 'No se ha registrado el recurso ' });
                } else {//todo correcto
                  
                  res.status(200).send({ message: recursoStored });
                }
              }
            });
          } else {
            res.status(200).send({ message: 'Debe rellenar todos los campos ' });
          }
    }



// function validarRecurso(req, res)
// {
//   var params = req.body;
//   var codigoActivo = params.codigoActivo;

//   console.log(params);
  
//   Recurso.findOne({ codigoActivo: codigoActivo }, (err, recurso) => {
//     if (err) {
//       res.status(200).send({ message: null });
//     } else {
//       if (!recurso) {
//         res.status(200).send({ message: null });
//       }
//       else {
//         res.status(200).send({ message: recurso });
//       }
//     }
//   });
// }
function validarRecurso(req, res)
{
  var params = req.body;
  var codigoActivo = params.codigoActivo;
  console.log(codigoActivo);

 Recurso.findOne({ codigoActivo: codigoActivo }, (err, recurso) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!recurso) {
        res.status(200).send({ message: null });
      }
      else {
        res.status(200).send({ message: recurso });
      }
    }
  });
}


function obtenerRecursos(req, res){
  Recurso.find({},(err,recursos)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!recursos){
            res.status(404).send({message:'No existen recursos registrados en el sistema'});
        }else{
            res.status(200).send({message:recursos});
        }
    }
  }).sort('number'); 
}
    module.exports = {
        
        agregarRecurso,
        validarRecurso,
        obtenerRecursos
       
      };