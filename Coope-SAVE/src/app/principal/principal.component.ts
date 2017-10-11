import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {Usuario} from '../modelos/usuario';
import {NgModel} from '@angular/forms';
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.Component.css']
})
export class PrincipalComponent implements OnInit {
  identity = true;
  mmostrar = false;
  usuario: Usuario;

  constructor() { }
  mostrar() {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');
    this.mmostrar = true;
    this.usuario= new Usuario('','','','','','','');
 
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

  validarCorreo(){  
   // alert('El correo ya existe');
  }
  validarContrasena(){
    //alert('Contase;a invalida');
  }
  validarConfirmacionContrasena(){
    //alert('Contase;a invalida');
  }

  registrarUsuario(){
    alert('Registrar usuario');
  }

  


}
