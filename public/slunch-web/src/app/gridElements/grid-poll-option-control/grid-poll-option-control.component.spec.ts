import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridPollOptionControlComponent } from './grid-poll-option-control.component';

describe('GridPollOptionControlComponent', () => {
  let component: GridPollOptionControlComponent;
  let fixture: ComponentFixture<GridPollOptionControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridPollOptionControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridPollOptionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
