import { Component, OnInit } from '@angular/core';

import {Recurso} from '../modelos/recursos';
@Component({
  selector: 'app-admin-recurso',
  templateUrl: './admin-recurso.component.html',
  styleUrls: ['./admin-recurso.component.css']
})
export class AdminRecursoComponent implements OnInit {

  public recursos: Recurso;
  constructor() {

    this.recursos= new Recurso('','','','','','');
   }

  ngOnInit() {
  }

  agregarRecurso(){
    console.log(this.recursos);
  }

}
