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
  public usuarioEdit: Usuario;
  public usuarios = [];
  usuarioExist: boolean;
  mostrarModal: boolean;
  public estadoMensajEdit:String;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario
  ) {
    this.mostrarModal= false;
    this.usuario = new Usuario('','','','','','','','','','');
    this.usuarioEdit = new Usuario('','','','','','','','','','');
   }

  ngOnInit() {
    this.obtenerUsuarios();
  }


  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.usuarioEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.usuarioEdit.estado = this.estadoMensaje;
    }
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
  obtenerUsuario(_id: any) {
    this._servUsuario.obtenerUsuario(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.usuarioEdit._id = response.message[0]._id;
          this.usuarioEdit.nombre = response.message[0].nombre;
          this.usuarioEdit.correo = response.message[0].correo;
          this.usuarioEdit.apellidos = response.message[0].apellidos;
          this.usuarioEdit.rol = response.message[0].rol;
          this.usuarioEdit.departamento = response.message[0].departamento;
          this.usuarioEdit.estado = response.message[0].estado;

          this.estadoMensajEdit = this.usuarioEdit.estado;
          if (this.usuarioEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//No se ha encontrado la Sala
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  eliminarSala() {
    this._servUsuario.eliminarUsuario(this.usuarioEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          alert('Error al eliminar el usuario');
        } else {
          alert('Sala eliminada exitosamente');
          this.usuarioEdit = new Usuario('','','','','','','','','','');
          this.obtenerUsuarios();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Sala no eliminada');
        }
      }
    );
  }



}
