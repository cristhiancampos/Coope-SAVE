import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ServicioUsuario } from '../servicios/usuario';
import { ServicioDepartamento} from '../servicios/departamento';
import { Usuario } from '../modelos/usuario';
import swal from 'sweetalert2'


@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css'],
  providers: [ServicioUsuario, ServicioDepartamento]
})
export class ModificarUsuarioComponent implements OnInit {
  mmostrar = false;
  public usuarioContrasena: Usuario;
  public usuarioEdit: Usuario;
  public userExistEdit: boolean;
  public correoExist: boolean;
  public confirmaContra;
  
  public confirmaContraExist: boolean;
  public validarContrasena;
  public token;
  public isMacthPass =false;
  public mensajeMacthPass='';
  public estadoMensajEdit: String;
  public tempUserRol;
  public identity;
  public departamentos = [];
  public departamentoUsuarioModificiar;

  codigo=''; //process.env["USERPROFILE"];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servDepa: ServicioDepartamento,
  )
     {

    this.usuarioEdit= new Usuario('','','','','','','','','','');
    this.usuarioContrasena= new Usuario('','','','','','','','','','');
    this.confirmaContra = '';
    this.validarContrasena= '';
    this.userExistEdit = false;
    this.confirmaContraExist= false;
    

   }


   public date = new Date();
   public year = this.date.getFullYear();
   
  
  ngOnInit() {
    this.verificarCredenciales();
    this.obtenerUsuario();
    this.obtenerDepartamentos();
    
  }
  nombreDepartamento(){
   
    for (var index = 0; index < this.departamentos.length; index++) {
      if (this.departamentos[index]._id == this.usuarioEdit.departamento ) {
    
        this.departamentoUsuarioModificiar= this.departamentos[index].nombre;
        
        break;
      }
      
    }
   
  }

  obtenerId_Dep(nombreDep: any) {
   
    for (var index = 0; index < this.departamentos.length; index++) {
      if (this.departamentos[index].nombre == nombreDep) {
        return this.departamentos[index]._id;

      }

    }
    return "";
  }

  modificarPerfil() {

      this.usuarioEdit.departamento = this.obtenerId_Dep(this.departamentoUsuarioModificiar);
      let identity = localStorage.getItem('identity');
      let user = JSON.parse(identity);
      this._servUsuario.modificarPerfil(this.usuarioEdit).subscribe(
        response => {
          
          if (!response.message[0]._id) {
            this.msjError("El Usuario no pudo ser modificado");
          } else {
            this.msjExitoso("Usuario modificado exitosamente");
            console.log(response.message);
            //this._router.navigate(['/principal']);

            // localStorage.removeItem('identity');
            console.log('usuario que devuelve');
            console.log(response.message);
            localStorage.setItem('identity',JSON.stringify(response.message));
            
            let identity = localStorage.getItem('identity');
            let user = JSON.parse(identity);
            console.log(user);
            // if (user != null) {
            //   $('#nav-user').text(user[0].nombre + ' ' + user[0].apellidos);
              
            // } else {
            //   $('#nav-user').text('');
            // }
        
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
  modificarUsuario() {

        this._servUsuario.modificarUsuario(this.usuarioEdit).subscribe(
          response => {
            console.log(response.message)
           
            if (!response.message._id) {
              this.msjError("El Usuario no pudo ser Modificado");
            } else {
              this.msjExitoso("Usuario Modificado Exitosamente");
              console.log(response.message);
              localStorage.removeItem('identity');
              localStorage.setItem('identity',JSON.stringify(response.message));
              
              this.verificarCredenciales();
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
                    } else {
                      $('#nav-user').text('');
                      this._router.navigate(['/principal']);
                    }
                  }
                }, error => {
                  $('#nav-user').text(' ');
                  this._router.navigate(['/principal']);
                }
              );
            }
          }, error => {
            $('#nav-user').text(' ');
            this._router.navigate(['/principal']);
          }
          );
        } else {
          $('#nav-user').text(' ');
          this._router.navigate(['/principal']);
          //this.abrirModal('#loginModal');
        }
      }


      modificarUsuarioCompleto() {
        this._servUsuario.modificarUsuarioCompleto(this.usuarioEdit).subscribe(
          response => {

            if (!response.message._id) {
              this.msjError("El Usuario no pudo ser modificado");
            } else {
              this.msjExitoso("Usuario Modificado exitosamente");
              //this.obtenerUsuario();
              //localStorage.setItem('identity', response.message);
              //let identity = localStorage.getItem('identity');
              //let user = JSON.parse(identity);
              // if (user != null) {
              //   $('#nav-user').text(user.nombre + ' ' + user.apellidos);
              // }
              this.logout();
              this._router.navigate(['/principal']);
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
  
      logout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('remember');
        localStorage.clear();
       
        // this.abrirModal('#loginModal');
      }    
  verificarContrasenas(event: any){
    
    if(this.usuarioEdit.contrasena.trim()!=this.confirmaContra.trim()){
      $('#confirmPass').css("border-left", "5px solid #a94442");
      this.isMacthPass = false;
      this.mensajeMacthPass='Las contraseñas no coinciden';
    }else{
      $('#confirmPass').css("border-left", "5px solid #42A948");
      this.isMacthPass = true;
      this.mensajeMacthPass='';
    }
  }

  contrasenaActual(event: any){
    
    this.usuarioContrasena._id= this.usuarioEdit._id;
    this.usuarioContrasena.contrasena= this.validarContrasena;
    this._servUsuario.validarContrasena(this.usuarioContrasena).subscribe(
      response => {
        if (!response.message) {
          this.confirmaContraExist=false;
        } else {
          this.confirmaContraExist= true;
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError('El usuario no se pudo modificar');

        }
      }
    );
  }

  obtenerUsuario() {

    let identity = localStorage.getItem('identity');
    let user = JSON.parse(identity);
    if (user != null) {
      this.identity = user;
      this._servUsuario.obtenerUsuario(this.identity._id).subscribe(
        response => {
          if (response.message[0]._id) {
            this.usuarioEdit._id = response.message[0]._id;
            this.usuarioEdit.nombre = response.message[0].nombre;
            this.usuarioEdit.correo = response.message[0].correo;
            this.usuarioEdit.apellidos = response.message[0].apellidos;
            this.usuarioEdit.departamento = response.message[0].departamento;         
            this.estadoMensajEdit = this.usuarioEdit.estado;
           
          } else {//No se ha encontrado la Sala
          }
        }, error => {
          var errorMensaje = <any>error;
          if (errorMensaje != null) {
            var body = JSON.parse(error._body);
          }
        }
      );
    } else{// mensaje de error}
  }
  }

  obtenerDepartamentos() {
    this._servDepa.obtenerDepartamentos().subscribe(
      response => {
        if (response.message) {
          this.departamentos = response.message;
          this.nombreDepartamento();
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
  eliminarUsuario() {
    this._servUsuario.eliminarUsuario(this.usuarioEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Usuario no pudo ser Eliminado");
        } else {
          this.msjExitoso("Usuario Eliminado Exitosamente");
          this.usuarioEdit = new Usuario('', '', '', '', '', '', '', '', '', '');
          
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



  validarModificacion() {
    let correo = this.usuarioEdit.correo.trim();
    this.usuarioEdit.correo = correo;
    this._servUsuario.validarModificacion(this.usuarioEdit).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.userExistEdit = true;
          $('#input-correo-admin-edit').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-correo-admin-edit').css("border-left", "5px solid #42A948");
          this.userExistEdit = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
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

  

}
