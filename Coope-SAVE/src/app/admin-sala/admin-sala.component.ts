import { Component,OnInit,ViewChild, TemplateRef } from '@angular/core';
import * as $ from 'jquery';
import { ServicioSala } from '../servicios/sala';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Sala } from '../modelos/salas';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';

import {NgbModalRef,NgbModal,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-admin-sala',
  templateUrl: './admin-sala.component.html',
  styleUrls: ['./admin-sala.component.css'],
  providers: [ServicioSala]
})
export class AdminSalaComponent implements OnInit {
  @ViewChild('modalAgregarSala') modalAgregarSala: TemplateRef<any>;
  @ViewChild('modalMofificarSala') modalMofificarSala: TemplateRef<any>;
  @ViewChild('modalHorarioSala') modalHorarioSala: TemplateRef<any>;
  public mr: NgbModalRef;

  public sala: Sala;
  public salaEdit: Sala;
  nombre = '';
  public salas = [];
  nombreExist: boolean;
  mostrarModal: boolean;
  nombreExistEdit: boolean;
  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';
  public token;
  public identity;
  disabledLun=true;
  disabledMar=true;
  disabledMie=true;
  disabledJue=true;
  disabledVie=true;
  disabledSab=true;
  disabledDom=true;

  tempHorarios=[
    {dia:'Lunes',desde:'',hasta:''},
    {dia:'Martes',desde:'',hasta:''},
    {dia:'Miercoles',desde:'',hasta:''},
    {dia:'Jueves',desde:'',hasta:''},
    {dia:'Viernes',desde:'',hasta:''},
    {dia:'Sabado',desde:'',hasta:''},
    {dia:'Domingo',desde:'null',hasta:'null'}
  ];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servSala: ServicioSala,
    private modal: NgbModal
  ) {
    this.mostrarModal = false;
    this.salaEdit = new Sala('', '', '', '', '', '',this.tempHorarios, '', '');
    this.sala = new Sala('', '', '', '', this.estadoMensaje, '-', this.tempHorarios,'', '');
  }

  ngOnInit() {
    this.verificarCredenciales();
    
  }
  abrir(modal){
    
    this.mr = this.modal.open(modal);
  
  }
  cerrar(){
    this.mr.close();
  
  }
  // changeRecursos(event: any, _id: any) {
  //   if (event.target.checked) {
  //     this.tempRecursos.push(_id);
  //   } else {
  //     this.tempRecursos = this.tempRecursos.filter(item => item !== _id);
  //   }
  // }
  tempHorario= {dia:'',desde:'',hasta:''};

  changeHorario(event:any,dia:String){
    if(dia=="Lunes"){
      if (event.target.checked) {
        this.disabledLun=!this.disabledLun;
      } else {
        this.disabledLun=!this.disabledLun;
      }
    }else if(dia=="Martes"){
      if (event.target.checked) {
        this.disabledMar=!this.disabledMar;
      } else {
        this.disabledMar=!this.disabledMar;
      }
    }else if(dia=="Miercoles"){
      if (event.target.checked) {
        this.disabledMie=!this.disabledMie;
      } else {
        this.disabledMie=!this.disabledMie;
      }
     }
     else if(dia=="Jueves"){
      if (event.target.checked) {
        this.disabledJue=!this.disabledJue;
      } else {
        this.disabledJue=!this.disabledJue;
      }
    }
    else if(dia=="Viernes"){
      if (event.target.checked) {
        this.disabledVie=!this.disabledVie;
      } else {
        this.disabledVie=!this.disabledVie;
      }
    }
    else if(dia=="Sabado"){
      if (event.target.checked) {
        this.disabledSab=!this.disabledSab;
      } else {
        this.disabledSab=!this.disabledSab;
      }
    }
    else if(dia=="Domingo"){
      if (event.target.checked) {
        this.disabledDom=!this.disabledDom;
      } else {
        this.disabledDom=!this.disabledDom;
      }
    }
    console.log(this.tempHorario);
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
                  this.obtenerSalas();
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
      //this.abrirModal('#loginModal');
    }
  }
  
  cambiarEstado() {
    this.estado = !this.estado;
    if (this.estado) {
      this.estadoMensaje = 'Habilitado';
      this.sala.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.sala.estado = this.estadoMensaje;
    }
  }

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.salaEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.salaEdit.estado = this.estadoMensaje;
    }
  }

  validarSala() {
    let nombre = this.sala.nombre.trim().toUpperCase();
    this.sala.nombre = nombre;
    this._servSala.validarSala(this.sala).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.nombre = sala;
          this.nombreExist = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-nombre').css("border-left", "5px solid #42A948");
          this.nombre = null;
          this.nombreExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  agregarSala() {
    let nombre = this.sala.nombre.trim().toUpperCase();
    this.sala.nombre = nombre;
    this._servSala.registrarSala(this.sala).subscribe(
      response => {

        let sala = response.sala;

        if (!response.sala._id) {
          this.msjError("La Sala no pudo ser agregada");
        } else {
          this.msjExitoso("Sala agregada exitosamente");
          this.sala = new Sala('', '', '', '', this.estadoMensaje, '-',[], '', '');
          this.cerrar();
         // this.mostrar(false);
          this.obtenerSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          this.msjError("La Sala no pudo ser agregada");
        }
      }
    );
  }


  obtenerSalas() {
    this._servSala.obtenerSalas().subscribe(
      response => {
        if (response.message) {
          this.salas = response.message;
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
      }
    );
  }


  obtenerSala(_id: any,accion:any) {
    this._servSala.obtenerSala(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.salaEdit._id = response.message[0]._id;
          this.salaEdit.nombre = response.message[0].nombre;
          this.salaEdit.cupo = response.message[0].cupo;
          this.salaEdit.descripcion = response.message[0].descripcion;
          this.salaEdit.estado = response.message[0].estado;
          this.salaEdit.reporte = response.message[0].reporte;
          this.salaEdit.reporte = response.message[0].reporte;
          this.tempHorarios = response.message[0].horario;

          this.estadoMensajEdit = this.salaEdit.estado;
          if (this.salaEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }

          if(accion==1){this.mr = this.modal.open(this.modalMofificarSala);}
          if(accion==3){this.mr = this.modal.open(this.modalHorarioSala);}
        } else {//No se ha encontrado la Sala
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
         // var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarSala() {
    this.salaEdit.estado = this.estadoMensajEdit;
    this._servSala.modificarSala(this.salaEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Sala no pudo ser modificada");
        } else {
          this.salaEdit = new Sala('', '', '', '', '', '-', this.tempHorarios,'', '');
          this.obtenerSalas();
          this.cerrar();
          this.msjExitoso("Sala modificada exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Sala no pudo ser modificada");

        }
      }
    );

  }

  modificarHorario() {
    console.log(this.tempHorarios);
    this.salaEdit.estado = this.estadoMensajEdit;
    this.salaEdit.horario= this.tempHorarios;
    this._servSala.modificarHorario(this.salaEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El horario de la  salano pudo ser modificado");
        } else {
          this.salaEdit = new Sala('', '', '', '', '', '-',this.tempHorarios, '', '');
          this.obtenerSalas();
          this.cerrar();
          this.msjExitoso("Horario de la sala modificado exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          this.msjError("El horario de la  sala no pudo ser nodificado");

        }
      }
    );

  }

  eliminarSala() {
    this._servSala.eliminarSala(this.salaEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Sala no pudo ser Eliminada");
        } else {
          this.msjExitoso("Sala eliminada exitosamente");
          this.salaEdit = new Sala('', '', '', '', '', '', this.tempHorarios,'', '');
          this.obtenerSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          this.msjError("La Sala no pudo ser eliminada");
        }
      }
    );
  }

  validarModificacion() {
    let nombre = this.salaEdit.nombre.trim().toUpperCase();
    this.salaEdit.nombre = nombre;

    this._servSala.validarModificacion(this.salaEdit).subscribe(
      response => {
        if (response.message) {
          let sala = response.message;
          this.nombreExistEdit = true;
          $('#input-nombre').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-nombre').css("border-left", "5px solid #42A948");
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

  // mostrar(opcion: boolean) {
  //   if (!opcion) {
  //     $(".modal-backdrop").remove();
  //     $('body').removeClass('modal-open');
  //     $('#modalAdminSala').removeClass('show');
  //     $('#modalAdminSala').css('display', 'none');
  //   } else {
  //     $('body').append('<div class="modal-backdrop fade show" ></div>');
  //     $('body').addClass('modal-open');
  //     $('#modalAdminSala').addClass('show');
  //     $('#modalAdminSala').css('display', 'block');
  //   }

  // }

}




