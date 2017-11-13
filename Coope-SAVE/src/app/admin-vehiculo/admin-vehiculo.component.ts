import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ServicioVehiculo } from '../servicios/vehiculo';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Vehiculo } from '../modelos/vehiculo';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';
@Component({
  selector: 'app-admin-vehiculo',
  templateUrl: './admin-vehiculo.component.html',
  styleUrls: ['./admin-vehiculo.component.css'],
  providers: [ServicioVehiculo]


})
export class AdminVehiculoComponent implements OnInit {

  public vehiculoEdit: Vehiculo;
  public vehiculo: Vehiculo;
  placaExist: boolean;
  placaExistEdit: boolean;
  placa = '';
  public token;
  public identity;
  public vehiculos = [];
  public estado = true;
  public estadoEdicion: boolean;
  public estadoMensaje = 'Habilitado';
  public estadoMensajEdit = '';
  disabledLun=true;
  disabledMar=true;
  disabledMie=true;
  disabledJue=true;
  disabledVie=true;
  disabledSab=true;
  disabledDom=true;
  tempHorario= {dia:'',desde:'',hasta:''};
  tempHorarios=[
    {dia:'Lunes',desde:'',hasta:''},
    {dia:'Martes',desde:'',hasta:''},
    {dia:'Miercoles',desde:'',hasta:''},
    {dia:'Jueves',desde:'',hasta:''},
    {dia:'Viernes',desde:'',hasta:''},
    {dia:'Sabado',desde:'',hasta:''},
    {dia:'Domingo',desde:'null',hasta:'null'}
  ];
 


