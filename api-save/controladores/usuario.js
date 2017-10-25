'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelos/usuario');
var jwt = require('../servicios/jwt');

function getUsuario(req, res) {
  res.status(200).send({ user: process.env["USERPROFILE"] });
}

function agregarUsuario(req, res) {

  var user = new Usuario();//creamos un nuevo objeto usuario  
  var params = req.body;//obtenemos los datos de la peticion
  //llenamos el nuevo objeto usuario a agregar con los datos del request
  user.nombre = params.nombre;
  user.apellidos = params.apellidos;
  user.correo = params.correo;
  user.rol = 'USUARIO';
  user.estado = 'Habilitado';
  user.departamento = params.departamento;
  user.contrasena = params.contrasena;
  user.created_at = new Date();


  if (params.contrasena && user.contrasena != null) {
    //encriptar password
    bcrypt.hash(params.contrasena, null, null, function (err, hash) {
      user.contrasena = hash;

      if (
        user.nombre != null && user.apellidos != null && user.correo != null
        && user.rol != null && user.estado != null && user.departamento != null
      ) {
        //guardar usuario
        user.save((err, userStored) => {
          if (err) {
            res.status(500).send({ message: 'Error al registrar usuario ' });
          } else {
            if (!userStored)//verificar que se almaceno correctamente
            {
              res.status(404).send({ message: 'No se ha registrado el usuario ' });
            } else {//todo correcto
              //res.status(200).send({message:'Usuario registrado correctamente '});
              res.status(200).send({ user: userStored });
            }
          }
        });
      } else {
        res.status(200).send({ message: 'Debe rellenar todos los campos ' });
      }
    });
  } else {
    res.status(200).send({ message: 'Debe Digitar un contraseña' + '   params..... ' + params });
  }

}

function getCorreo(req, res) {
  var params = req.body;
  var email = params.correo;

  Usuario.findOne({ correo: email }, (err, user) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!user) {
        res.status(200).send({ message: null });
      }
      else {
        res.status(200).send({ message: user });
      }
    }
  });
}

function loginUsuario(req, res) {
  var params = req.body;
  //console.log(req.body);
  var email = params.correo;
  //console.log(params.correo+'.....'+params.contrasena);
  var password = params.contrasena;

  Usuario.findOne({ correo: email.toLowerCase(), estado: { $ne: "Eliminado" } }, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!user) {
        res.status(404).send({ message: 'Credenciales incorrectas' });
      } else {
        //Comprobar la contraseña
        bcrypt.compare(password, user.contrasena, function (err, check) {
          if (check) {
            //devolver datos de usuario logueado
            if (params.gethash)//verificar token
            {
              //devolver un token de jwt
              res.status(200).send({ token: jwt.createToken(user) });
            } else {
              //devolver usuario
              res.status(200).send({ user });
            }
            // res.status(200).send({ message: 'El usuario no existe'});
          } else {
            res.status(404).send({ message: 'Credenciales incorrectas' });
          }
        });
      }
    }
  });
}

function verificarCredenciales(req, res) {
  var params = req.body;
  //console.log(req.body);
  var email = params.correo;
  // console.log(params.correo+'.....'+params.contrasena);
  var password = params.contrasena;

  Usuario.findOne({ correo: email, estado: { $ne: "Eliminado" } }, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!user) {
        res.status(404).send({ message: 'Credenciales incorrectas' });
      } else {
        if (user.contrasena == password) {
          if (params.gethash) {
            //console.log(jwt.createToken(user));
            res.status(200).send({ token: jwt.createToken(user) });
          } else {
            res.status(200).send({ user });
          }
        } else {
          res.status(404).send({ message: 'Credenciales incorrectas' });
        }
      }
    }
  });

}
function obtenerUsuarios(req, res) {
  Usuario.find({estado: { $ne: "Eliminado" }}, (err, usuarios) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!usuarios) {
        res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
      } else {
        res.status(200).send({ message: usuarios });
      }
    }
  }).sort('number');
}

function eliminarUsuario(req, res) {
  var usuarioId = req.params.id;
  var update = req.body;
  Usuario.findByIdAndUpdate(usuarioId, { $set: { estado: 'Eliminado' } }, { new: true }, (err, userDeleted) => {
    if (err) {
      res.status(500).send({ message: 'Error al eliminar el usuario' });
    } else {
      if (!userDeleted) {
        res.status(404).send({ message: 'No se ha podido eliminar el usuario' });
      } else {
        res.status(200).send({ message: userDeleted });
      }
    }
  });
}

function obtenerUsuario(req, res) {
  var userId = req.params.id;

  Usuario.find({ _id: userId }, (err, sala) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!sala) {
        res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
      } else {
        res.status(200).send({ message: sala });
      }
    }
  });
}

function modificarUsuario(req, res) {
  var params =req.body;
  var usuarioId = params._id;
  params.updated_at= new Date();

  Usuario.find({ _id: usuarioId }, (err, usuario) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!usuario) {
        res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
      } else {
       /// params.contrasena = usuario.contrasena;
       // console.log(usuario);
        params.updated_at= new Date();
        Usuario.findByIdAndUpdate(usuarioId,
           {
             correo:params.correo,
             nombre:params.nombre,
             apellidos:params.apellidos,
             departamento:params.departamento,
             rol:params.rol,
             estado:params.estado,
             updated_at:params.updated_at
          }, (err, modificarUsuario) => {
          if (err) {
            
            res.status(500).send({ message: 'Error al actualizar el usuario' });
          } else {
            if (!modificarUsuario) {
             
              res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
              
              res.status(200).send({ message: modificarUsuario });
            }
          }
        });
      }
    }
  });
}

