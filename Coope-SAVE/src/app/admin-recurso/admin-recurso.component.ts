import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioRecursos } from '../servicios/recurso';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Recurso } from '../modelos/recursos';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';
@Component({
  selector: 'app-admin-recurso',
  templateUrl: './admin-recurso.component.html',
  styleUrls: ['./admin-recurso.component.css'],
  providers: [ServicioRecursos]
})
export class AdminRecursoComponent implements OnInit {

  public recurso: Recurso;
  public recursoEdit: Recurso;
  public token;
  public identity;
  codRecursosExist: boolean;
  public recursos = [];
  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servRecurso: ServicioRecursos
  ) {
    this.recurso = new Recurso('', '', '', '', this.estadoMensaje, '','','');
    this.recursoEdit = new Recurso('', '', '', '', '', '','','');
  }

  ngOnInit() {
   this.verificarCredenciales();
  }

  verificarCredenciales() {
    this.identity = this._servUsuario.getIndentity();
    this.token = this._servUsuario.getToken();
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    let recordar = localStorage.getItem('remember');
    let recordarValue = JSON.parse(recordar);
    if (user != null) {
      let usuarioTemp = new Usuario('', '', '', '', '', '', '', '', '', '');
      usuarioTemp.correo = user.correo;
      usuarioTemp.contrasena = user.contrasena;
      // obtener datos de usuario identificado
      this._servUsuario.verificarCredenciales(usuarioTemp).subscribe(response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          $('#nav-user').text(' ');
          this.abrirModal('#loginModal');
        } else {
          //conseguir el token para enviarselo a cada petición
          this._servUsuario.verificarCredenciales(usuarioTemp, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0) {
                $('#nav-user').text(' ');
                this.abrirModal('#loginModal');
              } else {
                // crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                if (user != null) {
                  $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                  this.obtenerRecursos();
                } else {
                  $('#nav-user').text('');
                }
              }
            }, error => {
              $('#nav-user').text(' ');
              this.abrirModal('#loginModal');
            }
          );
        }
      }, error => {
        $('#nav-user').text(' ');
        this.abrirModal('#loginModal');
      }
      );
    } else {
      $('#nav-user').text(' ');
      this._router.navigate(['/principal']);
      //this.abrirModal('#loginModal');
    }
  }
  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.recurso.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.recurso.estado = this.estadoMensaje;
    }
  }

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.recursoEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.recursoEdit.estado = this.estadoMensaje;
    }
  }

  agregarRecurso() {
    let codigoActivo = this.recurso.codigoActivo.trim().toUpperCase();
    this.recurso.codigoActivo = codigoActivo;
    this._servRecurso.registrarRecurso(this.recurso).subscribe(
      response => {
        let recurso = response.message;
        if (!response.message) {
          this.msjError("El recurso no pudo ser agregado");
        } else {
          this.recurso = new Recurso('', '', '', '', this.estadoMensaje, '','','');
          this.cerrarModal("#modalAdminRecurso");
          this.msjExitoso("Recurso Agregado Exitosamente");
          this.obtenerRecursos();
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
    let codigoActivo = this.recurso.codigoActivo.trim().toUpperCase();
    this.recurso.codigoActivo = codigoActivo;
    this._servRecurso.validarRecurso(this.recurso).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.codRecursosExist = true;
          $('#input-codigo').css("border-left", "5px solid #a94442");
        } else {//no existe el recurso
          $('#input-codigo').css("border-left", "5px solid #42A948");
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

  obtenerRecursos() {
    this._servRecurso.obtenerRecursos().subscribe(
      response => {
        if (response.message) {
          this.recursos = response.message;
        } else {//no hay recursos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerRecurso(_id: any) {
    this._servRecurso.obtenerRecurso(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.recursoEdit._id = response.message[0]._id;
          this.recursoEdit.nombre = response.message[0].nombre;
          this.recursoEdit.codigoActivo = response.message[0].codigoActivo;
          this.recursoEdit.descripcion = response.message[0].descripcion;
          this.recursoEdit.estado = response.message[0].estado;
          this.recursoEdit.reporte = response.message[0].reporte;

          this.estadoMensajEdit = this.recursoEdit.estado;
          if (this.recursoEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//no se encontró el recurso
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }
  onfocusRecurso() {
    // this.codRecursosExist= false;
  }
  modificarRecurso() { 
    this.recursoEdit.estado = this.estadoMensajEdit;
    this._servRecurso.modificarRecurso(this.recursoEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El recurso no pudo ser Mofificado");
        } else {
          this.recursoEdit = new Recurso('', '', '', '', '', '-', '', '');
          this.obtenerRecursos();
          this.cerrarModal('#modalAdminRecursoEdit');
          this.msjExitoso("Recurso Modificado Exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('Sala no se pudo modificar');

        }
      }
    );
  }
  
  eliminarRecurso(){
    this._servRecurso.eliminarRecurso(this.recursoEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El recurso no pudo ser Eliminado");
        } else {
          this.msjExitoso("Recurso eliminado Exitosamente");
          this.recursoEdit = new Recurso('', '', '', '', '', '-','','');
          this.obtenerRecursos();
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

  validarModificacion() {
    let placa = this.recursoEdit.codigoActivo.trim().toUpperCase();
    this.recursoEdit.codigoActivo = placa;

    this._servRecurso.validarModificacion(this.recursoEdit).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let sala = response.message;
          this.codRecursosExist = true;
          $('#input-cod-edit').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-cod-edit').css("border-left", "5px solid #42A948");
          this.codRecursosExist = false;
        }
      }, error => {
        console.log('error');
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
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
