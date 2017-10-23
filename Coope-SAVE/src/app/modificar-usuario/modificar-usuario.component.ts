import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import {Usuario} from '../modelos/usuario';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit {
  mmostrar = false;
  public usuario: Usuario;

  codigo=''; //process.env["USERPROFILE"];

  constructor(private _router: Router) {
    this.usuario= new Usuario('','','','','','','');
   }


   public date = new Date();
   public year = this.date.getFullYear();
  
  ngOnInit() {
    console.log('modificar usuario.ts cargado ...FECHA' + this.date + '.....año' + this.year);
    // $('body').append('<div class="modal-backdrop fade show" ></div>');
    // $('body').addClass('modal-open');
    // $('#exampleModal').addClass('show');
    // $('#exampleModal').css('display', 'block');
  }

  mostrar() {
    // $('.modal-backdrop').remove();
    // $('body').removeClass('modal-open');
    // $('#exampleModal').removeClass('show');
    // $('#exampleModal').css('display', 'none');
    // this.mmostrar = true;
  }
  salir() {
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');
    this._router.navigate(['/principal']);
  }
  guadarCambios(){
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    $('#exampleModal').removeClass('show');
    $('#exampleModal').css('display', 'none');
    this._router.navigate(['/principal']);
  }

  modificarUusario(){
    console.log(this.usuario);
  }

}
