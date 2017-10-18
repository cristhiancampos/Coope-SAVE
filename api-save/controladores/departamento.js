'use strict'

var Departamento = require('../modelos/departamentos');

function agregarDepartamento(req, res) {
    
      var departamento = new Departamento();//creamos un nuevo objeto departamento
      var params = req.body;//obtenemos los datos de la peticion
      //llenamos el nuevo objeto usuario a agregar con los datos del request
      departamento.nombre = params.nombre;
      departamento.color = params.color;
      departamento.estado = 'Hablilitado';
     
          console.log(departamento);
          if (
            departamento.nombre != null && departamento.color != null && departamento.estado != null
          ) {
            //guardar usuario
            departamento.save((err, departamentoStored) => {
              if (err) {
                res.status(500).send({ message: 'Error al registrar Departamento ' });
              } else {
                if (!departamentoStored)//verificar que se almaceno correctamente
                {
                  res.status(404).send({ message: 'No se ha registrado el Departamento ' });
                } else {//todo correcto
                  
                  res.status(200).send({ sala: departamentoStored });
                }
              }
            });
          } else {
            res.status(200).send({ message: 'Debe rellenar todos los campos ' });
          }
    }



function validarDepartamento(req, res)
{
  var params = req.body;
  var nombre = params.nombre;
  console.log(nombre);
  Sala.findOne({ nombre: nombre }, (err, departamento) => {
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

function obtenerDepartamentos(req, res){
  Departamento.find({},(err,departamentos)=>{
    if(err){
      res.status(500).send({message:'Error en la petición'});
    }else{
        if(!departamentos ){
            res.status(404).send({message:'No existen departamentos  registradas en el sistema'});
        }else{
            res.status(200).send({message:departametos });
        }
    }
  }).sort('number'); 
}

    module.exports = {
        
        agregarDepartamento,
        validarDepartamento,
        obtenerDepartamentos 
       
      };