import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionError } from './connection-error';

describe('ConnectionError', () => {
  let component: ConnectionError;
  let fixture: ComponentFixture<ConnectionError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionError]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
