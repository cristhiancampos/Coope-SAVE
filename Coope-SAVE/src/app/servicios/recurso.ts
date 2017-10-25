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
         let json = JSON.stringify(recurso);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarRecurso',params,{headers:headers})
        .map(res=>res.json());
    }

    obtenerRecursos()
    {
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerRecursos ',{headers:headers})
        .map(res=>res.json());
        
    }

    obtenerRecurso(id:any){
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.get(this.url+'obtenerRecurso/'+id,options)
         .map(res=>res.json());
    }

    eliminarRecurso(id:string)
    {
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.delete(this.url+'eliminarRecurso/'+id,options)
         .map(res=>res.json());
    }

    validarModificacion(recurso: any)
    {
         let json = JSON.stringify(recurso);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarModificacionRecurso',params,{headers:headers})
        .map(res=>res.json());
    }

    modificarRecurso(recurso:any)
    {
         let json = JSON.stringify(recurso);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url+'modificarRecurso',params,{headers:headers})
        .map(res=>res.json());
    }

    obtenerRecursosHabilitados()
    {
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerRecursosHabilitados ',{headers:headers})
        .map(res=>res.json());
        
    }
}//Final de el export de clase