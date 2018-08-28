import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatePriceComponent } from './calculate-price.component';

describe('CalculatePriceComponent', () => {
  let component: CalculatePriceComponent;
  let fixture: ComponentFixture<CalculatePriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatePriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatePriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
