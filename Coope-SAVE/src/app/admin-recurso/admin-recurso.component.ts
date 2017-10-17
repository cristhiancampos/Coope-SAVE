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

  public recurso: Recurso;
 // codRecursos= '';
  codRecursosExist: boolean;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servRecurso: ServicioRecursos
  ) {   
    this.recurso= new Recurso('','','','','','');
   }

  ngOnInit() {
    
  }

  agregarRecurso(){
    this._servRecurso.registrarRecurso(this.recurso).subscribe(
      response => {
        let recurso = response.message;
        if (!response.message) {    
          alert('Error al registrar la recurso');
        } else {
          console.log(response.message);
          alert('recurso registrado exitosamente');
          this.recurso= new Recurso('','','','','','');
          this.cerrarModal("#modalAdminRecurso")
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
        }
      }
    );   
  }

validarRecurso() {
  console.log('validar componete');
  console.log(this.recurso);

  this._servRecurso.validarRecurso(this.recurso).subscribe(
    response => {
      if (response.message) {
        console.log('existe recirsso');
        console.log(response.message);
        let recurso = response.message;
      //  this.codRecursos = recurso;
        this.codRecursosExist = true;
      } else {
        console.log('no existe recusrsi');
        console.log(response.message);
        this.recurso = null;
        this.codRecursosExist = false;
      }
    }, error => {
      alert('tuvo un errror');
      var errorMensaje = <any>error;
      if (errorMensaje != null) {
        var body = JSON.parse(error._body);
      }
    }
  );
}

onfocusRecurso(){
 // this.codRecursosExist= false;
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
