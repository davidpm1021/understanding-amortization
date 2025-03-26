import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInputFormComponent } from './loan-input-form.component';

describe('LoanInputFormComponent', () => {
  let component: LoanInputFormComponent;
  let fixture: ComponentFixture<LoanInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanInputFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
