import { Component, OnInit } from '@angular/core';

import {Sala} from '../modelos/salas';

@Component({
  selector: 'app-admin-sala',
  templateUrl: './admin-sala.component.html',
  styleUrls: ['./admin-sala.component.css']
})
export class AdminSalaComponent implements OnInit {

public sala: Sala;


  constructor() { 

    this.sala = new Sala('','','','','','');
  }

  ngOnInit() {
  }


agregarSala(){
  alert('Agregar Sala');
  console.log(this.sala);
  
}
}
