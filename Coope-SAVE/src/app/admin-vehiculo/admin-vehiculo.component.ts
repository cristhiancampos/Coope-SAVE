import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioVehiculo } from '../servicios/vehiculo';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Vehiculo} from '../modelos/vehiculo';

@Component({
  selector: 'app-admin-vehiculo',
  templateUrl: './admin-vehiculo.component.html',
  styleUrls: ['./admin-vehiculo.component.css'],
  providers: [ServicioVehiculo]

  
})
export class AdminVehiculoComponent implements OnInit {

  public vehiculoEdit:  Vehiculo;
  public vehiculo: Vehiculo;
  placaExist: boolean;
  placa= '';
  public vehiculos = [];
  public estado =true;
  public estadoMensaje= 'Habilitado';
  //public existe=true;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servVehiculo: ServicioVehiculo
  ) {
    this.vehiculoEdit= new Vehiculo('','','','','','','','');
    this.vehiculo= new Vehiculo('','','','','','',this.estadoMensaje,'-');
  }

  ngOnInit() {
   this.obtenerVehiculos();
  }

  cambiarEstado(){
    this.estado =!this.estado;
    if(this.estado){
      this.estadoMensaje= 'Habilitado';
     this.vehiculo.estado=this.estadoMensaje;
    }else{
      this.estadoMensaje= 'Deshabilitado';
      this.vehiculo.estado=this.estadoMensaje;
    } 
  }

  agregarVehiculo(){
    let placa = this.vehiculo.placa.trim().toUpperCase();
    this.vehiculo.placa=placa;
    this._servVehiculo.registrarVehiculo(this.vehiculo).subscribe(
      response => {
        
        let vehiculo = response.vehiculo;
       
        if (!response.vehiculo.placa) {    
          alert('Error al registrar la vehiculo');
        } else {
          alert('vehiculo registrado exitosamente');
          this.vehiculo= new Vehiculo('','','','','','',this.estadoMensaje,'-');
          
          this.cerrarModal("#modalAdminVehiculo")
          console.log(vehiculo);
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
  this.vehiculo.placa=placa;
  this._servVehiculo.validarVehiculo(this.vehiculo).subscribe(
    response => {
      if (response.message) {
        console.log(response.message);
        let carro = response.message;
        this.placa = carro;
        this.placaExist = true;
        $('#input-placa').css("border-left", "5px solid #a94442");
      } else {
        $('#input-placa').css("border-left", "5px solid #42A948");
        console.log('no existe vehiculo');
        console.log(response.message);
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
        console.log(response.message);
      //   let carro = response.message;
      //   this.placa = carro;
      //   this.placaExist = true;
      this.vehiculos =response.message;
      } else {
        console.log('ho hay vehiculos registrados');
        console.log(response.message);
        // this.placa = null;
        // this.placaExist = false;
      }
    }, error => {
      var errorMensaje = <any>error;
      console.log('hay erro en la vara');
      if (errorMensaje != null) {
        var body = JSON.parse(error._body);
      }
    }
  );
}

obtenerVehiculo(_id: any){
  
  this._servVehiculo.obtenerVehiculo(_id).subscribe(
    response => {
      if (response.message[0]._id) {
        console.log(response.message[0].cupo);
        //alert(response.message.nombre);
        this.vehiculoEdit._id = response.message[0]._id;
        this.vehiculoEdit.placa = response.message[0].placa;
        this.vehiculoEdit.tipo = response.message[0].tipo;
        this.vehiculoEdit.marca = response.message[0].marca;
        this.vehiculoEdit.descripcion = response.message[0].descripcion;
        this.vehiculoEdit.kilometraje = response.message[0].kilometraje;
        this.vehiculoEdit.estado = response.message[0].estado;
        this.vehiculoEdit.reporte = response.message[0].reporte;
  
        this.abrirModal('#modalEditVehiculo');
      } else {
        console.log('No se ha encontrado el Vehiculo');
        console.log(response.message);
      }
    }, error => {
      var errorMensaje = <any>error;
      console.log('Error al tratar de obtener el Vehiculo');
      if (errorMensaje != null) {
        var body = JSON.parse(error._body);
      }
    }
  );
  }

  modificarVehiculo(){}
  


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
