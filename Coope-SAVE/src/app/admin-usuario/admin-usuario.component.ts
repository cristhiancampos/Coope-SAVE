import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioUsuario } from '../servicios/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../modelos/usuario';
import { ServicioDepartamento } from '../servicios/departamento';
import swal from 'sweetalert2'

@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css'],
  providers: [ServicioUsuario, ServicioDepartamento]
})
export class AdminUsuarioComponent implements OnInit {

  public usuario: Usuario;
  public usuarioEdit: Usuario;
  public usuarios = [];
  public usuarioExist: boolean;
  public mostrarModal: boolean;
  public estadoMensajEdit: String;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public currentUser = "";
  public identity:any;
  public tempUserRol;
  public departamentos = [];
  public userExist: boolean;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servDepa: ServicioDepartamento
  ) {
    this.mostrarModal = false;
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '');
    this.usuarioEdit = new Usuario('', '', '', '', '', '', '', '', '', '');
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
      this.identity=user;

      this.currentUser = user.correo.trim();
    } else { this.currentUser = "" }

    this._servUsuario.obtenerUsuarios().subscribe(
      response => {
        if (response.message) {
          this.usuarios = response.message;
        } else {//no hay Usuarios registradas
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
    this._servDepa.obtenerDepartamentos().subscribe(
      response => {
        if (response.message) {
          this.departamentos = response.message;
        } else {//no hay departamentos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
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
          this.tempUserRol=response.message[0].rol;
          this.estadoMensajEdit = this.usuarioEdit.estado;
          if (this.usuarioEdit.estado === 'Habilitado') {
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
          this.usuarioEdit = new Usuario('', '', '', '', '', '', '', '', '', '');
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
  eliminarUsuario() {
    this._servUsuario.eliminarUsuario(this.usuarioEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Usuario no pudo ser Eliminado");
        } else {
          this.msjExitoso("Usuario Eliminado Exitosamente");
          this.usuarioEdit = new Usuario('', '', '', '', '', '', '', '', '', '');
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

  msjExitoso(texto: string) {
    swal({
      position: 'top',
      type: 'success',
      title: texto,
      showConfirmButton: false,
      timer: 2500
    })
  }

  msjError(texto: string) {
    swal(
      'Oops...',
      texto,
      'error'
    )
  }
  //elimina los espacios de entre letras al escribir
  change(event: any) {
    let correoFinal = "";
    this.usuarioEdit.correo = this.usuarioEdit.correo.trim();
    for (let i = 0; i < this.usuarioEdit.correo.length; i++) {
      if (this.usuarioEdit.correo.charAt(i) === " ") {
      } else {
        correoFinal += this.usuarioEdit.correo.charAt(i);
      }
    }
    this.usuario.correo = correoFinal;

  }

  validarModificacion() {
    let correo = this.usuarioEdit.correo.trim();
    this.usuarioEdit.correo = correo;

    this._servUsuario.validarModificacion(this.usuarioEdit).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let sala = response.message;
          this.usuarioExist = true;
          $('#input-correo-admin-edit').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-correo-admin-edit').css("border-left", "5px solid #42A948");
          this.usuarioExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarUsuario() {

    this.usuarioEdit.estado = this.estadoMensajEdit;
    this._servUsuario.modificarUsuario(this.usuarioEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Usuario no pudo ser Modificado");
        } else {
          this.usuarioEdit = new   Usuario('', '', '', '', '', '', '', '', '', '');
          this.obtenerUsuarios();
          this.cerrarModal('#editAdminUserModal');
          this.msjExitoso("Usuario Modificado Exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('El Usuario no se pudo modificar');

        }
      }
    );
  }
  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
  }


}
