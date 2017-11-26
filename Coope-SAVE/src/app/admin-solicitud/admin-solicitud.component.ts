import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import { ServicioSolicitudVehiculo } from '../servicios/solicitudVehiculo';
import { ServicioRecursos } from '../servicios/recurso';
import { Usuario } from '../modelos/usuario';
import { Recurso } from '../modelos/recursos';
import { SolicitudSala } from '../modelos/solicitudSala';
import { SolicitudVehiculo } from '../modelos/solicitudVehiculo';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-admin-solicitud',
  templateUrl: './admin-solicitud.component.html',
  styleUrls: ['./admin-solicitud.component.css'],
  providers: [ServicioRecursos, ServicioSolicitudSala, ServicioSolicitudVehiculo, ServicioUsuario]
})
export class AdminSolicitudComponent implements OnInit {

  private sala = true;// Boolean para controlar que tabla de solicitudes se muestre
  private token;
   identity;

  //Variables para solicitudes
  public solicitudSala: SolicitudSala;
  public solicitudSalaEdit: SolicitudSala;
  public solicitudSalaTemp: SolicitudSala;
  public solicitudVehiculoTem: SolicitudVehiculo;
  public indice = [];
  public codigosRecursosTemp = [];
  public solicitudSalas = [];
  public solicitudVehiculos = [];
  public usuariosList = [];
  public recursosList = [];
  public listaNombreRecursos = [];
  public listaNombreAcompanantes = [];
  public currenIndex;
  public idEliminar;
  public acompananteIndex;
  



  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servRecurso: ServicioRecursos,
    private _servSolicitudSala: ServicioSolicitudSala,
    private _servSolicitudVehiculo: ServicioSolicitudVehiculo
  ) {
  }

  ngOnInit() {
    this.verificarCredenciales();
    this.obtenerUsuarios();
    this.obtenerRecursos();
    this.obtenerSolicitudSalas();
    this.obtenerSolicitudVehiculo()

  }

  //********************************************************************Sección Solicitud Sala**********************************************************************//
  obtenerSolicitudSalas() {
    this._servSolicitudSala.obtenerTodasSolicitudes().subscribe(
      response => {

        if (response.message) {
          this.solicitudSalas = response.message;
          this.solicitudSalas=this.ordenarPorFecha(this.solicitudSalas);
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  ordenarSolicitudesSala(filtro:string){
    if(filtro==='Horario'){
      this.ordenarPorHorario(this.solicitudSalas);
    }
    else if(filtro==='Personas'){
     this.ordenarPorCantidadPersonas(this.solicitudSalas);
    }  else if(filtro==='Fecha'){
      this.ordenarPorFecha(this.solicitudSalas);
     } 
     else if(filtro==='Sala'){
     this.ordenarPorSala(this.solicitudSalas);
     } 
     else if(filtro==='Solicitante'){
      this.ordenarPorUsuario(this.solicitudSalas);
      } else if(filtro==='Motivo'){
        this.ordenarPorMotivo(this.solicitudSalas);
        } 
     
  }
  ordenarSolicitudesVehiculo(filtro:string){
    if(filtro==='Horario'){
      this.ordenarPorHorarioVehiculo(this.solicitudVehiculos);
    }
    else if(filtro==='Placa'){
    this.ordenarPorPlaca(this.solicitudVehiculos);
    }  else if(filtro==='Fecha'){
      this.ordenarPorFecha(this.solicitudVehiculos);
     } 
     else if(filtro==='Destino'){
    this.ordenarPorDestino(this.solicitudVehiculos);
     } 
     else if(filtro==='Solicitante'){
      this.ordenarPorUsuario(this.solicitudVehiculos);
      } else if(filtro==='Motivo'){
        this.ordenarPorMotivo(this.solicitudVehiculos);
        } 
  }
  /*Métodos Generales*/
  ordenarPorHorario(array:any){
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if (array[j].horaInicio.hour > array[j + 1].horaInicio.hour) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }
  ordenarPorHorarioVehiculo(array:any){
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if (array[j].horaSalida.hour > array[j + 1].horaSalida.hour) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }
  ordenarPorSala(array:any){
    array.sort(function(a, b){
    var keyA = a.sala,
        keyB = b.sala;
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
   });
    return array;
  }

  ordenarPorUsuario(array:any){
    array.sort(function(a, b){
      var keyA = a.usuario,
          keyB = b.usuario;
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
    return array;
  }

  ordenarPorMotivo(array:any){
    array.sort(function(a, b){
      var keyA = a.descripcion,
          keyB = b.descripcion;
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
    return array;
  }
  ordenarPorDestino(array:any){
    array.sort(function(a, b){
      var keyA = a.destino,
          keyB = b.destino;
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
      });
      return array;
    }

  ordenarPorPlaca(array:any){
    array.sort(function(a, b){
      var keyA = a.vehiculo,
          keyB = b.vehiculo;
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
    });
    return array;
  }
  ordenarPorCantidadPersonas(array:any){
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if (parseInt(array[j].cantidadPersonas) > parseInt(array[j + 1].cantidadPersonas)) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }
  ordenarPorFecha(array:any){
    let k = [];
    for (let i = 1; i < array.length; i++) {
      for (var j = 0; j < (array.length - i); j++) {
        if (((array[j].fecha.year*365) + (array[j].fecha.month*30) + array[j].fecha.day) <((array[j+1].fecha.year*365) + (array[j+1].fecha.month*30) + array[j+1].fecha.day) ) {
          k = array[j + 1];
          array[j + 1] = array[j];
          array[j] = k;
        }
      }
    }
    return array;
  }

  obtenerUsuarios() {
    this._servUsuario.obtenerUsuarios().subscribe(
      response => {
        if (response.message) {

          this.usuariosList = response.message;
        } else {//No hay usuarios registrdos//
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  getNombre(id: any) {

    for (var i = 0; i < this.usuariosList.length; i++) {
      if (id == this.usuariosList[i]._id) {
        return this.usuariosList[i].nombre+' ' + this.usuariosList[i].apellidos;

      } else { }
    }

  }
  obtenerRecursos() {
    this._servRecurso.obtenerRecursos().subscribe(
      response => {
        if (response.message) {

          this.recursosList = response.message;
        } else {//No hay usuarios registrdos//
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }

  getNombreRecurso(id: any) {
    this.listaNombreRecursos = [];
    this.codigosRecursosTemp = [];
    this.solicitudSalaTemp = id;
    let index = id.recursos.length;
    for (var e = 0; e < index; e++) {
      this.indice[e] = [e];
      for (var i = 0; i < this.recursosList.length; i++) {
        if (id.recursos[e] == this.recursosList[i]._id) {
          this.listaNombreRecursos[e] = this.recursosList[i].nombre;
          this.codigosRecursosTemp[e] = id.recursos[e];
          break;
        }
      }

    }

    return this.listaNombreRecursos;

  }


  elimarRecursoSoicitud() {
    let index = this.currenIndex;
    this.solicitudSalaTemp.recursos = this.codigosRecursosTemp;
    this.listaNombreRecursos.splice(index, 1);
    this.codigosRecursosTemp.splice(index, 1);
    console.log(this.solicitudSalaTemp);
    this._servSolicitudSala.modificarSolicitudSala(this.solicitudSalaTemp).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Recurso no se pudo Eliminar");
        } else {
          this.obtenerSolicitudSalas();
          this.msjExitoso("Recurso Eliminado Exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Sala no pudo ser Modificada");

        }
      }
    );

    if (this.listaNombreRecursos.length < 1) {
      this.cerrarModal('#modalRecursos');

    }

  }

  eliminarSolicitudSala() {
    this._servSolicitudSala.eliminarSolicitudSala(this.idEliminar).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Solicitud no pudo ser Eliminada");
        } else {
          this.msjExitoso("Sala Eliminada Exitosamente");
          this.obtenerSolicitudSalas();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Solicitud no pudo ser Eliminada");
        }
      }
    );
  }

  //********************************************************************Fin Sección Solicitud Sala**********************************************************************//

  //********************************************************************Sección Solicitud Vehiculo**********************************************************************//

  obtenerSolicitudVehiculo() {
    console.log('obtener solicitudes de vehivulo');
    this._servSolicitudVehiculo.obtenerTodasSolicitudes().subscribe(
      response => {

        if (response.message) {
          this.solicitudVehiculos = response.message;
          this.solicitudVehiculos=this.ordenarPorFecha(this.solicitudVehiculos);
          console.log(this.solicitudVehiculos);
        } else {//no hay Salas registradas
        }
      }, error => {
        var errorMensaje = <any>error;
        if (errorMensaje != null) {
          var body = JSON.parse(error._body);
        }
      }
    );
  }


  eliminarSolicitudVehiculo() {
    
    this._servSolicitudVehiculo.eliminarSolicitudVehiculo(this.idEliminar).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("La Solicitud no pudo ser Eliminada");
        } else {
          this.msjExitoso("Sala Eliminada Exitosamente");
          this.obtenerSolicitudVehiculo();
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Solicitud no pudo ser Eliminada");
        }
      }
    );
  }


  getNombreAcompanantes(vehiculo: any) {
    this.solicitudVehiculoTem = vehiculo;
    for (var e = 0; e < vehiculo.acompanantes.length; e++) {
      this.listaNombreAcompanantes[e] = vehiculo.acompanantes[e];
    }
    return this.listaNombreAcompanantes;
  }

  elimarAcompanante() {

    let index = this.acompananteIndex;
    this.listaNombreAcompanantes.splice(index, 1);
    this.solicitudVehiculoTem.acompanantes= this.listaNombreAcompanantes;
  
    this._servSolicitudVehiculo.modificarSolicitudVehiculo(this.solicitudVehiculoTem).subscribe(
      response => {

        if (!response.message._id) {
          this.msjError("El Recurso no se pudo Eliminar");
        } else {
          this.obtenerSolicitudSalas();
          this.msjExitoso("Recurso Eliminado Exitosamente");
        }
      }, error => {
        var alertMessage = <any>error;
        if (alertMessage != null) {
          var body = JSON.parse(error._body);
          this.msjError("La Sala no pudo ser Modificada");

        }
      }
    );

    if (this.listaNombreAcompanantes.length < 1) {
      this.cerrarModal('#modalAcompanantes');

    }

  }

  //********************************************************************Fin Sección Solicitud Vehiculo**********************************************************************//
  setCurrenIndex(index: any) {
    this.currenIndex = index
  }
  setAcompanantesIndex(index: any) {
    this.acompananteIndex = index
  }

  setIdEliminar(id: any) {
    this.idEliminar = id;
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
                  // this.obtenerVehiculos();
                  this.solicitud(1);
                  this.estiloBotones();
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
      //this.abrirModal('#loginModal');
      this._router.navigate(['/principal']);
    }
  }
  // tslint:disable-next-line:one-line
  solicitud(num: any) {
    if (num === 1) {
      this.obtenerSolicitudSalas();
      this.sala = true;
    } else {
      this.obtenerSolicitudVehiculo();
      this.sala = false;
    }
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

  estiloBotones() {
    $('#bnt-sala').css('background', '#0069d9');
    $('#bnt-vehiculo').css('background', '#eee');

    $('#bnt-sala').click(function () {
      $('#bnt-sala').css('background', '#0069d9');
      $('#bnt-vehiculo').css('background', '#eee');
    });

    $('#bnt-vehiculo').click(function () {
      $('#bnt-vehiculo').css('background', '#0069d9');
      $('#bnt-sala').css('background', '#eee');
    });
  }

}
