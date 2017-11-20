import { Component, OnInit,ViewChild, TemplateRef  } from '@angular/core';
import * as $ from 'jquery';
import { Usuario } from '../modelos/usuario';
import { NgModel } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { ServicioDepartamento } from '../servicios/departamento';
import {NgbModalRef,NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.Component.css'],
  providers: [ServicioUsuario,ServicioDepartamento]
})
export class PrincipalComponent implements OnInit {
  @ViewChild('modalLogin') modalLogin: TemplateRef<any>;
  @ViewChild('modalRegistro') modalRegistro: TemplateRef<any>;
  @ViewChild('modalRecuperarContrasena') modalRecuperarContrasena: TemplateRef<any>;
  public mr: NgbModalRef;
  //identity = true;
  mmostrar = false;
  public usuario: Usuario;
  public usuarioRegistrado: Usuario;

  public confirmaContra;
  public mensajeAlerta;
  public correo = "";
  public userExist: boolean;
  public matchPass = false;
  public identity;
  public token;
  public mensajeError = "";
  public verError = false;
  public recordarme = false;
  public dominio;
  public isMacthPass =false;
  public mensajeMacthPass='';
  public departamentos=[];
  forgotPass='';


  //constructor del componente principal
  constructor
  (
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servDepa: ServicioDepartamento,
    private modal: NgbModal
  ) 
  {
    this.usuario = new Usuario('','','','','','','','','','');
    this.usuarioRegistrado =new  Usuario('','','','','','','','','','');
    this.confirmaContra = '';
    this.userExist = false;
    this.dominio = "@coopesparta.fi.cr";
  }

  //cambiar valor del check para recordar credenciales
  rememberChangeValue() {
    this.recordarme = !this.recordarme;
  }
  //cerrar modal
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
  //al cargarse la pagina verifica si la sesión de usuario se guardó previamente
  ngOnInit() {
    //this._router.navigate['/principal'];
    this.verificarCredenciales();
    this.obtenerDepartamentos();
  }

  abrir(modal){
    this.mr = this.modal.open(modal,{ backdrop: 'static', keyboard: false});
  }
  
  cerrar(){
    this.mr.close();
  
  }