  //public existe=true;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servVehiculo: ServicioVehiculo
  ) {
    this.vehiculoEdit = new Vehiculo('', '', '', '', '', '','', '',this.tempHorarios,'','');
    this.vehiculo = new Vehiculo('', '', '', '', '', '', this.estadoMensaje, '-','','','');
  }

  ngOnInit() {
    this.verificarCredenciales();
  }
  
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
                  this.obtenerVehiculos();
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
      this.vehiculo.estado = this.estadoMensaje;
    } else {
      this.estadoMensaje = 'Deshabilitado';
      this.vehiculo.estado = this.estadoMensaje;
    }
  }

  cambiarEstadoEdicion(event: any) {
    //alert(event.target.checked);
    this.estadoEdicion = !this.estadoEdicion;
    if (this.estadoEdicion) {
      this.estadoMensajEdit = 'Habilitado';
      this.vehiculoEdit.estado = this.estadoMensaje;
    } else {
      this.estadoMensajEdit = 'Deshabilitado';
      this.vehiculoEdit.estado = this.estadoMensaje;
    }
  }

  agregarVehiculo() {
    let placa = this.vehiculo.placa.trim().toUpperCase();
    this.vehiculo.placa = placa;
    this._servVehiculo.registrarVehiculo(this.vehiculo).subscribe(
      response => {

        let vehiculo = response.vehiculo;

        if (!response.vehiculo.placa) {
          this.msjError("El Vehiculo no pudo ser agregado");
        } else {
          this.msjExitoso("Vehiculo Agregado Exitosamente");
          this.vehiculo = new Vehiculo('', '', '', '', '', '', this.estadoMensaje, '-',[],'','');
          this.cerrarModal("#modalAdminVehiculo")
          this.obtenerVehiculos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
         
          this.msjError("El Vehiculo no pudo ser agregado");
          
        }
      }
    );
  }

  validarVehiculo() {
    let placa = this.vehiculo.placa.trim().toUpperCase();
    this.vehiculo.placa = placa;
    this._servVehiculo.validarVehiculo(this.vehiculo).subscribe(
      response => {
        if (response.message) {//vehículo existe
          let carro = response.message;
          this.placa = carro;
          this.placaExist = true;
          $('#input-placa').css("border-left", "5px solid #a94442");
        } else {// el vehiculo no existe
          $('#input-placa').css("border-left", "5px solid #42A948");
          this.placa = null;
          this.placaExist = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerVehiculos() {
    this._servVehiculo.obtenerVehiculos().subscribe(
      response => {
        if (response.message) {
          this.vehiculos = response.message;
        } else {//ho hay vehiculos registrados
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  obtenerVehiculo(_id: any) {
    this._servVehiculo.obtenerVehiculo(_id).subscribe(
      response => {
        if (response.message[0]._id) {
          this.vehiculoEdit._id = response.message[0]._id;
          this.vehiculoEdit.placa = response.message[0].placa;
          this.vehiculoEdit.tipo = response.message[0].tipo;
          this.vehiculoEdit.marca = response.message[0].marca;
          this.vehiculoEdit.descripcion = response.message[0].descripcion;
          this.vehiculoEdit.kilometraje = response.message[0].kilometraje;
          this.vehiculoEdit.estado = response.message[0].estado;
          this.vehiculoEdit.reporte = response.message[0].reporte;
          this.tempHorarios= response.message[0].horario;

          this.estadoMensajEdit = this.vehiculoEdit.estado;
          if (this.vehiculoEdit.estado == 'Habilitado') {
            this.estadoEdicion = true;
          } else {
            this.estadoEdicion = false;
          }
        } else {//No se ha encontrado el Vehiculo
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  modificarVehiculo() {
    this.vehiculoEdit.estado = this.estadoMensajEdit;
    this._servVehiculo.modificarVehiculo(this.vehiculoEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Vehiculo no pudo ser Modificado");
        } else {
          this.vehiculoEdit = new Vehiculo('', '', '', '', '', '', '', '-','','','');
          this.obtenerVehiculos();
          this.cerrarModal('#modalEditVehiculo');
          this.msjExitoso("Vehiculo Modificado Exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          alert('El Vehiculo no se pudo modificar');

        }
      }
    );
   }

   validarModificacion() {
    let placa = this.vehiculoEdit.placa.trim().toUpperCase();
    this.vehiculoEdit.placa = placa;

    this._servVehiculo.validarModificacion(this.vehiculoEdit).subscribe(
      response => {
        if (response.message) {
          console.log(response.message);
          let sala = response.message;
          this.placaExistEdit = true;
          $('#input-placa-edit').css("border-left", "5px solid #a94442");
        } else {//no existe la sala
          $('#input-placa-edit').css("border-left", "5px solid #42A948");
          this.placaExistEdit = false;
        }
      }, error => {
        var errorMensaje = <any>error;

        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  eliminarVehiculo() {
    this._servVehiculo.eliminarVehiculo(this.vehiculoEdit._id).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Vehiculo no pudo ser Eliminado");
        } else {
          this.msjExitoso("Vehiculo Eliminado Exitosamente");
          this.vehiculoEdit = new Vehiculo('', '', '', '', '', '', '', '','','','');
          this.obtenerVehiculos();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("El Vehiculo no pudo ser Eliminado");
        }
      }
    );
  }

  modificarHorario() {
    console.log(this.tempHorarios);
    this.vehiculoEdit.estado = this.estadoMensajEdit;
    this.vehiculoEdit.horario= this.tempHorarios;
    this._servVehiculo.modificarHorario(this.vehiculoEdit).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El horario de la ala no pudo ser Modificado");
        } else {
          this.vehiculoEdit = new Vehiculo('', '', '', '', '', '-','', '', this.tempHorarios,'','');
          this.obtenerVehiculos();
          this.cerrarModal('#modal-AddHorario');
          this.msjExitoso("Horario de la sala modificado exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("El horario de la ala no pudo ser Modificado");

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

  abrirModal(modalId: any) {
    $('body').append('<div class="modal-backdrop fade show" ></div>');
    $('body').addClass('modal-open');
    $(modalId).addClass('show');
    $(modalId).css('display', 'block');
  }

}
