import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridVoterStatusComponent } from './grid-voter-status.component';

describe('GridVoterStatusComponent', () => {
  let component: GridVoterStatusComponent;
  let fixture: ComponentFixture<GridVoterStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridVoterStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridVoterStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
