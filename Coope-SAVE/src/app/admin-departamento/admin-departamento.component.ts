import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioDepartamento } from '../servicios/departamento';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Departamento } from '../modelos/departamento';

@Component({
  selector: 'app-admin-departamento',
  templateUrl: './admin-departamento.component.html',
  styleUrls: ['./admin-departamento.component.css'],
  providers: [ServicioDepartamento]
})
export class AdminDepartamentoComponent implements OnInit {

  public departamento: Departamento;
  public departamentoEdit: Departamento;
  public departamentos = [];
  nombreExist: boolean;
  nombreExistEdit: boolean;
  mostralModal: boolean;

  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servDepartamento: ServicioDepartamento
  ) {
    this.mostralModal = false;
    this.departamentoEdit = new Departamento('', '', '', '','','');
    this.departamento = new Departamento('', '', '', this.estadoMensaje,'','');
  }

  ngOnInit() {
    this.obtenerDepartamentos();
  }

  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.departamento.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.departamento.estado = this.estadoMensaje;
    }
  }

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.departamentoEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.departamentoEdit.estado = this.estadoMensaje;
    }
  }

  agregarDepartamento() {
    let nombre = this.departamento.nombre.trim().toUpperCase();
    this.departamento.nombre = nombre;
    this._servDepartamento.registrarDepartamento(this.departamento).subscribe(
      response => {
        if (!response.message._id) {
          alert('Error al registrar la departamento');
        } else {
          alert('Departamento registrado exitosamente');
          this.cerrarModal('#modalAdminDepa');
          this.departamento = new Departamento('', '', '', this.estadoMensaje,'','');
          this.obtenerDepartamentos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Departamento no registrado');
        }
      }
    );
  }

  validarDepartamento() {
    let nombre = this.departamento.nombre.trim().toUpperCase();
    this.departamento.nombre = nombre;
    this._servDepartamento.validarDepartamento(this.departamento).subscribe(
      response => {
        if (response.message) {
          let departamento = response.message;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {//no existe el departamento
          this.nombreExist = false;
          $('#input-nombre').css("border-left", "5px solid #42A948");
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerDepartamentos() {
    this._servDepartamento.obtenerDepartamentos().subscribe(
      response => {
        if (response.message) {
          this.departamentos = response.message;
        } else {//ho hay departamentos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }

  obtenerDepartamento(_id: any) {
    this._servDepartamento.obtenerDepartamento(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.departamentoEdit._id = response.message[0]._id;
          this.departamentoEdit.nombre = response.message[0].nombre;
          this.departamentoEdit.color = response.message[0].color;
          this.departamentoEdit.estado = response.message[0].estado;

          this.estadoMensajEdit = this.departamentoEdit.estado;
          if (this.departamentoEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//No se ha encontrado el departamento
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarDepartamento() {
    this.departamentoEdit.estado = this.estadoMensajEdit;
    this._servDepartamento.modificarDepartamento(this.departamentoEdit).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al modificar el departamento');
        } else {
          alert('Departamento modificado exitosamente');
          this.departamentoEdit = new Departamento('', '', '', '', '', '');
          this.obtenerDepartamentos();
          this.cerrarModal('#modalEditDepartamento');
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Departamento no se pudo modificar');

        }
      }
    );
   }

   validarModificacion() {
    let nombre = this.departamentoEdit.nombre.trim().toUpperCase();
    this.departamentoEdit.nombre = nombre;

    this._servDepartamento.validarModificacion(this.departamentoEdit).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let sala = response.message;
          this.nombreExistEdit = true;
          $('#input-nombre-edit-dep').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-nombre-edit-dep').css("border-left", "5px solid #42A948");
          this.nombreExistEdit = false;
        }
      }, error => {
        console.log('error');
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  eliminarDepartamento() {

    this._servDepartamento.eliminarDepartamento(this.departamentoEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al elimar el departamento');
        } else {
          alert('Departamento eliminada exitosamente');
          this.departamentoEdit = new Departamento('', '', '', '','','');
          this.obtenerDepartamentos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Departamento no eliminado');
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

  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }

}
