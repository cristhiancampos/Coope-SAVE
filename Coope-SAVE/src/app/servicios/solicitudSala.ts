import {Injectable } from '@angular/core';
import {Http, Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()

export class ServicioSolicitudSala{

    public url: string;//url de la api rest

    constructor(private _http: Http)
    {
        this.url = GLOBAL.url;
    }

    
    registrarSolicitud(solicitud){
        let json = JSON.stringify(solicitud);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'registrarSolicitudSala',params,{headers:headers})
        .map(res=>res.json());
    }

/*
    validarSala(nombre)
    {
         let json = JSON.stringify(nombre);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarSala',params,{headers:headers})
        .map(res=>res.json());
    }

    obtenerSalas()
    { 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerSalas',{headers:headers})
        .map(res=>res.json());
    }

    obtenerSala(id:any){
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.get(this.url+'obtenerSala/'+id,options)
         .map(res=>res.json());

    }

    eliminarSala(id:string)
    {
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.delete(this.url+'eliminarSala/'+id,options)
         .map(res=>res.json());
    }

    validarModificacion(sala: any)
    {
         let json = JSON.stringify(sala);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarModificacion',params,{headers:headers})
        .map(res=>res.json());
    }

    modificarSala(sala:any)
    {
         let json = JSON.stringify(sala);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url+'modificarSala',params,{headers:headers})
        .map(res=>res.json());
    }
    obtenerSalasHabilitadas()
    { 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerSalasHabilitadas',{headers:headers})
        .map(res=>res.json());
    }*/

}//Final de el export de clase