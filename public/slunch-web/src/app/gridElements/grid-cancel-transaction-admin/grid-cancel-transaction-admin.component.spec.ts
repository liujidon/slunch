import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCancelTransactionAdminComponent } from './grid-cancel-transaction-admin.component';

describe('GridCancelTransactionComponent', () => {
  let component: GridCancelTransactionAdminComponent;
  let fixture: ComponentFixture<GridCancelTransactionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridCancelTransactionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCancelTransactionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
