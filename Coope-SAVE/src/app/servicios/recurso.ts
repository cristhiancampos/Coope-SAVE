import {Injectable } from '@angular/core';
import {Http, Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()

export class ServicioRecursos{

    public url: string;//url de la api rest

    constructor(private _http: Http)
    {
        this.url = GLOBAL.url;
    }

    registrarRecurso(recurso){
        
        let json = JSON.stringify(recurso);
        let params = json;   
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'registrarRecurso',params,{headers:headers})
        .map(res=>res.json());
      
    }


    validarRecurso(recurso)
    {
        console.log('entroa al servicio');
        console.log(recurso);
        
         let json = JSON.stringify(recurso);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarRecurso',params,{headers:headers})
        .map(res=>res.json());
    }

    obtenerRecursos()
    {
        // console.log(vehiculo);
        //  let json = JSON.stringify(vehiculo);
        // let params = json; 
        console.log("en el servicio");
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerRecursos ',{headers:headers})
        .map(res=>res.json());
        
    }

}//Final de el export de clase