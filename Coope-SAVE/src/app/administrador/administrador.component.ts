import { Component, OnInit } from '@angular/core';
import { ServicioUsuario } from '../servicios/usuario';
import { Usuario } from '../modelos/usuario';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {

  public token;
  public identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servUsuario: ServicioUsuario
  ) { }

  ngOnInit() {
    this.verificarCredenciales();
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
          if (this.identity.rol == "ADMINISTRADOR" || this.identity.rol == "SUPERADMIN") {
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
      this._router.navigate(['/principal']);
      $('#nav-user').text(' ');
    }
  }

  // cerrarModal(modalId: any) {
  //   $(".modal-backdrop").remove();
  //   $('body').removeClass('modal-open');
  //   $(modalId).removeClass('show');
  //   $(modalId).css('display', 'none');
  // }

  // abrirModal(modalId: any) {
  //   $('body').append('<div class="modal-backdrop fade show" ></div>');
  //   $('body').addClass('modal-open');
  //   $(modalId).addClass('show');
  //   $(modalId).css('display', 'block');
  // }


}
