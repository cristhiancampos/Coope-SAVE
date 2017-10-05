import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SolicitudSalaComponent} from './solicitud-sala/solicitud-sala.component';


const appRoutes: Routes = [
    { path: 'solicitudSala', component: SolicitudSalaComponent}];


export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
