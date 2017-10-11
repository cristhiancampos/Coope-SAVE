import { Component, OnInit } from '@angular/core';

import {Departamento} from '../modelos/departamento';

@Component({
  selector: 'app-admin-departamento',
  templateUrl: './admin-departamento.component.html',
  styleUrls: ['./admin-departamento.component.css']
})
export class AdminDepartamentoComponent implements OnInit {

  public departamento: Departamento;
  constructor() {
    this.departamento= new Departamento('','','','');
   }

  ngOnInit() {
  }

  agregarDepartamento(){
    console.log(this.departamento);
  }

}
