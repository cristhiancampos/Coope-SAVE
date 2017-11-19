import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SolicitudSalaComponent} from './solicitud-sala/solicitud-sala.component';
import {PrincipalComponent} from './principal/principal.component';
import {ModificarUsuarioComponent} from './modificar-usuario/modificar-usuario.component';
//admin modules
import {AdministradorComponent} from './administrador/administrador.component';
import {AdminSalaComponent} from './admin-sala/admin-sala.component';
import {AdminVehiculoComponent} from './admin-vehiculo/admin-vehiculo.component';
import {AdminDepartamentoComponent} from './admin-departamento/admin-departamento.component';
import {AdminUsuarioComponent} from './admin-usuario/admin-usuario.component';
import {AdminRecursoComponent} from './admin-recurso/admin-recurso.component';
import {AdminSolicitudComponent} from './admin-solicitud/admin-solicitud.component';
import { SolicitudVehiculoComponent } from './solicitud-vehiculo/solicitud-vehiculo.component';
import { ReportesComponent } from './reportes/reportes.component';



const appRoutes: Routes = [
    { path: 'solicitudSala', component: SolicitudSalaComponent},
    { path: 'solicitudVehiculo', component: SolicitudVehiculoComponent},
   { path: '', component: PrincipalComponent},
    { path: 'principal', component: PrincipalComponent},
    { path: 'modificar', component: ModificarUsuarioComponent},
    { path: 'administrador', component: AdministradorComponent },
    { path: 'admSala', component: AdminSalaComponent },
    { path: 'admVehiculo', component: AdminVehiculoComponent },
    { path: 'admDepartamento', component: AdminDepartamentoComponent },
    { path: 'admUsuario', component: AdminUsuarioComponent },
    { path: 'admRecurso', component: AdminRecursoComponent },
    { path: 'admSolicitud', component: AdminSolicitudComponent },
    { path: 'reportes', component: ReportesComponent },
    {path: '**', component: PrincipalComponent}

];


export const appRoutingProviders: any [] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
