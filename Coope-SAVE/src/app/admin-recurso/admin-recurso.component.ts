import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioRecursos } from '../servicios/recurso';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Recurso } from '../modelos/recursos';
@Component({
  selector: 'app-admin-recurso',
  templateUrl: './admin-recurso.component.html',
  styleUrls: ['./admin-recurso.component.css'],
  providers: [ServicioRecursos]
})
export class AdminRecursoComponent implements OnInit {

  public recurso: Recurso;
  public recursoEdit: Recurso;
  // codRecursos= '';
  codRecursosExist: boolean;
  public recursos = [];
  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servRecurso: ServicioRecursos
  ) {
    this.recurso = new Recurso('', '', '', '', this.estadoMensaje, '');
    this.recursoEdit = new Recurso('', '', '', '', '', '');
  }

  ngOnInit() {
    this.obtenerRecursos();
  }
  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.recurso.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.recurso.estado = this.estadoMensaje;
    }
  }

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.recursoEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.recursoEdit.estado = this.estadoMensaje;
    }
  }

  agregarRecurso() {
    let codigoActivo = this.recurso.codigoActivo.trim().toUpperCase();
    this.recurso.codigoActivo = codigoActivo;
    this._servRecurso.registrarRecurso(this.recurso).subscribe(
      response => {
        let recurso = response.message;
        if (!response.message) {
          alert('Error al registrar la recurso');
        } else {
          alert('recurso registrado exitosamente');
          this.recurso = new Recurso('', '', '', '', this.estadoMensaje, '');
          this.cerrarModal("#modalAdminRecurso");
          this.obtenerRecursos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  validarRecurso() {
    let codigoActivo = this.recurso.codigoActivo.trim().toUpperCase();
    this.recurso.codigoActivo = codigoActivo;
    this._servRecurso.validarRecurso(this.recurso).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.codRecursosExist = true;
          $('#input-codigo').css("border-left", "5px solid #a94442");
        } else {//no existe el recurso
          $('#input-codigo').css("border-left", "5px solid #42A948");
          this.codRecursosExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerRecursos() {
    this._servRecurso.obtenerRecursos().subscribe(
      response => {
        if (response.message) {
          this.recursos = response.message;
        } else {//no hay recursos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerRecurso(_id: any) {
    this._servRecurso.obtenerRecurso(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.recursoEdit._id = response.message[0]._id;
          this.recursoEdit.nombre = response.message[0].nombre;
          this.recursoEdit.codigoActivo = response.message[0].codigoActivo;
          this.recursoEdit.descripcion = response.message[0].descripcion;
          this.recursoEdit.estado = response.message[0].estado;
          this.recursoEdit.reporte = response.message[0].reporte;

          this.estadoMensajEdit = this.recursoEdit.estado;
          if (this.recursoEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//no se encontró el recurso
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }
  onfocusRecurso() {
    // this.codRecursosExist= false;
  }
  modificarRecurso() { }

  eliminarRecurso(){
    
    this._servRecurso.eliminarRecurso(this.recursoEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al elimar la Sala');
        } else {
          alert('Sala eliminada exitosamente');
          this.recursoEdit = new Recurso('', '', '', '', '', '-');
          this.obtenerRecursos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Sala no eliminada');
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

}
