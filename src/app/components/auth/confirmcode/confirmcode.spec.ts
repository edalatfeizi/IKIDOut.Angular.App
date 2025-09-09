import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Confirmcode } from './confirmcode';

describe('Confirmcode', () => {
  let component: Confirmcode;
  let fixture: ComponentFixture<Confirmcode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Confirmcode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Confirmcode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
