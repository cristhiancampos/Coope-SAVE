import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioDepartamento } from '../servicios/departamento';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Departamento } from '../modelos/departamento';

@Component({
  selector: 'app-admin-departamento',
  templateUrl: './admin-departamento.component.html',
  styleUrls: ['./admin-departamento.component.css'],
  providers: [ServicioDepartamento]
})
export class AdminDepartamentoComponent implements OnInit {

  public departamento: Departamento;
 // nombre = '';
  public departamentos = [];
  nombreExist: boolean;
  mostralModal: boolean;
  public estado = true;
  public estadoMensaje = 'Habilitado';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servDepartamento: ServicioDepartamento
  ) {
    this.mostralModal = false;
    this.departamento = new Departamento('', '', '', this.estadoMensaje);
  }

  ngOnInit() {
    this.obtenerDepartamentos();
  }

  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.departamento.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.departamento.estado = this.estadoMensaje;
    }
  }

  agregarDepartamento() {
    let nombre = this.departamento.nombre.trim().toUpperCase();
    this.departamento.nombre=nombre;
    this._servDepartamento.registrarDepartamento(this.departamento).subscribe(
      response => {
        if (!response.message._id) {
          alert('Error al registrar la departamento');
        } else {
          alert('Departamento registrado exitosamente');
          this.mostrar(false);
          // this.estadoMensaje= 'Habilitado';
          this.departamento = new Departamento('', '', '', this.estadoMensaje);
          this.obtenerDepartamentos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Departamento no registrado');
        }
      }
    );
  }

  validarDepartamento() {
    let nombre = this.departamento.nombre.trim().toUpperCase();
    this.departamento.nombre=nombre;
    this._servDepartamento.validarDepartamento(this.departamento).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let departamento = response.message;
          //this.nombre = departamento;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {
          console.log('no existe sala');
          console.log(response.message);
          //this.nombre = null;
          this.nombreExist = false;
          $('#input-nombre').css("border-left", "5px solid #42A948");
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerDepartamentos() {
    this._servDepartamento.obtenerDepartamento().subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
        this.departamentos =response.message;
        } else {
          console.log('ho hay departamentos registrados');
          console.log(response.message);
        }
      }, error => {
        var errorMensaje = <any>error;
        console.log('Error al tratar de obtener los departamentos');
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }
  mostrar(opcion:boolean) {
    if(!opcion){
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('#modalAdminDepa').removeClass('show');
    $('#modalAdminDepa').css('display', 'none');
    
   
    }else{
      $('body').append('<div class="modal-backdrop fade show" ></div>');
      $('body').addClass('modal-open');
      $('#modalAdminDepa').addClass('show');
      $('#modalAdminDepa').css('display', 'block');
    }
    
  }

}
