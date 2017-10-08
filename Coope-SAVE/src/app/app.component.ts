import {OnDestroy, Component, Input, ElementRef, HostBinding, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements   OnInit {
  public identity:boolean;
  title = 'Coope-SAVE';
  public isSolicitudSala;
  public isRegister;


  constructor(private _router: Router,private el: ElementRef) {
    this.isSolicitudSala = false;
    this.isRegister=true;
   // localStorage.setItem('identity', JSON.stringify(false));
    this.isSolicitudSala = false;
    //this.identity = localStorage.getItem('identity');
    this.identity= false;
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
  }

}
