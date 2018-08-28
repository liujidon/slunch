import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPollOptionComponent } from './edit-poll-option.component';

describe('EditPollOptionComponent', () => {
  let component: EditPollOptionComponent;
  let fixture: ComponentFixture<EditPollOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPollOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPollOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
