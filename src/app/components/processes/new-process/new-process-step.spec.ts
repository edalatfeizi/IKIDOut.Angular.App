import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProcessStep } from './new-process-step';

describe('NewProcessStep', () => {
  let component: NewProcessStep;
  let fixture: ComponentFixture<NewProcessStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProcessStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProcessStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
