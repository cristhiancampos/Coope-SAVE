import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudSalaComponent } from './solicitud-sala.component';

describe('SolicitudSalaComponent', () => {
  let component: SolicitudSalaComponent;
  let fixture: ComponentFixture<SolicitudSalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudSalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
