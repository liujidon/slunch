import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridConfirmTransactionComponent } from './grid-confirm-transaction.component';

describe('GridConfirmTransactionComponent', () => {
  let component: GridConfirmTransactionComponent;
  let fixture: ComponentFixture<GridConfirmTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridConfirmTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridConfirmTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
