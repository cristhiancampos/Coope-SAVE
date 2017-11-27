'use strict'

var express = require('express');
var ControladorUsuario = require('../controladores/usuario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/user',ControladorUsuario.getUsuario);
api.post('/registrar',ControladorUsuario.agregarUsuario);
api.post('/getCorreo',ControladorUsuario.getCorreo);
api.post('/login',ControladorUsuario.loginUsuario);
api.post('/verificarCredenciales',ControladorUsuario.verificarCredenciales);
api.get('/obtenerUsuarios',ControladorUsuario.obtenerUsuarios);
api.get('/obtenerUsuario/:id',ControladorUsuario.obtenerUsuario);
api.delete('/eliminarUsuario/:id', ControladorUsuario.eliminarUsuario);
api.put('/modificarUsuario',ControladorUsuario.modificarUsuario);
api.put('/modificarUsuarioCompleto',ControladorUsuario.modificarUsuarioCompleto);
api.post('/validarModificacionUsuario',ControladorUsuario.validarModificacion);
api.post('/validarContrasena',ControladorUsuario.validarContrasena);
api.put('/modificarPerfil',ControladorUsuario.modificarPerfil);
api.post('/enviarContrasena', ControladorUsuario.sendEmail);



module.exports = api;