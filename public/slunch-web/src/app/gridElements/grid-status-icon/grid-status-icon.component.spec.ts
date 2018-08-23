import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridStatusIconComponent } from './grid-status-icon.component';

describe('GridStatusIconComponent', () => {
  let component: GridStatusIconComponent;
  let fixture: ComponentFixture<GridStatusIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridStatusIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridStatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
