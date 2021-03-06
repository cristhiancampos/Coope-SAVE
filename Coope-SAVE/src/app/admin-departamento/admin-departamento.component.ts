import { Component, OnInit,ViewChild, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import { ServicioDepartamento } from '../servicios/departamento';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Departamento } from '../modelos/departamento';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';

import {NgbModalRef,NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-admin-departamento',
  templateUrl: './admin-departamento.component.html',
  styleUrls: ['./admin-departamento.component.css'],
  providers: [ServicioDepartamento]
})
export class AdminDepartamentoComponent implements OnInit {
  @ViewChild('modalAgregarDepartamento') modalAgregarDepartamento: TemplateRef<any>;
  @ViewChild('modalMofificarDepartamento') modalMofificarDepartamento: TemplateRef<any>;
  public mr: NgbModalRef;

  public departamento: Departamento;
  public departamentoEdit: Departamento;
  public departamentos = [];
  public nombreExist: boolean;
  public nombreExistEdit: boolean;
  public mostralModal: boolean;
  public token;
  public identity;
  p:any;

  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';
  closeResult: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servDepartamento: ServicioDepartamento,
    private modal: NgbModal
  ) {
    this.mostralModal = false;
    this.departamentoEdit = new Departamento('', '', '', '','','');
    this.departamento = new Departamento('', '', '', this.estadoMensaje,'','');
  }
    abrir(modal){
  
  this.mr = this.modal.open(modal);

}

   cerrar(){
     this.mr.close();

   }
  ngOnInit() {
    //this.obtenerDepartamentos();
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
          this._router.navigate(['/principal']);
        } else {
          if (this.identity.rol == "ADMINISTRADOR" || this.identity.rol == "SUPERADMIN") {
            //conseguir el token para enviarselo a cada petición
            
          this._servUsuario.verificarCredenciales(usuarioTemp, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0) {
                $('#nav-user').text(' ');
                this._router.navigate(['/principal']);
              } else {
                // crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                if (user != null) {
                  $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                  this.obtenerDepartamentos();
                } else {
                  $('#nav-user').text('');
                }
              }
            }, error => {
              $('#nav-user').text(' ');
              this._router.navigate(['/principal']);
            }
          );
        } else {
          this._router.navigate(['/principal']);
        }
        }
      }, error => {
        $('#nav-user').text(' ');
        this._router.navigate(['/principal']);
      }
      );
    } else {
      this._router.navigate(['/principal']);
    }
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

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.departamentoEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.departamentoEdit.estado = this.estadoMensaje;
    }
  }

  agregarDepartamento() {
    let nombre = this.departamento.nombre.trim().toUpperCase();
    this.departamento.nombre = nombre;
    this._servDepartamento.registrarDepartamento(this.departamento).subscribe(
      response => {
        if (!response.message._id) {
          this.msjError('Error al registrar la departamento');
        } else {
         //alert('Departamento registrado exitosamente');
         this.cerrar();
          //this.cerrarModal('#modalAdminDepa');
          this.msjExitoso("Departamento agregado exitosamente");
          this.departamento = new Departamento('', '', '', this.estadoMensaje,'','');
          this.obtenerDepartamentos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("El departamento no pudo ser registrado");
        }
      }
    );
  }

  validarDepartamento() {
    let nombre = this.departamento.nombre.trim().toUpperCase();
    this.departamento.nombre = nombre;
    this._servDepartamento.validarDepartamento(this.departamento).subscribe(
      response => {
        if (response.message) {
          let departamento = response.message;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {//no existe el departamento
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
    this._servDepartamento.obtenerDepartamentos().subscribe(
      response => {
        if (response.message) {
          this.departamentos = response.message;
        } else {//ho hay departamentos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );

  }

  obtenerDepartamento(_id: any,accion:any) {
    this._servDepartamento.obtenerDepartamento(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.departamentoEdit._id = response.message[0]._id;
          this.departamentoEdit.nombre = response.message[0].nombre;
          this.departamentoEdit.color = response.message[0].color;
          this.departamentoEdit.estado = response.message[0].estado;

          this.estadoMensajEdit = this.departamentoEdit.estado;
          if (this.departamentoEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
          if(accion==1){this.mr = this.modal.open(this.modalMofificarDepartamento);}
          
        } else {//No se ha encontrado el departamento
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarDepartamento() {
    this.departamentoEdit.estado = this.estadoMensajEdit;
    this._servDepartamento.modificarDepartamento(this.departamentoEdit).subscribe(
      response => {
        if (!response.message._id) {
          this.msjError('Error al modificar el departamento');
        } else {
          this.departamentoEdit = new Departamento('', '', '', '', '', '');
          this.obtenerDepartamentos();
          this.mr.close();
          this.msjExitoso("Departamento modificado exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("El departamento no pudo ser odificado");
        }
      }
    );
   }

  
   validarModificacion() {
    let nombre = this.departamentoEdit.nombre.trim().toUpperCase();
    this.departamentoEdit.nombre = nombre;

    this._servDepartamento.validarModificacion(this.departamentoEdit).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.nombreExistEdit = true;
          $('#input-nombre-edit-dep').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-nombre-edit-dep').css("border-left", "5px solid #42A948");
          this.nombreExistEdit = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  eliminarDepartamento() {

  
    var control= true;
    
    this._servUsuario.obtenerUsuarios().subscribe(
      response => {

        if (!response.message) {
          this.msjError('No existen Usuarios en el sistema');
        } else {
          let usuarios= response.message;
          for (var index = 0; index < usuarios.length; index++) {
            if(usuarios[index].departamento == this.departamentoEdit._id){
              this.msjError('Existen usuarios asigandos a el depatamento, no se puede eliminar');
              control = false;
              break;
            }
            
          }
          if(control){
            this._servDepartamento.eliminarDepartamento(this.departamentoEdit._id).subscribe(
              response => {
        
                if (!response.message._id) {
                  this.msjError('Error al elimar el departamento');
                } else {
                 
                  this.msjExitoso("Departamento eliminado exitosamente");
                  this.departamentoEdit = new Departamento('', '', '', '','','');
                  this.obtenerDepartamentos();
                }
              }, error => {
                var alertMessage = <any>error;
                if (alertMessage != null) {
                  var body = JSON.parse(error._body);
                  this.msjError("El departamento no pudo ser eliminado");
                }
              }
            );
          } else { console.log('imposible eliminar'); }
          
        
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("Algo salio mal");
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
   });
  }

  msjError(texto: string){
   swal(
    'Oops...',
    texto,
    'error'
    );
  }

  cerrarModal(modalId: any) {
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $(modalId).removeClass('show');
    $(modalId).css('display', 'none');
  }

  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }

}
