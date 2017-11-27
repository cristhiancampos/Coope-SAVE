'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Usuario = require('../modelos/usuario');
var jwt = require('../servicios/jwt');
var nodemailer = require('nodemailer');

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
  user.rol = params.rol;
  user.estado = params.estado;
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
 // console.log(params);
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
          res.status(404).send({ message: 'Credenciales incorrectas 2' });
        }
      }
    }
  });

}
function obtenerUsuarios(req, res) {
  Usuario.find({ estado: { $ne: "Eliminado" } }, (err, usuarios) => {
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


function modificarPerfil(req, res) {
  var params = req.body;
  var usuarioId = params._id;
  params.updated_at = new Date();
  console.log("controlador");
  params.updated_at = new Date();
  Usuario.findByIdAndUpdate(usuarioId,
    {
      correo: params.correo,
      nombre: params.nombre,
      apellidos: params.apellidos,
      departamento: params.departamento,
      //rol: params.rol,
      //estado: params.estado,
      updated_at: params.updated_at
    }, (err, modificarUsuario) => {
      if (err) {
        
        res.status(500).send({ message: 'Error al actualizar el usuario' });
      } else {
        if (!modificarUsuario) {
          
          res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
        } else {


          Usuario.find({ _id: usuarioId }, (err, usuario) => {
            if (err) {
              
              res.status(500).send({ message: 'Error en la petición' });
            } else {
              if (!usuario) {
              
                res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
              } else {
                
                res.status(200).send({ message: usuario });

              }
            }
          });
        }
      }
    });




}

function modificarUsuario(req, res) {
  var params = req.body;
  var usuarioId = params._id;
  params.updated_at = new Date();

  Usuario.find({ _id: usuarioId }, (err, usuario) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición' });
    } else {
      if (!usuario) {
        res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
      } else {
        params.updated_at = new Date();
        Usuario.findByIdAndUpdate(usuarioId,
          {
            correo: params.correo,
            nombre: params.nombre,
            apellidos: params.apellidos,
            departamento: params.departamento,
            updated_at: params.updated_at,
            estado:params.estado
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
  var params = req.body;
  var usuarioId = params._id;
  var contrasenaEncriptada;
  params.updated_at = new Date();
  if (params.contrasena != null) {
    bcrypt.hash(params.contrasena, null, null, function (err, hash) {
      if(err){
        res.status(500).send({ message: 'Error al actualizar el usuario' });
      }else{
          if(!hash){
            res.status(500).send({ message: 'Error al actualizar el usuario' });
          }else{
            Usuario.findByIdAndUpdate(usuarioId,
              {
                contrasena: hash,
                updated_at: params.updated_at
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
  } else {
    res.status(200).send({ message: 'Debe Digitar un contraseña' + '   params..... ' + params });
  }

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
              res.status(200).send({ message: usuarioEdit });
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

function validarContrasena(req, res) {
  var params = req.body;
  var id = params._id;
  var contrasena = params.contrasena;
  if (contrasena != null) {
    Usuario.findOne({ _id: id }, (err, usuario) => {
      if (err) {
        res.status(200).send({ message: null });
      }
      else {
        if (!usuario) {
          res.status(200).send({ message: null });
        }
        else {
          bcrypt.compare(contrasena, usuario.contrasena, function (err, check) {
            if (check) {

              res.status(200).send({ message: usuario });

            } else {

              res.status(200).send({ message: null });
            }
          });



        }
      }

    });


  }
  else {
    res.status(200).send({ message: 'Debe rellenar todos los campos ' });
  }


}

// email sender function
function sendEmail (req, res){
  var listaCorreos=[];
    var params = req.body;
    var listaRecurso= ``;
    var correo=params.correo;
  //  console.log(params.correo);
   // listaCorreos.push(params.correo);

    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: 'notificaciones@coopesparta.fi.cr',
            pass: 'sparta2011*'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

// Definimos el email
var mailOptions = {
    from: '" SAVE-COOPESPARTA RL." <notificaciones@coopesparta.fi.cr',
    to: correo,
    subject: 'Recuperación de Contraseña',
    html: `
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Untitled Document</title>
    </head>
    
    <body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" valign="top" bgcolor="#797979" style="background-color:#797979;"><br>
        <br>

        <table width="600" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="2" align="left" valign="top" bgcolor="#2a2a2a" style="background-color:#f5f5f5; padding:10px; font-family:Georgia, 'Times New Roman', Times, serif; color:#202CE0; font-size:60px; text-align: center;"><img src="http://www.coopesparta.fi.cr/images/logo.png" alt=""></td>
          </tr>
          
          <tr>
          
            <td width="100%" align="center" valign="top" style="padding:12px; background-color:#ffffff;" bgcolor="#ffffff;">
              <table width="100%" border="0" cellspacing="0" cellpadding="4" style="margin-bottom:20px;">
              <h2>Recuperación de Contraseña</h2>
                <tr>
                  <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><strong>Usuario</strong></td>
                  <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+params.correo+`</b></td>
                  
                </tr>
                
                <tr>
                    <br>
                    <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Contraseña Temporal</b></td>
                    <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+params.contrasena+`</b></td>
                </tr>
              </table>
    
            </td>
          </tr>
          <tr>
              <td align="left" valign="top" style="background-color:#fff; padding:10px;" bgcolor="#e4e4e4;">
                  <hr style="width: 100%">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; color:#6e6e6e;">
                    <div style="font-size:22px; text-align: center;"><h5> SAVE- Sistema de Gestión de Salas y Vehiculos</h5></div>
                    
                  </tr>
                </table></td>
          </tr>
        </table>
        <br>
        <br></td>
      </tr>
    </table>
    </body>
    </html>
    
    `
};

//obtenerUsuarios();
// Enviamos el email
if(!correo){
    console.log("Error en la solicitud");
}else{
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
           
           return null;
        console.log(info);
        } else {
            console.log("correo Enviado");
            res.status(200).jsonp(req.body);
        }
    });
}

};

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
  modificarUsuarioCompleto,
  validarContrasena,
  modificarPerfil,
  sendEmail

};


