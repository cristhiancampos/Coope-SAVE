'use strict'
var mailOptions = "";
var Usuario = require('../modelos/usuario');
var listaCorreos = [];
var control= '';
function obtenerUsuarios(req, res) {


    console.log('punto de control');
    Usuario.find({ $or: [{ 'rol': 'NOTIFICACIONES' }, { 'rol': 'ADMINISTRADOR' }], estado: { $ne: "Eliminado" } }, (err, usuarios) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!usuarios) {
                res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
            } else {
                for (let e = 0; e < usuarios.length; e++) {
                    listaCorreos[e] = usuarios[e].correo;
                }
            }
        }


    }).sort('number');


}

function obtenerUsuariosVehiculo(req, res) {


    console.log('punto de control');
    Usuario.find({ $or: [{ 'rol': 'NOTIFICACIONES' }, { 'rol': 'ADMINISTRADOR' }], estado: { $ne: "Eliminado" } }, (err, usuarios) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!usuarios) {
                res.status(404).send({ message: 'No existen usuarios registrados en el sistema' });
            } else {
                for (let e = 0; e < usuarios.length; e++) {
                    listaCorreos[e] = usuarios[e].correo;
                }
            }
        }

        let index = req.acompanantes.length;
        let index2 = listaCorreos.length;
        console.log('index:' + index)
        console.log('tama;o lista correo: ' + index2);
        let contador =0;
        
        for (var z = index2; z < (index + index2); z++) {
            if(contador == index){
                break;
            }else {
                listaCorreos[z]= req.acompanantes[contador].correo;
                contador++;
            }
            
        }
    }).sort('number');

 

}




function horaFormato12Horas(horario) {
    let meridianoInit;
    let meridianoFin;
    let meridNumIni;
    let meridNumFin;
    console.log(horario);
    if (parseInt(horario.minute) < 10) {
        horario.minute = '0' + horario.minute;
    }

    if (parseInt(horario.hour) < 12) {
        meridianoInit = "AM";
        meridNumIni = parseInt(horario.hour);
    } else if (parseInt(horario.hour) >= 12) {
        meridianoInit = "PM";
        meridNumIni = (parseInt(horario.hour) - 12);
    }
    if (parseInt(horario.hour) == 24) {
        meridianoFin = "AM";
        meridNumFin = (parseInt(horario.hour) - 12);
    }
    if (parseInt(horario.hour) > 12 && parseInt(horario.hour) < 24) {
        meridianoFin = "PM";
        meridNumFin = (parseInt(horario.hour) - 12);
    } else if (parseInt(horario.hour) < 12) {
        meridianoFin = "AM";
        meridNumFin = parseInt(horario.hour);
    }
    if (meridNumIni == 0) {
        meridNumIni = meridNumIni + 12;
    }
    return meridNumIni + ':' + horario.minute + ' ' + meridianoInit;
}



var nodemailer = require('nodemailer');
// email sender function
exports.sendEmailSala = function (req, res) {

    var params = req.body;
    var listaRecurso = ``;

    for (var i = 0; i < params.recursos.length; i++) {

        listaRecurso += '<p style="font-size:14px;">' + params.recursos[i] + '</p>';
    }
    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: 'notificaciones@coopesparta.fi.cr',
            pass: 'Sparta*1964*'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });

    // Definimos el email

    mailOptions = {
        from: '" SAVE-COOPESPARTA RL." <notificaciones@coopesparta.fi.cr',
        to: listaCorreos,
        subject: 'Nueva Solicitud de Sala - SAVE COOPESPARTA R.L',
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
                    <tr>
                      <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><strong>Usuario</strong></td>
                      <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ params.usuario + `</b></td>
                      
                    </tr>
                    
                    <tr>
                        <br>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Sala</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+ params.sala + `</b></td>
                    </tr>
                    <tr>
                        <br>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Motivo</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+ params.descripcion + `</b></td>
                    </tr>
                     
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Fecha</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ params.fecha.day + '/' + params.fecha.month + '/' + params.fecha.year + `</b></td>
                    </tr> 
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Hora Inicio</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ horaFormato12Horas(params.horaInicio) + `</b></td>
                    </tr> 
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Hora Final</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ horaFormato12Horas(params.horaFin) + `</b></td>
                    </tr> 
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Personas</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+ params.cantidadPersonas + `</b></td>
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
                        <div style="font-size:22px; text-align: center;"><b> Recursos</b></div>
                        <div style="font-size:14px;">
                          <br > `+ listaRecurso + `<br>
                        </div></td>
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

    obtenerUsuarios();

    // Enviamos el email
    if (!listaCorreos) {
        console.log("Error en la solicitud");
    } else {

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {

                return null;
                console.log(info);
            } else {
                console.log("Correo enviado exitosamente");
                res.status(200).jsonp(req.body);
            }
        });
    }

};

exports.sendEmailVehiculo = function (req, res) {

    var params = req.body;
    var listaAcompanantes = [];
    obtenerUsuariosVehiculo(params);

    for (var i = 0; i < params.acompanantes.length; i++) {

        listaAcompanantes += '<p style="font-size:14px;">' + params.acompanantes[i].nombre + ' ' + params.acompanantes[i].apellidos + '</p>';

    }


    // Definimos el transporter
    var transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Office 365 server
        port: 587,     // secure SMTP
        secure: false, // false for TLS - as a boolean not string - but the default is false so just remove this completely
        auth: {
            user: 'notificaciones@coopesparta.fi.cr',
            pass: 'Sparta*1964*'
        },
        tls: {
            ciphers: 'SSLv3'
        }
    });



    // Definimos el email
    mailOptions = {
        from: '" SAVE-COOPESPARTA RL." <notificaciones@coopesparta.fi.cr',
        to: listaCorreos,
        subject: 'Nueva Solicitud de Vehículo - SAVE COOPESPARTA R.L',
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
                        <tr>
                          <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><strong>Usuario</strong></td>
                          <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ params.usuario + `</b></td>
                          
                        </tr>
                        
                        <tr>
    
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Vehício</b></td>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878; margin-top: 30px;">`+ params.vehiculo + `</b></td>
                        </tr>
                        <tr>
                            
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Motivo</b></td>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+ params.descripcion + `</b></td>
                        </tr>
                        <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Destino</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+ params.destino + `</b></td>
                    </tr> 
                        <tr>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Fecha</b></td>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ params.fecha.day + '/' + params.fecha.month + '/' + params.fecha.year + `</b></td>
                        </tr> 
                        <tr>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Hora Salida</b></td>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ horaFormato12Horas(params.horaSalida) + `</b></td>
                        </tr> 
                        <tr>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#6e6e6e;;"><b>Hora Final</b></td>
                            <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+ horaFormato12Horas(params.horaRegreso) + `</b></td>
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
                                <div style="font-size:22px; text-align: center;"><b> Acompañantes </b></div>
                                <div style="font-size:14px;">
                                  <br >`+ listaAcompanantes + `<br>
                                </div></td>
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



    // Enviamos el email
    if (!listaCorreos) {
        console.log("Error en la solicitud");
    } else {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {

                return null;
                console.log(info);
            } else {
                console.log("Correo enviado exitosamente");
                res.status(200).jsonp(req.body);
            }
        });
    }

};






