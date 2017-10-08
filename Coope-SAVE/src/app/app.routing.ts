import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SolicitudSalaComponent} from './solicitud-sala/solicitud-sala.component';
import {RegistoUsuarioComponent} from './registo-usuario/registo-usuario.component';
import {PrincipalComponent} from './principal/principal.component';


const appRoutes: Routes = [
    { path: 'solicitudSala', component: SolicitudSalaComponent},
   { path: '', component: RegistoUsuarioComponent},
    { path: 'principal', component: PrincipalComponent},
    {path:'**',component: RegistoUsuarioComponent}
];


export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
