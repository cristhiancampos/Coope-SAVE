import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioSala } from '../servicios/sala';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sala } from '../modelos/salas';

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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servSala: ServicioSala
  ) {
    this.mostrarModal = false;
    this.salaEdit = new Sala('', '', '', '', '', '');
    this.sala = new Sala('', '', '', '', this.estadoMensaje, '-');
  }

  ngOnInit() {
    this.obtenerSalas();
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
          console.log(response.message);
          let sala = response.message;
          this.nombre = sala;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {
          $('#input-nombre').css("border-left", "5px solid #42A948");
          console.log('no existe sala');
          console.log(response.message);
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
          alert('Error al registrar la Sala');
        } else {
          alert('Sala registrada exitosamente');
          this.sala = new Sala('', '', '', '', this.estadoMensaje, '-');
          this.mostrar(false);
          console.log(sala);
          this.obtenerSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Sala no registrado');
          //console.log(error);
        }
      }
    );
  }


  obtenerSalas() {
    this._servSala.obtenerSalas().subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          this.salas = response.message;
        } else {
          console.log('ho hay Salas registradas');
          console.log(response.message);
        }
      }, error => {
        var errorMensaje = <any>error;
        console.log('Error al tratar de obtener las salas');
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
          console.log(response.message[0].cupo);
          //alert(response.message.nombre);
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
         // this.abrirModal('#modalEditSala');
        } else {
          console.log('No se ha encontrado la Sala');
          console.log(response.message);
        }
      }, error => {
        var errorMensaje = <any>error;
        console.log('Error al tratar de obtener las s445555ala');
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarSala() { }

  eliminarSala(){
    
    this._servSala.eliminarSala(this.salaEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al elimar la Sala');
        } else {
          alert('Sala eliminada exitosamente');
          this.salaEdit = new Sala('', '', '', '', '', '-');
          this.obtenerSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Sala no eliminada');
          //console.log(error);
        }
      }
    );
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
