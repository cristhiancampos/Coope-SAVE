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
  identity = true;
  mmostrar = false;
  public usuario: Usuario;
  public usuarioRegistrado: Usuario;
  public confirmaContra;
  public mensajeAlerta;
  public correo = "";
  public userExist: boolean;
  public matchPass = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario)
      {
      this.usuario = new Usuario('', '', '', '', '', '', '');
      this.usuarioRegistrado = new Usuario('', '', '', '', '', '', '');
      this.confirmaContra = '';
      this.userExist = false;
      }


  mostrar() {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');
    this.mmostrar = true;
  }
  salir() {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');
  }
  ngOnInit() {
   // localStorage.clear();
    let identity =localStorage.getItem('identity');
    let user =JSON.parse(identity);
    console.log(user);
    if(user!=null)
      {
        this.mmostrar = true;
      }else{
        this.mmostrar = false;
        $('body').append('<div class="modal-backdrop fade show" ></div>');
        $('body').addClass('modal-open');
        $('#exampleModal').addClass('show');
        $('#exampleModal').css('display', 'block');
      }
  }

  //olcultar mensaje de existencia de usuario
  onfocusCorreo() {
    this.userExist = false;
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

  //registrar usuarios en el sistemas
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
          this.usuarioRegistrado = new Usuario('', '', '', '', '', '', '');
          localStorage.setItem('identity',JSON.stringify(user));
          this.mostrar();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.mensajeAlerta = body.message;
          alert('Usuario no registrado');
          //console.log(error);
        }
      }
    );
  }
   // localStorage.setItem('token',token);
  // localStorage.removeItem('identity');//remover item del localStorage
  // localStorage.removeItem('token');
  // localStorage.clear();

}
