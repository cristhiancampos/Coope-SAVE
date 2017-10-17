import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioRecursos } from '../servicios/recurso';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Recurso} from '../modelos/recursos';
@Component({
  selector: 'app-admin-recurso',
  templateUrl: './admin-recurso.component.html',
  styleUrls: ['./admin-recurso.component.css'],
  providers: [ServicioRecursos]
})
export class AdminRecursoComponent implements OnInit {

  public recursos: Recurso;
  codRecursos= '';
  codRecursosExist: boolean;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servRecurso: ServicioRecursos
  ) {   
    this.recursos= new Recurso('','','','','','');
   }

  ngOnInit() {
  }

  agregarRecurso(){
    console.log(this.recursos);
    this._servRecurso.registrarRecurso(this.recursos).subscribe(
      response => {
        
        let recurso = response.recurso;
       
        if (!response.recurso.codRecursos) {    
          alert('Error al registrar la recurso');
        } else {
          alert('recurso registrado exitosamente');
          this.recursos= new recurso('','','','','','');
          
          this.cerrarModal("#modalAdminRecurso")
          console.log(recurso);
          
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('recurso no registrado');
          //console.log(error);
        }
      }
    );   
  }


validarRecurso() {

  this._servRecurso.validarRecurso(this.recursos).subscribe(
    response => {
      if (response.message) {
        console.log(response.message);
        let recurso = response.message;
        this.codRecursos = recurso;
        this.codRecursosExist = true;
      } else {
        console.log('no existe vehiculo');
        console.log(response.message);
        this.recursos = null;
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

onfocusRecurso(){
  this.codRecursosExist= false;
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
