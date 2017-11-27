import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
//import { SolicitudSalaComponentModule } from './solicitud-sala/solicitud-sala.module';
import { SolicitudSalaComponent } from './solicitud-sala/solicitud-sala.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
   // SolicitudSalaComponentModule
  ],
  bootstrap: [SolicitudSalaComponent]
})
export class BootstrapModule {}

platformBrowserDynamic().bootstrapModule(BootstrapModule);
