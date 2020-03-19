import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckadminauthenticationComponent } from './checkadminauthentication.component';

describe('CheckadminauthenticationComponent', () => {
  let component: CheckadminauthenticationComponent;
  let fixture: ComponentFixture<CheckadminauthenticationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckadminauthenticationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckadminauthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
