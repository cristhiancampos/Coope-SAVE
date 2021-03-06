import { BrowserModule } from '@angular/platform-browser';
import { NgModule,Pipe, PipeTransform } from '@angular/core';

import { appRoutingProviders, routing } from './app.routing';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SolicitudSalaComponent } from './solicitud-sala/solicitud-sala.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//import {CalendarHeaderComponent} from './demo-utils/calendar-header.component';
import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
// import { RegistoUsuarioComponent } from './registo-usuario/registo-usuario.component';
import { PrincipalComponent } from './principal/principal.component';
import { PdfmakeModule } from 'ng-pdf-make';
import { RouterModule, Routes } from '@angular/router';
import { ModificarUsuarioComponent } from './modificar-usuario/modificar-usuario.component';
import { AdministradorComponent } from './administrador/administrador.component';
import { AdminSalaComponent } from './admin-sala/admin-sala.component';
import { AdminVehiculoComponent } from './admin-vehiculo/admin-vehiculo.component';
import { AdminDepartamentoComponent } from './admin-departamento/admin-departamento.component';
import { AdminUsuarioComponent } from './admin-usuario/admin-usuario.component';
import { AdminRecursoComponent } from './admin-recurso/admin-recurso.component';
import { AdminSolicitudComponent } from './admin-solicitud/admin-solicitud.component';
import { SolicitudVehiculoComponent } from './solicitud-vehiculo/solicitud-vehiculo.component';
import {filtrarUsuario} from './solicitud-vehiculo/filtroUsuarios';
import {NgxPaginationModule} from 'ngx-pagination';
import { ReportesComponent } from './reportes/reportes.component';
import { ChartsModule } from 'ng2-charts';
//import{PDFReportesModule} from './reportes/pdfReportes.module';
//import { ImgBases64 } from './solicitud-vehiculo/imgBase64';
//import{SolicitudSalaComponent} from './SolicitudSalaComponent';


@NgModule({
  declarations: [
    AppComponent,
    SolicitudSalaComponent,
   // CalendarHeaderComponent,
    PrincipalComponent,
    ModificarUsuarioComponent,
    AdministradorComponent,
    AdminSalaComponent,
    AdminVehiculoComponent,
    AdminDepartamentoComponent,
    AdminUsuarioComponent,
    AdminRecursoComponent,
    AdminSolicitudComponent,
    SolicitudVehiculoComponent,
    filtrarUsuario,
    ReportesComponent,
   
  ],
  imports: [
    BrowserModule,
    routing,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    NgxPaginationModule,
    ChartsModule,
    PdfmakeModule,
  ],
  providers: [appRoutingProviders],
bootstrap: [AppComponent]
})
export class AppModule { }
