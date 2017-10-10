import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-admin-solicitud',
  templateUrl: './admin-solicitud.component.html',
  styleUrls: ['./admin-solicitud.component.css']
})
export class AdminSolicitudComponent implements OnInit {

  sala = true;
  constructor() {
  }

  ngOnInit() {
    this.solicitud(1);
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

  // tslint:disable-next-line:one-line
  solicitud(num: any) {
    if (num === 1) {
      this.sala = true;
    } else {
      this.sala = false;
    }
  }

}
