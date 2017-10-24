import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioSala } from '../servicios/sala';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sala } from '../modelos/salas';
import swal from 'sweetalert2'
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';

@Component({
  selector: 'app-admin-sala',
  templateUrl: './admin-sala.component.html',
  styleUrls: ['./admin-sala.component.css'],
  providers: [ServicioSala]
})
export class AdminSalaComponent implements OnInit {

  public sala: Sala;
  public salaEdit: Sala;
  nombre = '';
  public salas = [];
  nombreExist: boolean;
  mostrarModal: boolean;
  nombreExistEdit: boolean;
  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';
  public token;
  public identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servSala: ServicioSala
  ) {
    this.mostrarModal = false;
    this.salaEdit = new Sala('', '', '', '', '', '', '', '');
    this.sala = new Sala('', '', '', '', this.estadoMensaje, '-', '', '');
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
                  this.obtenerSalas();
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
      this.abrirModal('#loginModal');
    }
  }
  
  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.sala.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.sala.estado = this.estadoMensaje;
    }
  }

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.salaEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.salaEdit.estado = this.estadoMensaje;
    }
  }

  validarSala() {
    let nombre = this.sala.nombre.trim().toUpperCase();
    this.sala.nombre = nombre;
    this._servSala.validarSala(this.sala).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.nombre = sala;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-nombre').css("border-left", "5px solid #42A948");
          this.nombre = null;
          this.nombreExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  agregarSala() {
    let nombre = this.sala.nombre.trim().toUpperCase();
    this.sala.nombre = nombre;
    this._servSala.registrarSala(this.sala).subscribe(
      response => {

        let sala = response.sala;

        if (!response.sala._id) {
          this.msjError("La Sala no pudo ser agregada");
        } else {
          this.msjExitoso("Sala Agregada Exitosamente");
          this.sala = new Sala('', '', '', '', this.estadoMensaje, '-', '', '');
          this.mostrar(false);
          this.obtenerSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Sala no registrado');
        }
      }
    );
  }


  obtenerSalas() {
    this._servSala.obtenerSalas().subscribe(
      response => {
        if (response.message) {
          this.salas = response.message;
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerSala(_id: any) {
    this._servSala.obtenerSala(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.salaEdit._id = response.message[0]._id;
          this.salaEdit.nombre = response.message[0].nombre;
          this.salaEdit.cupo = response.message[0].cupo;
          this.salaEdit.descripcion = response.message[0].descripcion;
          this.salaEdit.estado = response.message[0].estado;
          this.salaEdit.reporte = response.message[0].reporte;

          this.estadoMensajEdit = this.salaEdit.estado;
          if (this.salaEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//No se ha encontrado la Sala
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarSala() {
    this.salaEdit.estado = this.estadoMensajEdit;
    this._servSala.modificarSala(this.salaEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Sala no pudo ser Modificada");
        } else {
          this.salaEdit = new Sala('', '', '', '', '', '-', '', '');
          this.obtenerSalas();
          this.cerrarModal('#modalEditSala');
          this.msjExitoso("Sala Modificada Exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Sala no pudo ser Modificada");

        }
      }
    );

  }

  eliminarSala() {
    this._servSala.eliminarSala(this.salaEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Sala no pudo ser Eliminada");
        } else {
          this.msjExitoso("Sala Eliminada Exitosamente");
          this.salaEdit = new Sala('', '', '', '', '', '', '', '');
          this.obtenerSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Sala no pudo ser Eliminada");
        }
      }
    );
  }

  validarModificacion() {
    let nombre = this.salaEdit.nombre.trim().toUpperCase();
    this.salaEdit.nombre = nombre;

    this._servSala.validarModificacion(this.salaEdit).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.nombreExistEdit = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-nombre').css("border-left", "5px solid #42A948");
          this.nombreExistEdit = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  msjExitoso(texto: string){
    swal({
      position: 'top',
      type: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 2500
    })
  }
  
  msjError(texto: string){
    swal(
      'Oops...',
      texto,
      'error'
    )
  }

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

  mostrar(opcion: boolean) {
    if (!opcion) {
      $(".modal-backdrop").remove();
      $('body').removeClass('modal-open');
      $('#modalAdminSala').removeClass('show');
      $('#modalAdminSala').css('display', 'none');


    } else {
      $('body').append('<div class="modal-backdrop fade show" ></div>');
      $('body').addClass('modal-open');
      $('#modalAdminSala').addClass('show');
      $('#modalAdminSala').css('display', 'block');
    }

  }

}
