import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ServicioUsuario } from '../servicios/usuario';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.Component.css'],
  providers: [ServicioUsuario]
})
export class PrincipalComponent implements OnInit {
  //identity = true;
  mmostrar = false;
  public usuario: Usuario;
  public usuarioRegistrado: Usuario;
  
  public confirmaContra;
  public mensajeAlerta;
  public correo = "";
  public userExist: boolean;
  public matchPass = false;
  public identity;
  public token;
  public mensajeError = "";
  public verError = false;
  public recordarme = false;


  //constructor del componente principal
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario
   ) 
    {
    this.usuario = new Usuario('', '', '', '', '', '', '');
    this.usuarioRegistrado = new Usuario('', '', '', '', '', '', '');
    this.confirmaContra = '';
    this.userExist = false;
  }

  //cambiar valor del check para recordar credenciales
  rememberChangeValue() {
    this.recordarme = !this.recordarme;
  }
  //cerrar modal
  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
  }
  //abrir modal
  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }
  //al cargarse la pagina verifica si la sesión de usuario se guardó previamente
  ngOnInit() {
    //localStorage.clear();
    this.identity = this._servUsuario.getIndentity();
    this.token = this._servUsuario.getToken();

    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);

    let recordar = localStorage.getItem('remember');
    let recordarValue = JSON.parse(recordar);
    if (user != null) {
      $('#nav-user').text(user.nombre + ' ' + user.apellidos);
      this.mmostrar = true;
    } else {
      $('#nav-user').text(' ');
      this.abrirModal('#loginModal');
      this.mmostrar = false;
    }
  }
  //olcultar mensaje de existencia de usuario
  onfocusCorreo() {
    this.userExist = false;
    this.verError = false;
  }
  // validar la existencia de correo de un usuario
  validarCorreo() {
    this._servUsuario.getCorreo(this.usuario).subscribe(
      response => {
        if (response.message) {
          console.log(response.message.correo);
          let co = response.message.correo;;
          this.correo = co;
          this.userExist = true;
        } else {
          console.log('no existe');
          console.log(response.message);
          this.correo = null;
          this.userExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }
    //registrar usuarios en el sistema
    registrarUsuario() {
      this._servUsuario.registrarUsuario(this.usuario).subscribe(
        response => {
          //  console.log(response.user._id);
          let user = response.user;
          this.usuarioRegistrado = user;
          if (!response.user._id) {
            this.mensajeAlerta = "error al registarse";
            alert('Error al registrar el usario');
          } else {
            alert('Usuario registrado exitosamente');
            console.log(user);
            this.mensajeAlerta = "Usuario registrado  exitosamente";
            if (user != null) {
              $('#nav-user').text(user.nombre + ' ' + user.apellidos);
            } else {
              $('#nav-user').text(' ');
            }
            this.usuarioRegistrado = new Usuario('', '', '', '', '', '', '');
            localStorage.setItem('identity', JSON.stringify(user));
            this.cerrarModal('#registroUsuarioModal');
            this.mmostrar = true;
          }
        }, error => {
          var alertMessage = <any>error;
          if (alertMessage != null) {
            var body = JSON.parse(error._body);
            this.mensajeAlerta = body.message;
            alert('Usuario no registrado');
          }
        }
      );
    }
    //iniciar sesión en el sistema
    public login() {
      console.log(this.usuario);
      // obtener datos de usuaario identificado
      this._servUsuario.loginUsuario(this.usuario).subscribe(response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert('usuario no indentificado correctamente');
        } else {
          // crear elemento en el localstorage para la session de usuario//
          localStorage.setItem('identity', JSON.stringify(identity));   //JSON.stringfy(), convierte un json a string
          console.log(response.user);
          //conseguir el token para enviarselo a cada petición
          this._servUsuario.loginUsuario(this.usuario, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0) {
                alert('el token no se ha generado');
              } else {
                //   crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.usuario = new Usuario('', '', '', '', '', '', '');
                console.log(response.token);
                this.cerrarModal('#loginModal');
                this.mmostrar = true;
                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                if (user != null) {
                  $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                  if (this.recordarme) {
                    localStorage.setItem('remember', 'true');
                  } else {
                    localStorage.removeItem('remember')
                  }
                } else {
                  $('#nav-user').text('');
                }
              }
            }, error => {
              var errorMensaje = <any>error;
  
              if (errorMensaje != null) {
                var body = JSON.parse(error._body);
                this.mensajeError = body.message;
                this.verError = true;
              }
            }
          );
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
          this.mensajeError = body.message;
          this.verError = true;
        }
      }
      );
    }
//mostrar el formulario de registro de usuarios
  mostrarRegistrarse() {
    this.cerrarModal('#loginModal');
    this.abrirModal('#registroUsuarioModal');
    this.mmostrar = false;
  }
  
//regresar al formulario del login
  loginBack(){
    this.usuario = new Usuario('', '', '', '', '', '', '');
    this.cerrarModal('#registroUsuarioModal');
    this.abrirModal('#loginModal');
    this.mmostrar = false;
    this.confirmaContra ='';
  }
  /*mostrar() {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#registroUsuarioModal').removeClass('show');
    $('#registroUsuarioModal').css('display', 'none');
    this.mmostrar = true;
  }
  salir() {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#registroUsuarioModal').removeClass('show');
    $('#registroUsuarioModal').css('display', 'none');
  }*/


  // localStorage.setItem('token',token);
  // localStorage.removeItem('identity');//remover item del localStorage
  // localStorage.removeItem('token');
  // localStorage.clear();

}
