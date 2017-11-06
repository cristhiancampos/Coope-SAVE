'use strict'




    console.log('Llamado en el controlador');
    var nodemailer = require('nodemailer');
    // email sender function
    exports.sendEmail = function(req, res){
    // Definimos el transporter
        var transporter = nodemailer.createTransport({
            service: '',
            auth: {
                user: 'esolis@coopesparta.fi.cr',
                pass: 'solis35.35'
            }
        });
    // Definimos el email
    var mailOptions = {
        from: '<estban.solis35@gmail.com>',
        to: 'estban35@hotmail.com',
        subject: 'Pruebas',
        html: '<h1> probando</h1>'
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
            console.log(error);
            //res.send(500, err.message);
        } else {
            console.log("Email sent");
            res.status(200).jsonp(req.body);
        }
    });
    };




