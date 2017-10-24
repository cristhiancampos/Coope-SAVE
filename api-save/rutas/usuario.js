'use strict'

var express = require('express');
var ControladorUsuario = require('../controladores/usuario');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

// var multipart = require('connect-multiparty');//para subida de ficheros
// var md_upload = multipart({uploadDir:'./uploads/users'});//middleware donde se almacenan las img de usuario

// api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
// api.post('/register',UserController.saveUser);
// api.post('/login',UserController.loginUser);
// api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser);
// api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage);
// api.get('/get-image-user/:imageFile',UserController.getImageFile);

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

module.exports = api;