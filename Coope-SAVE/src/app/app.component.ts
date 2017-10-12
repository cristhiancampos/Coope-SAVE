import { OnDestroy, Component, Input, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as $ from 'jquery';
import { ServicioUsuario } from './servicios/usuario';
import { Usuario } from './modelos/usuario';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  providers: [ServicioUsuario]
})
export class AppComponent implements OnInit {
  //_servUsuario: any;
  public identity: boolean;
  title = 'Coope-SAVE';
  public isSolicitudSala;
  public isRegister;
  public token;
  public SESSION;
  public errorMessage;
  public user: Usuario;
  public mmostrar;


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private el: ElementRef,
    private _servUsuario: ServicioUsuario,
    private route: ActivatedRoute
  ) {
    this.isSolicitudSala = false;
    this.isRegister = true;
    this.isSolicitudSala = false;
    this.identity = false;

    this.mmostrar = false;

    this.token = this._servUsuario.getToken();
    this.SESSION = this._servUsuario.getIndentity();
  }

  getUsuario() {

    //this.SESSION =this._servUsuario.getUser();
    this._route.params.forEach((params: Params) => {
      // let id = params['id'];
      this._servUsuario.getUser().subscribe(
        response => {
          if (!response) {
            // this._router.navigate(['/']);
          } else {
            this.SESSION = response;
          }
          console.log(response);
        }, error => {
          var errorMensaje = <any>error;

          if (errorMensaje != null) {
            var body = JSON.parse(error._body);
            console.log(error);
          }
        }
      );

    });
  }

  public onSubmit() {
    console.log(this.user);
    //obtener datos de usuaario identificado
    //susbcribe(), para subcribirse al observable
    this._servUsuario.signup(this.user).subscribe(response => {
      let SESSION = response.user;
      this.SESSION = SESSION;
      if (!this.SESSION._id) {
        alert('usuario no indentificado correctamente');
      } else {
        //crear elemento en el localstorage para la session de usuario//
        localStorage.setItem('identity', JSON.stringify(SESSION));   //JSON.stringfy(), convierte un json a string
        //conseguir el token para enviarselo a cada petición
        this._servUsuario.signup(this.user, 'true').subscribe(
          response => {
            let token = response.token;
            this.token = token;
            if (this.token <= 0) {
              alert('el token no se ha generado');
            } else {
              //crear elemento en el localstorage para tener el token disponible
              localStorage.setItem('token', token);
              this.user = new Usuario('', '', '', '', '', '', '');
            }
          }, error => {
            var errorMensaje = <any>error;

            if (errorMensaje != null) {
              var body = JSON.parse(error._body);
              this.errorMessage = body.message;
              console.log(error);
            }
          }

        );
      }
    }, error => {
      let errorMensaje = <any>error;

      if (errorMensaje != null) {
        var body = JSON.parse(error._body);
        this.errorMessage = body.message;
        console.log(error);
      }
    }

    );

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

   // localStorage.clear();
    console.log('---------------------------------------------');
    let identity =localStorage.getItem('identity');
    let user =JSON.parse(identity);
    this.SESSION =user;
    console.log(user);
    if(user!=null)
      {
        this.mmostrar = true;
      }else{
        this.mmostrar = false;
       
      }
    
    // var wsh = new ActiveXObject('WScript.Shell');
    // var usuario = wsh.ExpandEnvironmentStrings('%USERNAME%');
    // document.elform.T1.value= usuario;
    //Creamos un objeto ActiveX


//Obtenemos los datos del equipo
// var usr = wsh.UserName;
// var equ = wsh.ComputerName;
// var dom = wsh.UserDomain;
  }

}
