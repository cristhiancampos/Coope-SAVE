import {Injectable } from '@angular/core';
import {Http, Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()

export class ServicioSala{

    public url: string;//url de la api rest

    constructor(private _http: Http)
    {
        this.url = GLOBAL.url;
    }

    registrarSala(sala){
        let json = JSON.stringify(sala);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'registrarSala',params,{headers:headers})
        .map(res=>res.json());
    }


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
        // console.log(vehiculo);
        //  let json = JSON.stringify(vehiculo);
        // let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerSalas',{headers:headers})
        .map(res=>res.json());
    }

}//Final de el export de clase