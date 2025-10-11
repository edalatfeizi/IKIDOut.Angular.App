import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sendout } from './sendout';

describe('Sendout', () => {
  let component: Sendout;
  let fixture: ComponentFixture<Sendout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sendout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sendout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
