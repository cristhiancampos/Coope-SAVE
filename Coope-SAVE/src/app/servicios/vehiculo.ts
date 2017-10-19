import {Injectable } from '@angular/core';
import {Http, Response,Headers,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable } from 'rxjs/Observable';
import {GLOBAL} from './global';

@Injectable()

export class ServicioVehiculo{

    public url: string;//url de la api rest

    constructor(private _http: Http)
    {
        this.url = GLOBAL.url;
    }

    registrarVehiculo(vehiculo){
        let json = JSON.stringify(vehiculo);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'registrarVehiculo',params,{headers:headers})
        .map(res=>res.json());
    }


    validarVehiculo(vehiculo)
    {
        console.log(vehiculo);
         let json = JSON.stringify(vehiculo);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarVehiculo',params,{headers:headers})
        .map(res=>res.json());
    }

    obtenerVehiculos()
    {
        // console.log(vehiculo);
        //  let json = JSON.stringify(vehiculo);
        // let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerVehiculos',{headers:headers})
        .map(res=>res.json());
    }

    obtenerVehiculo(id:any){
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.get(this.url+'obtenerVehiculo/'+id,options)
         .map(res=>res.json());

    }
}//Final de el export de clase