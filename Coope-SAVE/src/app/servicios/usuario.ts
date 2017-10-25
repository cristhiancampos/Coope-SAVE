import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()//permite la injeccion de dependencias
export class ServicioUsuario {
    public url: string;//url de la api rest
    public identity: string;
    public token: string;

    constructor(private _http: Http) {
        this.url = GLOBAL.url;
    }

    registrarUsuario(usuario) {
        let json = JSON.stringify(usuario);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'registrar', params, { headers: headers })
            .map(res => res.json());
    }

    getCorreo(usuario) {
        let json = JSON.stringify(usuario);
        let params = json;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this._http.post(this.url + 'getCorreo', params, { headers: headers })
            .map(res => res.json());
    }

    loginUsuario(usuario, gethash = null) {
        if (gethash != null) {
            usuario.gethash = gethash;
        }
        let json = JSON.stringify(usuario);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'login', params, { headers: headers })
            .map(res => res.json());

    }

    verificarCredenciales(usuario, gethash = null) {
        if (gethash != null) {
            usuario.gethash = gethash;
        }
        let json = JSON.stringify(usuario);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'verificarCredenciales', params, { headers: headers })
            .map(res => res.json());
    }


    /* getSong(token,id:string)
     {
         let headers = new Headers({
             'Content-Type':'application/json',
             'Authorization':token
         });
         let options = new RequestOptions({headers:headers});
         return this._http.get(this.url+'song/'+id,options)
          .map(res=>res.json());
     }*/

    getUser() {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });/*,
        'Authorization':this.token*/

        let options = new RequestOptions({ headers: headers });
        return this._http.get(this.url + 'user', options)
            .map(res => res.json());
    }
    signup(user_to_login, gethash = null) {

        if (gethash != null) {
            user_to_login.gethash = gethash;
        }

        let json = JSON.stringify(user_to_login);
        let params = json;

        let headers = new Headers({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'login', params, { headers: headers })
            .map(res => res.json());

    }


    updateUser(user_to_update) {
        /* let json = JSON.stringify(user_to_update);
         let params = json; 
 
         let headers = new Headers({
             'Content-Type':'application/json',
             'Authorization':this.getToken()
         });
 
         return this._http.put(this.url+'update-user/'+user_to_update._id,
         params,{headers:headers})
         .map(res=>res.json());*/
    }

    //metodos para acceder al localStorage, conseguir el elemento que se requiere y devolverlo ya procesado con la info de interes
    getIndentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        let token = localStorage.getItem('token');
        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }

    obtenerUsuarios()
    {
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.get(this.url+'obtenerUsuarios',{headers:headers})
        .map(res=>res.json());
    }


    eliminarUsuario(id:string)
    {
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.delete(this.url+'eliminarUsuario/'+id,options)
         .map(res=>res.json());
    }

    obtenerUsuario(id:any){
        let headers = new Headers({
            'Content-Type':'application/json',
            //'Authorization':token
        });
        let options = new RequestOptions({headers:headers});
        return this._http.get(this.url+'obtenerUsuario/'+id,options)
         .map(res=>res.json());

    }

    validarModificacion(usuario: any)
    {
         let json = JSON.stringify(usuario);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarModificacionUsuario',params,{headers:headers})
        .map(res=>res.json());
    }

    modificarUsuario(usuario:any)
    {
        
         let json = JSON.stringify(usuario);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url+'modificarUsuario',params,{headers:headers})
        .map(res=>res.json());

    }
    modificarUsuarioCompleto(usuario:any)
    {
        
         let json = JSON.stringify(usuario);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.put(this.url+'modificarUsuarioCompleto',params,{headers:headers})
        .map(res=>res.json());
    }

    validarContrasena(usuario:any){
        let json = JSON.stringify(usuario);
        let params = json; 
        let headers = new Headers({'Content-Type':'application/json'});
        return this._http.post(this.url+'validarContrasena',params,{headers:headers})
        .map(res=>res.json());
    }


}