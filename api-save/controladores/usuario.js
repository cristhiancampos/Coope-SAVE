'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../modelos/usuario');
var jwt =require('../servicios/jwt');

function pruebas(req, res){
  

  res.status(200).send({message:'Probando accion de controlador de usuarios'+process.env["USERPROFILE"]});
}
// function saveUser(req, res)
// {
//   var user = new User();//creamos un nuevo objeto usuario
//   var params = req.body;//obtenemos los datos de la peticion
//  // console.log(params);
//   //llenamos el nuevo objeto usuario a agregar con los datos del request
//   user.name = params.name;
//   user.surname = params.surname;
//   user.email = params.email;
//   user.role = 'ROLE_USER';
//   user.image = 'null';
//   user.password = params.password;

//   if(params.password && user.password !=null)
//     {
//       //encriptar password
//       bcrypt.hash(params.password,null,null,function(err,hash){
//         user.password = hash;
        
//         if(user.name !=null && user.surname !=null && user.email !=null)
//           {   
//             //guardar usuario
//             user.save((err,userStored) =>{
//               if(err)
//                 {
//                     res.status(500).send({message:'Error al registrar usuario '});
//                 }else{
//                     if(!userStored)//verificar que se almaceno correctamente
//                       {
//                         res.status(404).send({message:'No se ha registrado el usuario '});
//                       }else{//todo correcto
//                         //res.status(200).send({message:'Usuario registrado correctamente '});
//                         res.status(200).send({user: userStored});
//                       }
//                 }
//             });
//           }else{
//             res.status(200).send({message:'Debe rellenar todos los campos '});
//           }
//       });
//     }else
//     {
//       res.status(200).send({message:'Debe Digitar un contraseña'+'   params..... '+params});
//     }

// }

// function loginUser(req, res)//REVISAR METODO FIND
// {

      
//    var params = req.body;
// //console.log(req.body);
//    var email = params.email;
//    //console.log(params.email+'.....'+params.password);
//    var password = params.password;

//    User.findOne({email: email.toLowerCase()}, (err, user) => {
//      if(err)
//       {
//         res.status(500).send({ message: 'Error en la petición'});
//       }else{
//         if(!user)
//           {
//             res.status(404).send({ message: 'Credenciales incorrectas'});
//           }else{
//             //Comprobar la contraseña
//               bcrypt.compare(password,user.password,function(err,check){
//                 if(check)
//                   {
//                     //devolver datos de usuario logueado
//                     if(params.gethash)//verificar token
//                       {
//                           //devolver un token de jwt
//                           res.status(200).send({token:jwt.createToken(user)});
//                       }else{
//                           //devolver usuario
//                           res.status(200).send({user});
//                       }
//                    // res.status(200).send({ message: 'El usuario no existe'});
//                   }else{
//                       res.status(404).send({ message: 'Credenciales incorrectas'});
//                   }
//             });
//           }
//       }
//    });
// }

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

module.exports = {
  pruebas
  // saveUser,
  // loginUser,
  // updateUser,
  // uploadImage,
  // getImageFile
};
