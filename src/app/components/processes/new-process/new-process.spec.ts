import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProcess } from './new-process';

describe('NewProcess', () => {
  let component: NewProcess;
  let fixture: ComponentFixture<NewProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProcess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProcess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
