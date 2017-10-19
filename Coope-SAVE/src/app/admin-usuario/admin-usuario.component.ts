import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioUsuario } from '../servicios/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Usuario} from '../modelos/usuario';

@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css'],
  providers: [ServicioUsuario]
})
export class AdminUsuarioComponent implements OnInit {

  public usuario: Usuario;
  public usuarios = [];
  usuarioExist: boolean;
  mostrarModal: boolean;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario
  ) {
    this.mostrarModal= false;
    this.usuario = new Usuario('','','','','','','');
   }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this._servUsuario.obtenerUsuarios().subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
        this.usuarios =response.message;
        } else {
          console.log('ho hay Usuarios registradas');
          console.log(response.message);
        }
      }, error => {
        var errorMensaje = <any>error;
        console.log('Error al tratar de obtener los Usuarios');
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }



}
