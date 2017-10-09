import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVehiculoComponent } from './admin-vehiculo.component';

describe('AdminVehiculoComponent', () => {
  let component: AdminVehiculoComponent;
  let fixture: ComponentFixture<AdminVehiculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVehiculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
