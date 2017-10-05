import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SolicitudSalaComponent} from './solicitud-sala/solicitud-sala.component';
import {RegistoUsuarioComponent} from './registo-usuario/registo-usuario.component';


const appRoutes: Routes = [
    { path: 'solicitudSala', component: SolicitudSalaComponent},
    { path: 'registroUsuario', component: RegistoUsuarioComponent}
];


export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
