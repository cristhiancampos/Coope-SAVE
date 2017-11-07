'use strict'




    console.log('Llamado en el controlador');
    var nodemailer = require('nodemailer');
  
    // email sender function
    exports.sendEmail = function(req, res){

        var params = req.body;
        console.log(params);
        var listaRecurso= ``;

        for(var i=0; i< params.recursos.length; i++){

            listaRecurso+= "<h2>"+ params.recursos[i]+"</h2>";
        }

        console.log(params);
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
        to: 'esolis@coopesparta.fi.cr',
        subject: 'Prueba',
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
                      <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+params.usuario+`</b></td>
                      
                    </tr>
                    
                    <tr>
                        <br>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Sala</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+params.sala+`</b></td>
                    </tr>
                    <tr>
                        <br>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Motivo</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+params.descripcion+`</b></td>
                    </tr>
                     
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Fecha</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+params.fecha.day+'/'+params.fecha.month+'/'+params.fecha.year+`</b></td>
                    </tr> 
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Hora Inicio</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+params.horaInicio.hour+':'+params.horaInicio.minute+`</b></td>
                    </tr> 
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Hora Final</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; "><b style="color: #7E7878">`+params.horaFin.hour+':'+params.horaFin.minute+`</b></td>
                    </tr> 
                    <tr>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px; color:#000000;"><b>Personas</b></td>
                        <td align="left" valign="top" style="font-family:Verdana, Geneva, sans-serif; font-size:14px;"><b style="color: #7E7878">`+params.cantidadPersonas+`</b></td>
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
                        <div>
                          <br> `+listaRecurso+`<br>
                        </div></td>
                      </tr>
                    </table></td>
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
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
           
           return null;
        console.log(info);
        } else {
            console.log("Email sent");
            res.status(200).jsonp(req.body);
        }
    });
    };




