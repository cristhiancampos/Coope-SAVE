import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioSala } from '../servicios/sala';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Sala} from '../modelos/salas';

@Component({
  selector: 'app-admin-sala',
  templateUrl: './admin-sala.component.html',
  styleUrls: ['./admin-sala.component.css'],
  providers: [ServicioSala]
})
export class AdminSalaComponent implements OnInit {

public sala: Sala;
nombre= '';
public salas = [];
nombreExist: boolean;
mostrarModal: boolean;
public estado =true;
public estadoMensaje= 'Habilitado';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servSala: ServicioSala
  ) { 
    this.mostrarModal= false;
    this.sala = new Sala('','','','',this.estadoMensaje,'-');
  }

  ngOnInit() {
    this.obtenerSalas();
  }

  cambiarEstado(){
    this.estado =!this.estado;
    if(this.estado){
      this.estadoMensaje= 'Habilitado';
     this.sala.estado=this.estadoMensaje;
    }else{
      this.estadoMensaje= 'Deshabilitado';
      this.sala.estado=this.estadoMensaje;
    } 
  }

validarSala() {
    this._servSala.validarSala(this.sala).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let sala = response.message;
          this.nombre = sala;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {
          $('#input-nombre').css("border-left", "5px solid #42A948");
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


agregarSala(){
  this._servSala.registrarSala(this.sala).subscribe(
    response => {
      
      let sala = response.sala;
     
      if (!response.sala._id) {    
        alert('Error al registrar la Sala');
      } else {
        alert('Sala registrada exitosamente');
        this.sala = new Sala('','','','',this.estadoMensaje,'-');
        this.mostrar(false);
        console.log(sala);
        this.obtenerSalas();
      }
    }, error => {
      var alertMessage = <any>error;
      if (alertMessage != null) {
        var body = JSON.parse(error._body);
        alert('Sala no registrado');
        //console.log(error);
      }
    }
  );  
}


obtenerSalas() {
  this._servSala.obtenerSalas().subscribe(
    response => {
      if (response.message) {
        console.log(response.message);
      //   let carro = response.message;
      //   this.placa = carro;
      //   this.placaExist = true;
      this.salas =response.message;
      } else {
        console.log('ho hay Salas registradas');
        console.log(response.message);
        // this.placa = null;
        // this.placaExist = false;
      }
    }, error => {
      var errorMensaje = <any>error;
      console.log('Error al tratar de obtener las salas');
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
  $('#modalAdminSala').removeClass('show');
  $('#modalAdminSala').css('display', 'none');
  
 
  }else{
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $('#modalAdminSala').addClass('show');
    $('#modalAdminSala').css('display', 'block');
  }
  
}

}
