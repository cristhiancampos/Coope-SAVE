// import {Injectable } from '@angular/core';
// import {Http, Response,Headers,RequestOptions } from '@angular/http';
// import 'rxjs/add/operator/map';
// import {Observable } from 'rxjs/Observable';
// import {GLOBAL} from './global';


// @Injectable()

// export class ServicioSolicitudSala{

//     public url: string;//url de la api rest

//     constructor(private _http: Http)
//     {
//         this.url = GLOBAL.url;
//     }

//     nuevo(){
//        // alert('hhhhhhhhhhhhhhhhhhhhhhhhhh');
//        return "dildos";
//     }

//     registrarSolicitud(solicitud){
//         let json = JSON.stringify(solicitud);
//         let params = json; 
//         let headers = new Headers({'Content-Type':'application/json'});
//         return this._http.post(this.url+'registrarSolicitudSala',params,{headers:headers})
//         .map(res=>res.json());
//     }

//     public fechaActual()
//     { 
//         let headers = new Headers({'Content-Type':'application/json'});
//         return this._http.get(this.url+'fechaActual',{headers:headers})
//         .map(res=>res.json());
//     }


//     obtenerSolicitudes(fecha:any){
//         let json = JSON.stringify(fecha);
//         let params = json; 
//         let headers = new Headers({'Content-Type':'application/json'});
//         return this._http.post(this.url+'obtenerSolicitudesSalas',params,{headers:headers})
//         .map(res=>res.json());
//     }

//     obtenerTodasSolicitudes(){
//         let headers = new Headers({'Content-Type':'application/json'});
//         return this._http.get(this.url+'obtenerTodasSolicitudes',{headers:headers})
//         .map(res=>res.json());
//     }

//     modificarSolicitudSala(solicitud:any)
//     {
//          let json = JSON.stringify(solicitud);
//         let params = json; 
//         let headers = new Headers({'Content-Type':'application/json'});
//         return this._http.put(this.url+'modificarSolicitudSala',params,{headers:headers})
//         .map(res=>res.json());
//     }

//     eliminarSolicitudSala(id:string)
//     {
//         let headers = new Headers({
//             'Content-Type':'application/json',
//             //'Authorization':token
//         });
//         let options = new RequestOptions({headers:headers});
//         return this._http.delete(this.url+'eliminarSolicitudSala/'+id,options)
//          .map(res=>res.json());
//     }



// }//Final de el export de clase

import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()

export class ServicioSolicitudSala {

    public url: string;//url de la api rest

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    registrarSolicitud(solicitud) {
        let json = JSON.stringify(solicitud);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'registrarSolicitudSala', params, { headers: headers })
            .map(res => res.json());
    }

     fechaActual() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.get(this.url + 'fechaActual', { headers: headers })
            .map(res => res.json());
    }


    obtenerSolicitudes(fecha: any) {
        let json = JSON.stringify(fecha);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'obtenerSolicitudesSalas', params, { headers: headers })
            .map(res => res.json());
    }

    obtenerTodasSolicitudes() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.get(this.url + 'obtenerTodasSolicitudes', { headers: headers })
            .map(res => res.json());
    }

    modificarSolicitudSala(solicitud: any) {
        let json = JSON.stringify(solicitud);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.put(this.url + 'modificarSolicitudSala', params, { headers: headers })
            .map(res => res.json());
    }

    eliminarSolicitudSala(id: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(this.url + 'eliminarSolicitudSala/' + id, options)
            .map(res => res.json());
    }


    obtenerSolicitudSala(id: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'obtenerSolicitudSala/' + id, options)
            .map(res => res.json());
    }
    

}//Final de el export de clas