import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultCaptureComponent } from './result-capture.component';

describe('ResultCaptureComponent', () => {
  let component: ResultCaptureComponent;
  let fixture: ComponentFixture<ResultCaptureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCaptureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
