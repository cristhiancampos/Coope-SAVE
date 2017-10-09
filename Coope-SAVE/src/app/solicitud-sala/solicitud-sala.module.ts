import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoUtilsModule } from '../demo-utils/module';
import { SolicitudSalaComponent } from './solicitud-sala.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot(),
   DemoUtilsModule
  ],
  declarations: [SolicitudSalaComponent],
  exports: [SolicitudSalaComponent]
})
export class SolicitudSalaComponentModule {}
