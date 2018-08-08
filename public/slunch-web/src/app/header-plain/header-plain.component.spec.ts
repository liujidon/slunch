import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPlainComponent } from './header-plain.component';

describe('HeaderPlainComponent', () => {
  let component: HeaderPlainComponent;
  let fixture: ComponentFixture<HeaderPlainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPlainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPlainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
