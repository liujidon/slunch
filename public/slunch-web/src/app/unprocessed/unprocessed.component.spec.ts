import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnprocessedComponent } from './unprocessed.component';

describe('UnprocessedComponent', () => {
  let component: UnprocessedComponent;
  let fixture: ComponentFixture<UnprocessedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnprocessedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnprocessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
