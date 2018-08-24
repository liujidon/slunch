import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridControlStatusComponent } from './grid-control-status.component';

describe('GridControlStatusComponent', () => {
  let component: GridControlStatusComponent;
  let fixture: ComponentFixture<GridControlStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridControlStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridControlStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
