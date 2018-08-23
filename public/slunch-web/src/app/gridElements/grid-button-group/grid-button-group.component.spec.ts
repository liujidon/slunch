import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridButtonGroupComponent } from './grid-button-group.component';

describe('GridButtonGroupComponent', () => {
  let component: GridButtonGroupComponent;
  let fixture: ComponentFixture<GridButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridButtonGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
