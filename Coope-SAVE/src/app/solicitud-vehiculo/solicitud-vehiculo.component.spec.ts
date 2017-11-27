import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudVehiculoComponent } from './solicitud-vehiculo.component';

describe('SolicitudVehiculoComponent', () => {
  let component: SolicitudVehiculoComponent;
  let fixture: ComponentFixture<SolicitudVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudVehiculoComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
