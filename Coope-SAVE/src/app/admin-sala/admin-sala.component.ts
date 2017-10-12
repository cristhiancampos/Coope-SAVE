import { Component, OnInit } from '@angular/core';

import { ServicioSala } from '../servicios/sala';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Sala} from '../modelos/salas';

@Component({
  selector: 'app-admin-sala',
  templateUrl: './admin-sala.component.html',
  styleUrls: ['./admin-sala.component.css'],
  providers: [ServicioSala]
})
export class AdminSalaComponent implements OnInit {

public sala: Sala;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _servSala: ServicioSala
  ) { 

    this.sala = new Sala('','','','','','');
  }

  ngOnInit() {
  }


agregarSala(){
  this._servSala.registrarSala(this.sala).subscribe(
    response => {
      
      let sala = response.sala;
     
      if (!response.sala._id) {    
        alert('Error al registrar la Sala');
      } else {
        alert('Sala registrado exitosamente');
        console.log(sala);
        
      }
    }, error => {
      var alertMessage = <any>error;
      if (alertMessage != null) {
        var body = JSON.parse(error._body);
        alert('Sala no registrado');
        //console.log(error);
      }
    }
  );
  
}
}
