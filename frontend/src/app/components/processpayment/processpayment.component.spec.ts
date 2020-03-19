import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesspaymentComponent } from './processpayment.component';

describe('ProcesspaymentComponent', () => {
  let component: ProcesspaymentComponent;
  let fixture: ComponentFixture<ProcesspaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcesspaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesspaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
