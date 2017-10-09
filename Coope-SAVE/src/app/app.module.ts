import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { appRoutingProviders, routing } from './app.routing';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
// import { MaterializeModule } from 'angular2-materialize';
import { SolicitudSalaComponent } from './solicitud-sala/solicitud-sala.component';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {CalendarHeaderComponent} from './demo-utils/calendar-header.component';
import {DateTimePickerComponent} from './demo-utils/data-time-picker.component';

import * as moment from 'moment';
import 'moment/locale/es';
moment.locale('es');
import { RegistoUsuarioComponent } from './registo-usuario/registo-usuario.component';
import { PrincipalComponent } from './principal/principal.component';


import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: 'principal',
    component: PrincipalComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/principal',
    pathMatch: 'full'
  },
  { path: '',
    redirectTo: '/solicitudSala',
    pathMatch: 'full'
  },
  { path: '**', component: SolicitudSalaComponent }
  
];
@NgModule({
  declarations: [
    AppComponent,
    SolicitudSalaComponent,
    CalendarHeaderComponent,
    DateTimePickerComponent,
    RegistoUsuarioComponent,
    PrincipalComponent,

  ],
  imports: [
    BrowserModule,
    // MaterializeModule,
    //routing,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
    //DateTimePickerComponent
  ],
  providers: [],
bootstrap: [AppComponent/*, appRoutingProviders*/]
})
export class AppModule { 
  
 //jquery;
}
