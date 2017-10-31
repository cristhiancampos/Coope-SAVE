import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { ServicioUsuario } from '../servicios/usuario';
import { ServicioSolicitudSala } from '../servicios/solicitudSala';
import {ServicioRecursos} from '../servicios/recurso';
import { Usuario } from '../modelos/usuario';
import { Recurso } from '../modelos/recursos';
import { SolicitudSala} from '../modelos/solicitudSala';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-admin-solicitud',
  templateUrl: './admin-solicitud.component.html',
  styleUrls: ['./admin-solicitud.component.css'],
  providers: [ ServicioRecursos, ServicioSolicitudSala, ServicioUsuario] 
})
export class AdminSolicitudComponent implements OnInit {

  private sala = true;// Boolean para controlar que tabla de solicitudes se muestras
  private token;
  private identity;
  
  public solicitudSala: SolicitudSala;
  public solicitudSalaEdit: SolicitudSala;
  public solicitudSalas= [];
  public usuariosList= [];
  public recursosList=[];
  public listaNombreRecursos= [];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario,
    private _servRecurso: ServicioRecursos,
    private _servSolicitudSala: ServicioSolicitudSala
  ) {
  }

  ngOnInit() {
    this.obtenerUsuarios();
    this.obtenerRecursos();
    this.verificarCredenciales();
    this.obtenerSolicitudSalas();
  }

obtenerSolicitudSalas(){
  this._servSolicitudSala.obtenerTodasSolicitudes().subscribe(
    response => {

      if (response.message) {        
        this.solicitudSalas = response.message;
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

obtenerUsuarios(){

  this._servUsuario.obtenerUsuarios().subscribe(
    response => {
          if(response.message){

            this.usuariosList=  response.message;
            console.log(this.usuariosList);
          }else{//No hay usuarios registrdos//
          }
          }, error => {
            var errorMensaje = <any>error;
            if (errorMensaje != null) {
              var body = JSON.parse(error._body);
            }
          }
  );
}

getNombre(id: any){
  
      for(var i=0; i< this.usuariosList.length; i++){
        if(id == this.usuariosList[i]._id){
          console.log(this.usuariosList[i].nombre);
          return this.usuariosList[i].nombre;

        }else {}
      }
  
}
obtenerRecursos(){
  
  this._servRecurso.obtenerRecursos().subscribe(
    response => {
          if(response.message){

            this.recursosList=  response.message;
            console.log(this.recursosList);
          }else{//No hay usuarios registrdos//
          }
          }, error => {
            var errorMensaje = <any>error;
            if (errorMensaje != null) {
              var body = JSON.parse(error._body);
            }
          }
  );
}

getNombreRecurso(id:any){

  let index =id.recursos.length;
  for(var e=0; e< index;e++)
  {
    for( var i=0; i< this.recursosList.length; i++){
      if(id.recursos[e]== this.recursosList[i]._id){
        this.listaNombreRecursos[e]= this.recursosList[i].nombre;
        break;
      }
    }
   
  }
  return this.listaNombreRecursos;
  
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
                  // this.obtenerVehiculos();
                  this.solicitud(1);
                  this.estiloBotones();
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
      //this.abrirModal('#loginModal');
      this._router.navigate(['/principal']);
    }
  }
  // tslint:disable-next-line:one-line
  solicitud(num: any) {
    if (num === 1) {
      this.sala = true;
    } else {
      this.sala = false;
    }
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

  estiloBotones(){
    $('#bnt-sala').css('background', '#0069d9');
    $('#bnt-vehiculo').css('background', '#eee');

    $('#bnt-sala').click(function(){
      $('#bnt-sala').css('background', '#0069d9');
      $('#bnt-vehiculo').css('background', '#eee');
    });

    $('#bnt-vehiculo').click(function(){
      $('#bnt-vehiculo').css('background', '#0069d9');
      $('#bnt-sala').css('background', '#eee');
    });
  }


}
