import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-admin-solicitud',
  templateUrl: './admin-solicitud.component.html',
  styleUrls: ['./admin-solicitud.component.css']
})
export class AdminSolicitudComponent implements OnInit {

  private sala = true;
  private token;
  private identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario) {
  }

  ngOnInit() {
    this.verificarCredenciales();
  }
  verificarCredenciales() {
    this.identity = this._servUsuario.getIndentity();
    this.token = this._servUsuario.getToken();
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    let recordar = localStorage.getItem('remember');
    let recordarValue = JSON.parse(recordar);
    if (user != null) {
      let usuarioTemp = new Usuario('', '', '', '', '', '', '', '', '', '');
      usuarioTemp.correo = user.correo;
      usuarioTemp.contrasena = user.contrasena;
      // obtener datos de usuario identificado
      this._servUsuario.verificarCredenciales(usuarioTemp).subscribe(response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          $('#nav-user').text(' ');
          this.abrirModal('#loginModal');
        } else {
          //conseguir el token para enviarselo a cada petición
          this._servUsuario.verificarCredenciales(usuarioTemp, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0) {
                $('#nav-user').text(' ');
                this.abrirModal('#loginModal');
              } else {
                // crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                if (user != null) {
                  $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                  // this.obtenerVehiculos();
                  this.solicitud(1);
                  this.estiloBotones();
                } else {
                  $('#nav-user').text('');
                }
              }
            }, error => {
              $('#nav-user').text(' ');
              this.abrirModal('#loginModal');
            }
          );
        }
      }, error => {
        $('#nav-user').text(' ');
        this.abrirModal('#loginModal');
      }
      );
    } else {
      $('#nav-user').text(' ');
      //this.abrirModal('#loginModal');
      this._router.navigate(['/principal']);
    }
  }
  // tslint:disable-next-line:one-line
  solicitud(num: any) {
    if (num === 1) {
      this.sala = true;
    } else {
      this.sala = false;
    }
  }

  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
  }

  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }

  estiloBotones(){
    $('#bnt-sala').css('background', '#0069d9');
    $('#bnt-vehiculo').css('background', '#eee');

    $('#bnt-sala').click(function(){
      $('#bnt-sala').css('background', '#0069d9');
      $('#bnt-vehiculo').css('background', '#eee');
    });

    $('#bnt-vehiculo').click(function(){
      $('#bnt-vehiculo').css('background', '#0069d9');
      $('#bnt-sala').css('background', '#eee');
    });
  }


}
