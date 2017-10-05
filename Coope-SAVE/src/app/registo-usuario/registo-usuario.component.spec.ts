import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistoUsuarioComponent } from './registo-usuario.component';

describe('RegistoUsuarioComponent', () => {
  let component: RegistoUsuarioComponent;
  let fixture: ComponentFixture<RegistoUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistoUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
