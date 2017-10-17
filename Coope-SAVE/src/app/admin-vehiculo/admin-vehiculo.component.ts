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

  public vehiculo: Vehiculo;
  placaExist: boolean;
  placa= '';
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servVehiculo: ServicioVehiculo
  ) { 
    this.vehiculo= new Vehiculo('','','','','','','','');
  }

  ngOnInit() {
  }

  agregarVehiculo(){
    this._servVehiculo.registrarVehiculo(this.vehiculo).subscribe(
      response => {
        
        let vehiculo = response.vehiculo;
       
        if (!response.vehiculo.placa) {    
          alert('Error al registrar la vehiculo');
        } else {
          alert('vehiculo registrado exitosamente');
          this.vehiculo= new vehiculo('','','','','','','','');
          
          this.cerrarModal("#modalAdminVehiculo")
          console.log(vehiculo);
          
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
  this._servVehiculo.validarVehiculo(this.vehiculo).subscribe(
    response => {
      if (response.message) {
        console.log(response.message);
        let carro = response.message;
        this.placa = carro;
        this.placaExist = true;
      } else {
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
