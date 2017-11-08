import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()

export class ServicioSolicitudVehiculo {


    public url: string;//url de la api rest

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    registrarSolicitud(solicitud) {
        let json = JSON.stringify(solicitud);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'registrarSolicitudVehiculo', params, { headers: headers })
            .map(res => res.json());
    }

     fechaActualVehiculo() {
        
         console.log('Servico en fecha Actual');
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.get(this.url + 'fechaActualServer', { headers: headers })
            .map(res => res.json());
    }


    obtenerSolicitudes(fecha: any) {

        console.log('Servicio obtener las solicitudes por fecha');
        let json = JSON.stringify(fecha);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'obtenerSolicitudesVehiculos', params, { headers: headers })
            .map(res => res.json());
    }

    obtenerTodasSolicitudes() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.get(this.url + 'obtenerTodasSolicitudesVehiculos', { headers: headers })
            .map(res => res.json());
    }

    modificarSolicitudVehiculo(solicitud: any) {
        let json = JSON.stringify(solicitud);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.put(this.url + 'modificarSolicitudVehiculo', params, { headers: headers })
            .map(res => res.json());
    }

    eliminarSolicitudVehiculo(id: string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(this.url + 'eliminarSolicitudSala/' + id, options)
            .map(res => res.json());
    }

}//Final de el export de clas