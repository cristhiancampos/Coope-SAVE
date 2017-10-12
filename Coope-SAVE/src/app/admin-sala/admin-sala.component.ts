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
nombreExist: boolean;
mostrarModal: boolean;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servSala: ServicioSala
  ) { 
    this.mostrarModal= false;
    this.sala = new Sala('','','','','','');
  }

  ngOnInit() {
  }

validarSala() {
    this._servSala.validarSala(this.sala).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let co = response.message;
          this.nombre = co;
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


agregarSala(){
  this._servSala.registrarSala(this.sala).subscribe(
    response => {
      
      let sala = response.sala;
     
      if (!response.sala._id) {    
        alert('Error al registrar la Sala');
      } else {
        alert('Sala registrado exitosamente');
        this.sala= new Sala('','','','','','');
        
        this.mostrar(false);
        console.log(sala);
        
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
