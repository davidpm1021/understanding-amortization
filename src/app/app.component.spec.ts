import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Loan Calculations', () => {
    it('should calculate a basic loan without extra payments', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(856.07, 2);
      expect(component.totalInterest).toBeCloseTo(272.84, 2);
      expect(component.totalPayment).toBeCloseTo(10272.84, 2);
      expect(component.monthsToPayoff).toBe(12);
    });

    it('should handle zero interest rate', () => {
      component.loanAmount = 10000;
      component.interestRate = 0;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(833.33, 2);
      expect(component.totalInterest).toBe(0);
      expect(component.totalPayment).toBe(10000);
      expect(component.monthsToPayoff).toBe(12);
    });

    it('should handle high interest rate', () => {
      component.loanAmount = 10000;
      component.interestRate = 24;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(945.60, 2);
      expect(component.totalInterest).toBeCloseTo(1347.20, 2);
      expect(component.totalPayment).toBeCloseTo(11347.20, 2);
      expect(component.monthsToPayoff).toBe(12);
    });
  });

  describe('Extra Payments', () => {
    it('should handle monthly extra payments', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.monthlyExtraPayment = 100;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(856.07, 2);
      expect(component.totalInterest).toBeLessThan(272.84); // Should be less than without extra payments
      expect(component.totalPayment).toBeLessThan(10272.84); // Should be less than without extra payments
      expect(component.monthsToPayoff).toBeLessThan(12); // Should pay off early
    });

    it('should handle one-time extra payment', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.oneTimeExtraPayment = 1000;
      component.oneTimeExtraPaymentMonth = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(856.07, 2);
      expect(component.totalInterest).toBeLessThan(272.84); // Should be less than without extra payments
      expect(component.totalPayment).toBeLessThan(10272.84); // Should be less than without extra payments
      expect(component.monthsToPayoff).toBeLessThan(12); // Should pay off early
    });

    it('should handle both monthly and one-time extra payments', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.monthlyExtraPayment = 100;
      component.oneTimeExtraPayment = 1000;
      component.oneTimeExtraPaymentMonth = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(856.07, 2);
      expect(component.totalInterest).toBeLessThan(272.84); // Should be less than without extra payments
      expect(component.totalPayment).toBeLessThan(10272.84); // Should be less than without extra payments
      expect(component.monthsToPayoff).toBeLessThan(12); // Should pay off early
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small loan amount', () => {
      component.loanAmount = 100;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(8.56, 2);
      expect(component.totalInterest).toBeCloseTo(2.73, 2);
      expect(component.totalPayment).toBeCloseTo(102.73, 2);
      expect(component.monthsToPayoff).toBe(12);
    });

    it('should handle very large loan amount', () => {
      component.loanAmount = 1000000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(85607.45, 2);
      expect(component.totalInterest).toBeCloseTo(272894.37, 2);
      expect(component.totalPayment).toBeCloseTo(1272894.37, 2);
      expect(component.monthsToPayoff).toBe(12);
    });

    it('should handle very long loan term', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = 30;
      component.calculateLoan();

      expect(component.monthlyPayment).toBeCloseTo(53.68, 2);
      expect(component.totalInterest).toBeCloseTo(9324.80, 2);
      expect(component.totalPayment).toBeCloseTo(19324.80, 2);
      expect(component.monthsToPayoff).toBe(360);
    });

    it('should handle extra payment larger than remaining balance', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.oneTimeExtraPayment = 20000; // Larger than loan amount
      component.oneTimeExtraPaymentMonth = 1;
      component.calculateLoan();

      expect(component.totalPayment).toBeLessThanOrEqual(component.loanAmount + component.totalInterest);
      expect(component.monthsToPayoff).toBe(1); // Should pay off immediately
    });
  });

  describe('Input Validation', () => {
    it('should not calculate with negative loan amount', () => {
      component.loanAmount = -1000;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.hasError).toBeTrue();
      expect(component.errorMessage).toContain('Please enter a positive loan amount');
    });

    it('should not calculate with negative interest rate', () => {
      component.loanAmount = 10000;
      component.interestRate = -5;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.hasError).toBeTrue();
      expect(component.errorMessage).toContain('Please enter a positive interest rate');
    });

    it('should not calculate with negative loan term', () => {
      component.loanAmount = 10000;
      component.interestRate = 5;
      component.loanTerm = -1;
      component.calculateLoan();

      expect(component.hasError).toBeTrue();
      expect(component.errorMessage).toContain('Please enter a positive loan term');
    });

    it('should not calculate with zero loan amount', () => {
      component.loanAmount = 0;
      component.interestRate = 5;
      component.loanTerm = 1;
      component.calculateLoan();

      expect(component.hasError).toBeTrue();
      expect(component.errorMessage).toContain('Please enter a positive loan amount');
    });
  });
});
