import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoRequestComponent } from './cargorequest.component';

describe('CargoRequestComponent', () => {
  let component: CargoRequestComponent;
  let fixture: ComponentFixture<CargoRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargoRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargoRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