function modificarUsuarioCompleto(req, res) {
  var params =req.body;
  var usuarioId = params._id;
  params.updated_at= new Date();

  if (params.contrasena!= null) {
    bcrypt.hash(params.contrasena, null, null, function (err, hash) {
      params.contrasena = hash;
    });
  } else {
    res.status(200).send({ message: 'Debe Digitar un contraseña' + '   params..... ' + params });
  }
  Usuario.findByIdAndUpdate(usuarioId,
     {
       correo:params.correo,
       nombre:params.nombre,
       apellidos:params.apellidos,
       departamento:params.departamento,
       contrasena: params.contrasena,
       updated_at:params.updated_at
    }, (err, modificarUsuario) => {
    if (err) {
      
      res.status(500).send({ message: 'Error al actualizar el usuario' });
    } else {
      if (!modificarUsuario) {
       
        res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
      } else {
        
        res.status(200).send({ message: modificarUsuario });
      }
    }
  });
}


function validarModificacion(req, res) {
  var params = req.body;
  var correo = params.correo;
  var id = params._id;
  Usuario.findOne({ _id: id, correo: correo }, (err, usuario) => {
    if (err) {
      res.status(200).send({ message: null });
    } else {
      if (!usuario) {
        Usuario.findOne({ correo: correo }, (err, usuarioEdit) => {
          if (err) {
            res.status(200).send({ message: null });
          } else {
            if (!usuarioEdit) {
              res.status(200).send({ message: null });
            }
            else {
              res.status(200).send({ message: usuarioEdit});
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


 function validarContrasena(req, res){
  var params = req.body;
  var id = params._id;
  var contrasena;

  if(params.contrasena !=null){
    bcrypt.hash(params.contrasena, null, null, function (err, hash) {
      contrasena = hash});
  }
  else{
    res.status(200).send({ message: 'Debe rellenar todos los campos ' });
  }

  Usuario.findOne({ _id: id, contrasena:contrasena}, (err, usuario) => {
    if (err) {
      res.status(200).send({ message: null });
    } 
    else {
      if (!usuario) {
        res.status(200).send({ message: null });
      }
      else {
        res.status(200).send({ message: usuario});
      }
      }
    
  });
}

module.exports = {
  getUsuario,
  agregarUsuario,
  getCorreo,
  loginUsuario,
  verificarCredenciales,
  obtenerUsuarios,
  eliminarUsuario,
  obtenerUsuario,
  modificarUsuario,
  validarModificacion,
  modificarUsuarioCompleto

};

  // Usuario.findOne({ correo: email.toLowerCase() }, (err, user) => {
  //   console.log(user);
  //   if (err) {
  //     res.status(500).send({ message: 'Error en la petición' });
  //   } else {
  //     if (!user) {
  //       res.status(404).send({ message: 'Credenciales incorrectas' });
  //     } else {
  //       //Comprobar la contraseña
  //       if(user.password !=password) {
  //         res.status(404).send({ message: 'Credenciales incorrectas' });
  //       }else{
  //         if (params.gethash)//verificar token
  //           {
  //             //devolver un token de jwt
  //             res.status(200).send({ token: jwt.createToken(user) });
  //           } else {
  //             //devolver usuario
  //             res.status(200).send({ user });
  //           }
  //       }
  //     }
  //   }
  // });

// function updateUser(req, res){

//   var userId = req.params.id;
//   var update = req.body;
//   if(userId !=req.user.sub)
//   {
//    return res.status(500).send({message:'No tiene permisos para actualizar el usuario'});
//   } 

//   User.findByIdAndUpdate(userId,update,(err, userUpdated) =>{
//     if(err){
//       res.status(500).send({message:'Error al actualizar el usuario'});
//     }else{
//         if(!userUpdated)
//           {
//               res.status(404).send({message:'No se ha podido actualizar el usuario'});
//           }else{
//              res.status(200).send({user:userUpdated});
//           }
//     }
//   });
// }

// function uploadImage(req, res){
//   var userId = req.params.id;
//   var file_name = 'No subido...';

//   if(req.files)
//     {
//       var file_path = req.files.image.path;
//       var file_split = file_path.split('\\');
//       var file_name = file_split[2];
//       //extension del archivo
//       var ext_split = file_name.split('\.');
//       var file_ext = ext_split[1];

//       if(file_ext =='png' || file_ext =='jpg' || file_ext =='gif'){
//         User.findByIdAndUpdate(userId,{image: file_name},(err, userUpdated) =>{
//             if(!userUpdated)
//             {
//                 res.status(404).send({message:'No se ha podido actualizar el usuario'});
//             }else{
//               res.status(200).send({image:file_name, user: userUpdated});
//             }
//         });
//       }else{
//           res.status(200).send({message: 'Extensión no válida'});
//       }
//       console.log(ext_split);
//     }else{
//        res.status(200).send({message:'No ha subido una imagen...'});
//     }
// }

// function getImageFile(req, res)
// {
//   var imageFile = req.params.imageFile;
//   var path_file = './uploads/users/'+imageFile;
//   fs.exists(path_file, function(exists) {
//     if(exists)
//       {
//         res.sendFile(path.resolve(path_file));
//       }else
//       {
//         res.status(200).send({message: 'No existe la imagen'});
//       }
//   });
// }


