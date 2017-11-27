import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, Pipe, PipeTransform } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {SolicitudVehiculoComponent} from './solicitud-vehiculo.component';

@Pipe({ name: 'filter' })

export class filtrarUsuario implements PipeTransform{
   
componenteVehiculi: SolicitudVehiculoComponent;
    
    transform(value, args) {
       
        if (!args[0]) {  
            return value;    
         } else if (value) {
            value = value.filter((item) => {
                return (item.nombre.toLowerCase().trim().indexOf(args.toLowerCase()) > -1);
              })
            
              return value;
            
        
        }
    }
}


