import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioVehiculo } from '../servicios/vehiculo';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Vehiculo } from '../modelos/vehiculo';

@Component({
  selector: 'app-admin-vehiculo',
  templateUrl: './admin-vehiculo.component.html',
  styleUrls: ['./admin-vehiculo.component.css'],
  providers: [ServicioVehiculo]


})
export class AdminVehiculoComponent implements OnInit {

  public vehiculoEdit: Vehiculo;
  public vehiculo: Vehiculo;
  placaExist: boolean;
  placaExistEdit: boolean;
  placa = '';
  public vehiculos = [];
  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';

  //public existe=true;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servVehiculo: ServicioVehiculo
  ) {
    this.vehiculoEdit = new Vehiculo('', '', '', '', '', '', '', '','','');
    this.vehiculo = new Vehiculo('', '', '', '', '', '', this.estadoMensaje, '-','','');
  }

  ngOnInit() {
    this.obtenerVehiculos();
  }

  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.vehiculo.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.vehiculo.estado = this.estadoMensaje;
    }
  }
  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.vehiculoEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.vehiculoEdit.estado = this.estadoMensaje;
    }
  }

  agregarVehiculo() {
    let placa = this.vehiculo.placa.trim().toUpperCase();
    this.vehiculo.placa = placa;
    this._servVehiculo.registrarVehiculo(this.vehiculo).subscribe(
      response => {

        let vehiculo = response.vehiculo;

        if (!response.vehiculo.placa) {
          alert('Error al registrar la vehiculo');
        } else {
          alert('vehiculo registrado exitosamente');
          this.vehiculo = new Vehiculo('', '', '', '', '', '', this.estadoMensaje, '-','','');
          this.cerrarModal("#modalAdminVehiculo")
          this.obtenerVehiculos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('vehiculo no registrado');
          //console.log(error);
        }
      }
    );
  }

  validarVehiculo() {
    let placa = this.vehiculo.placa.trim().toUpperCase();
    this.vehiculo.placa = placa;
    this._servVehiculo.validarVehiculo(this.vehiculo).subscribe(
      response => {
        if (response.message) {//vehículo existe
          let carro = response.message;
          this.placa = carro;
          this.placaExist = true;
          $('#input-placa').css("border-left", "5px solid #a94442");
        } else {// el vehiculo no existe
          $('#input-placa').css("border-left", "5px solid #42A948");
          this.placa = null;
          this.placaExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerVehiculos() {
    this._servVehiculo.obtenerVehiculos().subscribe(
      response => {
        if (response.message) {
          this.vehiculos = response.message;
        } else {//ho hay vehiculos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerVehiculo(_id: any) {
    this._servVehiculo.obtenerVehiculo(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.vehiculoEdit._id = response.message[0]._id;
          this.vehiculoEdit.placa = response.message[0].placa;
          this.vehiculoEdit.tipo = response.message[0].tipo;
          this.vehiculoEdit.marca = response.message[0].marca;
          this.vehiculoEdit.descripcion = response.message[0].descripcion;
          this.vehiculoEdit.kilometraje = response.message[0].kilometraje;
          this.vehiculoEdit.estado = response.message[0].estado;
          this.vehiculoEdit.reporte = response.message[0].reporte;

          this.estadoMensajEdit = this.vehiculoEdit.estado;
          if (this.vehiculoEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//No se ha encontrado el Vehiculo
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarVehiculo() {

    this.vehiculoEdit.estado = this.estadoMensajEdit;
    this._servVehiculo.modificarVehiculo(this.vehiculoEdit).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al modificar el vehiculo');
        } else {
          alert('Sala modificada exitosamente');
          this.vehiculoEdit = new Vehiculo('', '', '', '', '', '', '', '-','','');
          this.obtenerVehiculos();
          this.cerrarModal('#modalEditVehiculo');
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('El Vehiculo no se pudo modificar');

        }
      }
    );
   }

   validarModificacion() {
    let placa = this.vehiculoEdit.placa.trim().toUpperCase();
    this.vehiculoEdit.placa = placa;

    this._servVehiculo.validarModificacion(this.vehiculoEdit).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let sala = response.message;
          this.placaExistEdit = true;
          $('#input-placa-edit').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-placa-edit').css("border-left", "5px solid #42A948");
          this.placaExistEdit = false;
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

  eliminarVehiculo() {
    this._servVehiculo.eliminarVehiculo(this.vehiculoEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al eliminar el vehículo');
        } else {
          alert('Vehículo eliminado exitosamente');
          this.vehiculoEdit = new Vehiculo('', '', '', '', '', '', '', '','','');
          this.obtenerVehiculos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Vehículo no eliminada');
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
