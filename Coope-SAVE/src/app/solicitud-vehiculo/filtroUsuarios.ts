import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SolicitudVehiculoComponent} from './solicitud-vehiculo.component';

@Pipe({ name: 'filter' })

export class filtrarUsuario implements PipeTransform{
   
componenteVehiculi: SolicitudVehiculoComponent;
    
    transform(value, args) {
       
        if (!args[0]) {
            console.log('no sirve');  
            return value;    
         } else if (value) {
            value = value.filter((item) => {
                console.log(item.nombre);
                console.log(item.nombre.toLowerCase().indexOf(args.toLowerCase()));
                return (item.nombre.toLowerCase().trim().indexOf(args.toLowerCase()) > -1);
              })
            
              return value;
            
        
        }
    }
}


