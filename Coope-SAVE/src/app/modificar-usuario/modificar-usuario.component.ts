import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';
import swal from 'sweetalert2'


@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css'],
  providers: [ServicioUsuario]
})
export class ModificarUsuarioComponent implements OnInit {
  mmostrar = false;
  public usuario: Usuario;
  public usuarioEdit: Usuario;
  public userExistEdit: boolean;
  public correoExist: boolean;
  public confirmaContra;
  public isMacthPass =false;
  public mensajeMacthPass='';
  public estadoMensajEdit: String;
  public tempUserRol;

  codigo=''; //process.env["USERPROFILE"];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario)
     {

    this.usuarioEdit= new Usuario('','','','','','','','','','');
    this.usuario= new Usuario('','','','','','','','','','');
    this.confirmaContra = '';
    this.userExistEdit = false;

   }


   public date = new Date();
   public year = this.date.getFullYear();
   
  
  ngOnInit() {
    //obtenerUsuario();
    console.log('modificar usuario.ts cargado ...FECHA' + this.date + '.....año' + this.year);
  }

  modificarUsuario() {
    
        this.usuarioEdit.estado = this.estadoMensajEdit;
        this._servUsuario.modificarUsuario(this.usuarioEdit).subscribe(
          response => {
    
            if (!response.message._id) {
              this.msjError("El Usuario no pudo ser Modificado");
            } else {
              this.usuarioEdit = new   Usuario('', '', '', '', '', '', '', '', '', '');
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

  obtenerUsuario(_id: any) {
    this._servUsuario.obtenerUsuario(_id).subscribe(
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
console.log(this.usuarioEdit.correo);
    this._servUsuario.validarModificacion(this.usuarioEdit).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
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
