import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSalaComponent } from './admin-sala.component';

describe('AdminSalaComponent', () => {
  let component: AdminSalaComponent;
  let fixture: ComponentFixture<AdminSalaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSalaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

