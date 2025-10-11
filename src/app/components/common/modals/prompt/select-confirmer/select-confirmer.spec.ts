import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConfirmer } from './select-confirmer';

describe('SelectConfirmer', () => {
  let component: SelectConfirmer;
  let fixture: ComponentFixture<SelectConfirmer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectConfirmer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectConfirmer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
