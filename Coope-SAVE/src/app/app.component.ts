import {OnDestroy, Component, Input, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as $ from 'jquery';
import {ServicioUsuario} from '../app/servicios/usuario';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ServicioUsuario]
})
export class AppComponent implements   OnInit {
  _servUsuario: any;
  public identity: boolean;
  title = 'Coope-SAVE';
  public isSolicitudSala;
  public isRegister;
  SESSION='';


  constructor(private _router: Router,private el: ElementRef,_servUsuario:ServicioUsuario,private route: ActivatedRoute) {
    this.isSolicitudSala = false;
    this.isRegister=true;
   // localStorage.setItem('identity', JSON.stringify(false));
    this.isSolicitudSala = false;
    //this.identity = localStorage.getItem('identity');
    this.identity= false;
  }
  id: number;
  private sub: any;
  getUsuario() {

    this._servUsuario.getUsuario().subscribe(
      response => {
          if (!response.user) {
              ///this._router.navigate(['/']);
          } else {
              this.SESSION = response.user;
          }
          console.log(response.user+"----------------------------------------------------------");

      }, error => {
          var errorMensaje = <any>error;

          if (errorMensaje != null) {
              var body = JSON.parse(error._body);
              console.log(error);
          }
      }
  );
  
  //   this.sub= this.route.params.subscribe(params => {
  //     this.id = +params['id']; // (+) converts string 'id' to a number

  //     // In a real app: dispatch action to load the details here.
  //  });
  //   this._router.params.forEach((params: Params) => {
  //       //let id = params['id'];
  //       this._servUsuario.getUsuario().subscribe(
  //           response => {
  //               if (!response.song) {
  //                   this._router.navigate(['/']);
  //               } else {
  //                   this.SESSION = response.user;
  //               }

  //           }, error => {
  //               var errorMensaje = <any>error;

  //               if (errorMensaje != null) {
  //                   var body = JSON.parse(error._body);
  //                   console.log(error);
  //               }
  //           }
  //       );

  //   }
  // );

}
  principal() {
    // this.isSolicitudSala = false;
    // localStorage.setItem('identity', JSON.stringify(true));
    // alert(localStorage.setItem('identity', JSON.stringify(true)));
    this.identity = true;
    
  }
  solicitarSala(solicitud: boolean) {

     this.isSolicitudSala = solicitud;
    // this._router.navigate(['/solicitudSala']);

  }
  // método que realiza una acción después de haberse cargado el componente
  ngOnInit() {  
   console.log('mmnmnmnmnmnmnmnmnmnmmmmmm');
   this.getUsuario();
  }

}
