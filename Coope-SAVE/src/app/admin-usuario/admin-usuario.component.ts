import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import { ServicioUsuario } from '../servicios/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from '../modelos/usuario';
import { ServicioDepartamento } from '../servicios/departamento';
import swal from 'sweetalert2';

import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-admin-usuario',
  templateUrl: './admin-usuario.component.html',
  styleUrls: ['./admin-usuario.component.css'],
  providers: [ServicioUsuario, ServicioDepartamento]
})
export class AdminUsuarioComponent implements OnInit {
  @ViewChild('modalModificarUsuario') modalModificarUsuario: TemplateRef<any>;
  @ViewChild('modalAgregarUsuario') modalAgregarUsuario: TemplateRef<any>;
  public mr: NgbModalRef;

  public usuario: Usuario;
  public usuarioEdit: Usuario;
  public usuarioAgregar: Usuario;
  public usuarios = [];
  public usuarioExist: boolean;
  public mostrarModal: boolean;
  public estadoMensajEdit: String;
  public estadoMensajAgregar: String;
  public estadoEdicion: boolean;
  public estadoEdicionAgregar: Boolean;
  public estadoMensaje = 'Habilitado';
  public currentUser = "";
  public identity: any;;
  public token;
  public correo;
  public dominio;
  public dominioCoope;
  public verError;
  public tempUserRol;
  public departamentos = [];
  public userExist: boolean;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servDepa: ServicioDepartamento,
    private modal: NgbModal

  ) {
    this.mostrarModal = false;
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '');
    this.usuarioEdit = new Usuario('', '', '', '', '', '', '', '', '', '');
    this.usuarioAgregar = new Usuario('', '', '', '', '', '', '', '', '', '');
    this.dominio = "@coopesparta.fi.cr";
    this.estadoEdicionAgregar= true;
    this.estadoMensajAgregar= 'Habilitado';
    this.usuarioAgregar.estado= this.estadoMensajAgregar;
  }

  ngOnInit() {
    this.verificarCredenciales();
  }

  abrir(modal) {
    this.mr = this.modal.open(modal);
  }
  cerrar() {
    this.mr.close();

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
                  this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '');
                  let identity = localStorage.getItem('identity');
                  let user = JSON.parse(identity);
                  if (user != null) {
                    $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                    this.obtenerUsuarios();
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
      $('#nav-user').text(' ');
      this._router.navigate(['/principal']);
    }
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

  cambiarEstadoAgregar(event: any) {
    //alert(event.target.checked);

    this.estadoEdicionAgregar = !this.estadoEdicionAgregar;
    //console.log(this.estadoEdicionAgregar);
    if (this.estadoEdicionAgregar) {
      this.estadoMensajAgregar = 'Habilitado';
      this.usuarioAgregar.estado = this.estadoMensajAgregar;
      //console.log('88888888888888888888888888888888888888');
     // console.log(this.usuarioAgregar.estado);
    } else {
      this.estadoMensajAgregar = 'Deshabilitado';
      this.usuarioAgregar.estado = this.estadoMensajAgregar;
    //  console.log('333333333333333333333333333333333333333');
     // console.log(this.usuarioAgregar.estado)
    }
  }
  obtenerNombreDep(id_Dep: any) {
    for (var index = 0; index < this.departamentos.length; index++) {
      if (this.departamentos[index]._id == id_Dep) {
        return this.departamentos[index].nombre;
      }
    }
    return "";
  }
  obtenerId_Dep(nombreDep: any) {
    for (var index = 0; index < this.departamentos.length; index++) {
      if (this.departamentos[index].nombre == nombreDep) {
        return this.departamentos[index]._id;
      }

    }
    return "";
  }
  currentRol="";
  obtenerUsuarios() {
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this.identity = user;

      this.currentUser = user.correo.trim();
      this.currentRol=user.rol;
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

  obtenerUsuario(_id: any, accion: any) {
    this._servUsuario.obtenerUsuario(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.usuarioEdit._id = response.message[0]._id;
          this.usuarioEdit.nombre = response.message[0].nombre;
          this.usuarioEdit.correo = response.message[0].correo;
          this.usuarioEdit.apellidos = response.message[0].apellidos;
          this.usuarioEdit.rol = response.message[0].rol;
          this.usuarioEdit.departamento = this.obtenerNombreDep(response.message[0].departamento);
          this.usuarioEdit.estado = response.message[0].estado;
          this.tempUserRol = response.message[0].rol;
          this.estadoMensajEdit = this.usuarioEdit.estado;
          if (this.usuarioEdit.estado === 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
          if (accion == 1) { this.mr = this.modal.open(this.modalModificarUsuario); }
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
  changeAgregar(event: any) {
    let correoFinal = "";
    this.usuarioAgregar.correo = this.usuarioAgregar.correo.trim();
    for (let i = 0; i < this.usuarioAgregar.correo.length; i++) {
      if (this.usuarioEdit.correo.charAt(i) === " ") {
      } else {
        correoFinal += this.usuarioAgregar.correo.charAt(i);
      }
    }
    this.usuarioAgregar.correo = correoFinal;

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
   // console.log(this.usuarioEdit);
   this.usuarioEdit.estado = this.estadoMensajEdit;
    this.usuarioEdit.departamento = this.obtenerId_Dep(this.usuarioEdit.departamento)
    if (this.usuarioEdit.departamento == "") {
      this.msjError('No es posible modificar la infomación del usuario');
    } else {
      this._servUsuario.modificarUsuario(this.usuarioEdit).subscribe(
        response => {

          if (!response.message._id) {
            this.msjError("El Usuario no pudo ser modificado");
          } else {
            this.usuarioEdit = new Usuario('', '', '', '', '', '', '', '', '', '');
            this.obtenerUsuarios();
            this.cerrar();
            this.msjExitoso("Usuario modificado exitosamente");
          }
        }, error => {
          var alertMessage = <any>error;
          if (alertMessage != null) {
            this.msjError("El Usuario no pudo ser modificado");

          }
        }
      );

    }

  }


  //olcultar mensaje de existencia de usuario
  onfocusCorreo() {
    this.userExist = false;
    this.verError = false;
  }
  validarCorreo() {
    let user = new Usuario('','','','','','','','','','');;
    user.correo = this.dominio;
    this._servUsuario.getCorreo(user).subscribe(
      response => {
        if (response.message) {
          let co = response.message.correo;;
          this.correo = co;
          this.userExist = true;
          $('#input-correo').css("border-left", "5px solid #a94442");
        } else {//no existe el corrreo
          $('#input-correo').css("border-left", "5px solid #42A948");;
          this.correo = null;
          this.userExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          //var body = JSON.parse(error._body);
        }
      }
    );
  }

  validarCorreoAgregar() {
    let user = new Usuario('','','','','','','','','','');;
    user.correo = this.usuarioAgregar.correo+''+this.dominio;
    console.log(user.correo);
    this._servUsuario.getCorreo(user).subscribe(
      response => {
        if (response.message) {
          let co = response.message.correo;;
          this.correo = co;
          this.userExist = true;
          $('#input-correo').css("border-left", "5px solid #a94442");
        } else {//no existe el corrreo
          $('#input-correo').css("border-left", "5px solid #42A948");;
          this.correo = null;
          this.userExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          //var body = JSON.parse(error._body);
        }
      }
    );
  }

  generatePassword() {
    var length = 8,
        charset = "!@#DEF34qrst56GHI$cdefg&*()_+}{[TUV0op1278WXYZ]\:;?><,./-=abhijklmnuvwxyzABCJKLMNOPQRS9",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

enviarContrasena(user:any) {
 // console.log(user);
  this._servUsuario.enviarContrasena(user).subscribe(
    response => {
     
      if (!response) {
        console.log('Fallo el envio de correo');
      } else {
        this.msjExitoso('La contraseña fue enviada al correo '+user.correo);
        //this.cerrar();
       // this.msInfo('Su nueva contraseña ha sido enviada via correo electrónico a '+user.correo);          
        //this._router.navigate(['/principal']);
      }
    }, error => {
      console.log('Fallo el envio de correo');
    }
  );
}//Fin del metodo EnviarEmail



  registrarUsuario() {
    let use = new Usuario('','','','','','','','','','');
    use = this.usuarioAgregar;
    use.correo+= this.dominio;
    use.contrasena= this.generatePassword();
    let temPass= use.contrasena;
    for (var index = 0; index < this.departamentos.length; index++) {
      if(use.departamento==this.departamentos[index].nombre){
        use.departamento=this.departamentos[index]._id;
        break;
      }
      
    }
    this._servUsuario.registrarUsuario(use).subscribe(
      response => {
        let user = response.user;
        if (!response.user._id) {
          
          this.msjError('Error al registrar el usuario');
        } else {
          //this._router.navigate(['/principal']);
          this.msjExitoso('Usuario registrado exitosamente');
          user.contrasena= temPass;
          this.enviarContrasena(user);
          this.cerrar();
          this.obtenerUsuarios();
          this.usuarioAgregar=new Usuario('','','','','','','','','','');
          
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          this.msjError('Error al registrar el usuario');
        }
      }
    );
  }
  // cerrarModal(modalId: any) {
  //   $(".modal-backdrop").remove();
  //   $('body').removeClass('modal-open');
  //   $(modalId).removeClass('show');
  //   $(modalId).css('display', 'none');
  // }
  // //abrir modal
  // abrirModal(modalId: any) {
  //   $('body').append('<div class="modal-backdrop fade show" ></div>');
  //   $('body').addClass('modal-open');
  //   $(modalId).addClass('show');
  //   $(modalId).css('display', 'block');
  // }

}
