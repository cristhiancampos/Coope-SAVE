import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SolicitudSalaComponent} from './solicitud-sala/solicitud-sala.component';
import {RegistoUsuarioComponent} from './registo-usuario/registo-usuario.component';
import {PrincipalComponent} from './principal/principal.component';
import {ModificarUsuarioComponent} from './modificar-usuario/modificar-usuario.component';


const appRoutes: Routes = [
    { path: 'solicitudSala', component: SolicitudSalaComponent},
   { path: '', component: PrincipalComponent},
    { path: 'principal', component: PrincipalComponent},
    { path: 'modificar', component: ModificarUsuarioComponent},
    {path: '**', component: PrincipalComponent}
];


export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
