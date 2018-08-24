import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridUpdateTransactionComponent } from './grid-update-transaction.component';

describe('GridUpdateTransactionComponent', () => {
  let component: GridUpdateTransactionComponent;
  let fixture: ComponentFixture<GridUpdateTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridUpdateTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridUpdateTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
