import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChart } from './flow-chart';

describe('FlowChart', () => {
  let component: FlowChart;
  let fixture: ComponentFixture<FlowChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlowChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlowChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
