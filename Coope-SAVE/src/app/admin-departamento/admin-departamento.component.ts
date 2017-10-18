import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {ServicioDepartamento} from '../servicios/departamento';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Departamento} from '../modelos/departamento';

@Component({
  selector: 'app-admin-departamento',
  templateUrl: './admin-departamento.component.html',
  styleUrls: ['./admin-departamento.component.css'],
  providers: [ServicioDepartamento]
})
export class AdminDepartamentoComponent implements OnInit {

  public departamento: Departamento;
  nombre= '';
  public departamentos = [];
  nombreExist: boolean;
  mostralModal: boolean;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servDepartamento: ServicioDepartamento
  ) {
    this.mostralModal = false;
    this.departamento= new Departamento('','','','');
   }

  ngOnInit() {
    this.obtenerDepartamentos();
  }

  agregarDepartamento(){
    this._servDepartamento.registrarDepartamento(this.departamento).subscribe(
      response => {
        
        let departamento = response.departamento;
       
        if (!response.departamento._id) {    
          alert('Error al registrar la Sala');
        } else {
          alert('Sala registrado exitosamente');
          this.departamento= new departamento('','','','');
        
          console.log(departamento);
          
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Departamento no registrado');
          //console.log(error);
        }
      }
    );  
  }

  validarDepartamento(){
    this._servDepartamento.validarDepartamento(this.departamento).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let departamento = response.message;
          this.nombre = departamento;
          this.nombreExist = true;
        } else {
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

  obtenerDepartamentos(){

  }

}