  //olcultar mensaje de existencia de usuario
  onfocusCorreo() {
    this.userExist = false;
    this.verError = false;
  }
  //elimina los espacios de entre letras al escribir
  change(event: any) {
    let correoFinal = "";
    this.usuario.correo = this.usuario.correo.trim();
    for (let i = 0; i < this.usuario.correo.length; i++) {
      if (this.usuario.correo.charAt(i) === " ") {
      } else {
        correoFinal += this.usuario.correo.charAt(i);
      }
    }
    this.usuario.correo = correoFinal;
    this.dominio = this.usuario.correo + "@coopesparta.fi.cr";

  }
  // validar la existencia de correo de un usuario
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
  //registrar usuarios en el sistema
  registrarUsuario() {
    let use = new Usuario('','','','','','','','','','');
    use = this.usuario;
    use.correo = this.dominio;

    for (var index = 0; index < this.departamentos.length; index++) {
      if(use.departamento==this.departamentos[index].nombre){
        use.departamento=this.departamentos[index]._id;
        break;
      }
      
    }
    this._servUsuario.registrarUsuario(use).subscribe(
      response => {
        let user = response.user;
        this.usuarioRegistrado = user;
        if (!response.user._id) {
          this.mensajeAlerta = "Error al registarse";
          this.msjError('Error al registrar el usuario');
        } else {
          this._router.navigate(['/principal']);
          this.msjExitoso('Usuario registrado exitosamente');
          this.mensajeAlerta = "Usuario registrado  exitosamente";
          if (user != null) {
            $('#nav-user').text(user.nombre + ' ' + user.apellidos);
          } else {
            $('#nav-user').text(' ');
          }
          this.usuarioRegistrado = new Usuario('','','','','','','','','','');
          localStorage.setItem('identity', JSON.stringify(user));
          this.cerrar();
          this.mmostrar = true;
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          this.msjError('Error al registrar el usuario');
        }
      }
    );
  }
  //iniciar sesión en el sistema
  login() {
    // obtener datos de usuaario identificado
    this._servUsuario.loginUsuario(this.usuario).subscribe(response => {
      let identity = response.user;
      this.identity = identity;
      if (!this.identity._id) {
        this.msjError('Credenciales Incorrectas');
      } else {
        // crear elemento en el localstorage para la session de usuario//
        localStorage.setItem('identity', JSON.stringify(identity));   //JSON.stringfy(), convierte un json a string
        this._servUsuario.loginUsuario(this.usuario, 'true').subscribe(
          response => {
            let token = response.token;
            this.token = token;
            if (this.token <= 0) {
              this.msjError('Comprobación de Credenciales');
            } else {
              //   crear elemento en el localstorage para tener el token disponible
              localStorage.setItem('token', token);
              this.usuario = new Usuario('','','','','','','','','','');
              console.log(response.token);
              this.cerrar();
              this._router.navigate(['/principal']);
             // this.cerrarModal('#loginModal');
              this.mmostrar = true;
              let identity = localStorage.getItem('identity');
              let user = JSON.parse(identity);
              if (user != null) {
                this.cerrar();
                $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                if (this.recordarme) {
                  localStorage.setItem('remember', 'true');
                } else {
                  localStorage.removeItem('remember')
                }
              } else {
                $('#nav-user').text('');
              }
            }
          }, error => {
            this.mensajeError='Error de conexión';
            var errorMensaje = <any>error;

            if (errorMensaje != null) {
              var body = JSON.parse(error._body);
              this.mensajeError = body.message;
              this.verError = true;
            }
          }
        );
      }
    }, error => {
      this.mensajeError='Error de conexión';
      var errorMensaje = <any>error;
      if (errorMensaje != null) {
        var body = JSON.parse(error._body);
        this.mensajeError = body.message;
        this.verError = true;
      }
    }
    );
  }
  //verificar credenciales
  verificarCredenciales() {
    this.identity = this._servUsuario.getIndentity();
    this.token = this._servUsuario.getToken();
    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    let recordar = localStorage.getItem('remember');
    let recordarValue = JSON.parse(recordar);
    if (user != null) {
      let usuarioTemp = new Usuario('','','','','','','','','','');
      usuarioTemp.correo = user.correo;
      usuarioTemp.contrasena = user.contrasena;
      // obtener datos de usuario identificado
      this._servUsuario.verificarCredenciales(usuarioTemp).subscribe(response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          $('#nav-user').text(' ');
         // this.abrirModal('#loginModal');
         this.abrir(this.modalLogin);
          this.mmostrar = false;
        } else {
          //conseguir el token para enviarselo a cada petición
          this._servUsuario.verificarCredenciales(usuarioTemp, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
              if (this.token <= 0) {
                $('#nav-user').text(' ');
                this.abrir(this.modalLogin);
                this.mmostrar = false;
              } else {
                // crear elemento en el localstorage para tener el token disponible
                localStorage.setItem('token', token);
                this.usuario = new Usuario('','','','','','','','','','');
                this.mmostrar = true;
              //  this.cerrar();
                let identity = localStorage.getItem('identity');
                let user = JSON.parse(identity);
                if (user != null) {
                  $('#nav-user').text(user.nombre + ' ' + user.apellidos);
                  if (this.recordarme) {
                    localStorage.setItem('remember', 'true');
                  } else {
                    localStorage.removeItem('remember')
                  }
                } else {
                  $('#nav-user').text('');
                }
              }
            }, error => {
             this.mensajeError='Error de conexión'
              $('#nav-user').text(' ');
              this.abrir(this.modalLogin);
              this.mmostrar = false;
            }
          );
        }
      }, error => {
        this.mensajeError='Error de conexión';
        $('#nav-user').text(' ');
        this.abrir(this.modalLogin);
        this.mmostrar = false;
      }
      );
    } else {
      this.mensajeError='Error de conexión';
      $('#nav-user').text(' ');
      this.abrir(this.modalLogin);
      this.mmostrar = false;
    }
  }
  //mostrar el formulario de registro de usuarios
  mostrarRegistrarse() {
    this.usuario = new Usuario('','','','','','','','','','');
    this.cerrar();
    this.abrir(this.modalRegistro);
    this.mmostrar = false;

  }

  mostrarRecuperarContrasena() {
    this.forgotPass="";
   // this.usuario = new Usuario('','','','','','','','','','');
    //this.cerrarModal('#loginModal');
    this.cerrar();
   this.abrir( this.modalRecuperarContrasena);
    //this.abrirModal('#forgotModal');
    this.mmostrar = false;
    //this._router.navigate['/principal'];
  }
  regresar() {
    this.forgotPass="";
    this.cerrar();
    this.abrir(this.modalLogin);
    //this.cerrarModal('#forgotModal');
  //  this.abrirModal('#loginModal');
    this.mmostrar = false;
    //this._router.navigate['/principal'];
  }
  //regresar al formulario del login
  loginBack() {
    this.usuario = new Usuario('','','','','','','','','','');
    this.cerrar();
    this.abrir(this.modalLogin);
    this.mmostrar = false;
    this.confirmaContra = '';
  }
  verificarContrasenas(event: any){
    
    if(this.usuario.contrasena.trim()!=this.confirmaContra.trim()){
      $('#confirmPass').css("border-left", "5px solid #a94442");
      this.isMacthPass = false;
      this.mensajeMacthPass='Las contraseñas no coinciden';
    }else{
      $('#confirmPass').css("border-left", "5px solid #42A948");
      this.isMacthPass = true;
      this.mensajeMacthPass='';
    }
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

 //obtener la lista de departamentos
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

  msInfo(texto: String) {
    swal({
      title: '',
      type: 'info',
      html: texto + '',
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'OK'
    })
  }
  userExistForgot = false;
  mensajeErrorForgot="";
  validarUsuario() {
    let user = new Usuario('','','','','','','','','','');;
    user.correo = this.forgotPass.trim();
    this._servUsuario.getCorreo(user).subscribe(
      response => {
        if (response.message) {
          let co = response.message.correo;;
          this.userExistForgot=true;
          $('#input-correoF').css("border-left", "5px solid #a94442");
          user.contrasena=this.generatePassword();
          user._id=response.message._id
          alert(user.contrasena);

          this.recuperarContrasena(user);
        } else {//no existe el corrreo
          $('#input-correoF').css("border-left", "5px solid #42A948");
          this.correo = null;
          this.userExistForgot = false;
          this.mensajeErrorForgot="Correo inválido";
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          this.mensajeErrorForgot="Correo inválido";
          //var body = JSON.parse(error._body);
        }
      }
    );
  }

  generatePassword() {
    var length = 8,
        charset = "!@#DEF34qrst56GHI$%^cdefg&*()_+|}{[TUV0op1278WXYZ]\:;?><,./-=abhijklmnuvwxyzABCJKLMNOPQRS9",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

  recuperarContrasena(user:any) {
    console.log(user);

    this._servUsuario.modificarUsuarioCompleto(user).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Usuario no pudo ser Modificado");
        } else {
          this.enviarContrasena(user);
         // this.msInfo('Su nueva contraseña ha sido enviada via correo electrónico a '+user.correo);          
         // this._router.navigate(['/principal']);
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
         // var body = JSON.parse(error._body);
          //alert('El Usuario no se pudo modificar');

        }
      }
    );
  }
  enviarContrasena(user:any) {
    this._servUsuario.enviarContrasena(user).subscribe(
      response => {
        console.log('Respuesta:' + response);
        if (!response) {
          console.log('Fallo el envio de correo');
          this.msjError('Falló la recuperación de contraseña ');
        } else {
          this.msInfo('Su nueva contraseña ha sido enviada via correo electrónico a '+user.correo);          
          this._router.navigate(['/principal']);
        }
      }, error => {
        console.log('Fallo el envio de correo');
      }
    );
  }//Fin del metodo EnviarEmail

  
 /* validarcontra(event: any) {
    if (this.usuario.contrasena) {
      if (this.usuario.contrasena.length < 8) {
        //alert('la contraseña debe ser mayor a 7 c');
        this.isValidPass = false;
      } else if (this.usuario.contrasena.length > 16) {
        // alert('la contraseña debe ser menor a 17 c');
        this.isValidPass = false;
      } else if (!this.tieneNumero(this.usuario.contrasena)) {
        this.isValidPass = false;
        //alert('la contraseña debe tener numeros');
      } else if (!this.tieneMayuscula(this.usuario.contrasena)) {
        this.isValidPass = false;
        //alert('la contraseña debe tener mayusculas');
      } else if (!this.tieneMinuscula(this.usuario.contrasena)) {
        this.isValidPass = false;
        //alert('la contraseña debe tener mi');
      }
      //else if (!this.tieneCaracEspecial(this.usuario.contrasena)) {
      //   this.isValidPass= false;
      //   //alert('la contraseña debe tener caracteres especiales');
      // }
      else {
        this.isValidPass = true;
        alert('contraseña correcta');
      }
    }
  }

  /*
  tieneMayuscula(texto) {
    var patron = /[A-Z]/g;
    if (this.usuario.contrasena.match(patron)) {
      return true;
    }
    return false;
  }

  tieneMinuscula(texto) {
    var patron = /[a-z]/g;
    if (this.usuario.contrasena.match(patron)) {
      return true;
    }
    return false;
  }
  tieneCaracEspecial(texto) {
    var patron = /^[.-_?@*+{}|$&#/()=¿,]/;
    if (this.usuario.contrasena.match(patron)) {
      return true;
    }
    return true;
  }

  tieneNumero(texto) {
    let numeros = "0123456789";
    for (let i = 0; i < texto.length; i++) {
      if (numeros.indexOf(texto.charAt(i), 0) != -1) {
        return true;
      }
    }
    return false;
  }

  validarContrasena() {
    if (this.usuario.contrasena && this.confirmaContra) {

      if (this.usuario.contrasena == this.confirmaContra) {
        alert('son iguales' + this.usuario.contrasena.length);
      } else {
        alert('no');
      }
    }
  }*/

  // localStorage.setItem('token',token);
  // localStorage.removeItem('identity');//remover item del localStorage
  // localStorage.removeItem('token');
  // localStorage.clear();

}

