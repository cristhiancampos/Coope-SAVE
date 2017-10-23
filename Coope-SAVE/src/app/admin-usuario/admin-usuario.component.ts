import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioUsuario } from '../servicios/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Usuario} from '../modelos/usuario';
import { ServicioDepartamento } from '../servicios/departamento';
import swal from 'sweetalert2'

@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css'],
  providers: [ServicioUsuario,ServicioDepartamento]
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
  public currentUser="";
  public departamentos=[];
  public userExist:boolean;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servDepa: ServicioDepartamento
  ) {
    this.mostrarModal= false;
    this.usuario = new Usuario('','','','','','','','','','');
    this.usuarioEdit = new Usuario('','','','','','','','','','');
   }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerDepartamentos();
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
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this.currentUser=user.correo.trim();
    }else{this.currentUser=""}
  
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

  obtenerDepartamentos() {
    this._servDepa.obtenerDepartamentos().subscribe(
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
          this.msjError("El Usuario no pudo ser Eliminado");
        } else {
          this.msjExitoso("Usuario Eliminado Exitosamente");
          this.usuarioEdit = new Usuario('','','','','','','','','','');
          this.obtenerUsuarios();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("El Usuario no pudo ser Eliminado");
        }
      }
    );
  }

  msjExitoso(texto: string){
    swal({
      position: 'top',
      type: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 2500
    })
  }
  
  msjError(texto: string){
    swal(
      'Oops...',
      texto,
      'error'
    )
  }
  modificarUsuario(){

  }



}
