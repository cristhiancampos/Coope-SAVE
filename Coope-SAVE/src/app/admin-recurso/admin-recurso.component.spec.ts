import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecursoComponent } from './admin-recurso.component';

describe('AdminRecursoComponent', () => {
  let component: AdminRecursoComponent;
  let fixture: ComponentFixture<AdminRecursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRecursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
