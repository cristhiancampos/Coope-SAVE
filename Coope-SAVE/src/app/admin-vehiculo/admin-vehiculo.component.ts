import { Component, OnInit } from '@angular/core';

import {Vehiculo} from '../modelos/vehiculo';

@Component({
  selector: 'app-admin-vehiculo',
  templateUrl: './admin-vehiculo.component.html',
  styleUrls: ['./admin-vehiculo.component.css']
})
export class AdminVehiculoComponent implements OnInit {

  public vehiculo: Vehiculo;

  constructor() { 
    this.vehiculo= new Vehiculo('','','','','','','','');
  }

  ngOnInit() {
  }

  agregarVehiculo(){
    console.log(this.vehiculo);
  }

}
