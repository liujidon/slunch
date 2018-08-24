import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCancelTransactionComponent } from './grid-cancel-transaction.component';

describe('GridCancelTransactionComponent', () => {
  let component: GridCancelTransactionComponent;
  let fixture: ComponentFixture<GridCancelTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCancelTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCancelTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
