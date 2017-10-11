import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { NgModel } from '@angular/forms';

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

  constructor(private _servUsuario: ServicioUsuario) {
    this.usuario = new Usuario('', '', '', '', '', '', '');
    this.usuarioRegistrado = new Usuario('', '', '', '', '', '', '');
    this.confirmaContra = '';
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
    this.mmostrar = false;
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $('#exampleModal').addClass('show');
    $('#exampleModal').css('display', 'block');

    // $("head").append($("<link rel='stylesheet' href='./principal.Component.css' type='text/css' media='screen' />"))
    // this.identity = localStorage.getItem('identity');
    // alert('principal'+this.identity);

  }

  validarCorreo() {
    // alert('El correo ya existe');
  }
  validarContrasena() {
    //alert('Contase;a invalida');
  }
  validarConfirmacionContrasena() {
    //alert('Contase;a invalida');
  }

  registrarUsuario() {
    //alert('Registrar usuario');
    console.log(this.usuario);
    this._servUsuario.registrarUsuario(this.usuario).subscribe(
      response => {
        let user = response.usuario;
        this.usuarioRegistrado = user;
        if (!user._id) {
          this.mensajeAlerta = "error al registarse";
        } else {
          this.mensajeAlerta = "Usuario registrado  exitosamente";//, Identificate con  "+this.user_register.email;
          this.usuarioRegistrado = new Usuario('', '', '', '', '', '', '');
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.mensajeAlerta = body.message;
          console.log(error);
        }
      }
    );
  }

}
