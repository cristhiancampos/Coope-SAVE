import {Injectable } from '@angular/core';
import {Http, Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()

export class ServicioDepartamento{

    public url: string;//url de la api rest

    constructor(private _http: Http)
    {
        this.url = GLOBAL.url;
    }

    registrarDepartamento(departamento){
        let json = JSON.stringify(departamento);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'registrarDepartamento',params,{headers:headers})
        .map(res=>res.json());
    }


    validarDepartamento(nombre)
    {
         let json = JSON.stringify(nombre);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarDepartamento',params,{headers:headers})
        .map(res=>res.json());
    }

    obtenerDepartamento()
    {
        // console.log(vehiculo);
        //  let json = JSON.stringify(vehiculo);
        // let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerDepartamentos',{headers:headers})
        .map(res=>res.json());
    }

}//Final de el export de clase