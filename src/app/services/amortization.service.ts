import { Injectable } from '@angular/core';
import { Loan, PaymentSchedule, LoanSummary } from '../models/loan.model';

@Injectable({
    providedIn: 'root'
})
export class AmortizationService {
    constructor() { }

    /**
     * Calculates the monthly payment for a loan
     * @param principal - The loan amount
     * @param annualRate - Annual interest rate (as a percentage)
     * @param termMonths - Loan term in months
     * @returns Monthly payment amount
     */
    calculateMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
        const monthlyRate = (annualRate / 100) / 12;
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) 
            / (Math.pow(1 + monthlyRate, termMonths) - 1);
        return Number(payment.toFixed(2));
    }

    /**
     * Generates complete amortization schedule for a loan
     * @param loan - Loan details
     * @returns Array of payment schedule entries
     */
    generateAmortizationSchedule(loan: Loan): PaymentSchedule[] {
        const schedule: PaymentSchedule[] = [];
        const monthlyRate = (loan.annualInterestRate / 100) / 12;
        const monthlyPayment = this.calculateMonthlyPayment(
            loan.amount,
            loan.annualInterestRate,
            loan.termMonths
        );

        let balance = loan.amount;
        let totalInterest = 0;
        let currentDate = new Date(loan.startDate);

        for (let month = 1; month <= loan.termMonths && balance > 0; month++) {
            const interestPayment = balance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;
            let extraPayment = 0;

            // Handle extra payments
            if (loan.extraPayment && loan.extraPaymentFrequency) {
                if (loan.extraPaymentFrequency === 'monthly' ||
                    (loan.extraPaymentFrequency === 'one-time' && month === 1)) {
                    extraPayment = loan.extraPayment;
                    principalPayment += extraPayment;
                }
            }

            // Adjust final payment if needed
            if (principalPayment > balance) {
                principalPayment = balance;
            }

            balance -= principalPayment;
            totalInterest += interestPayment;

            schedule.push({
                paymentNumber: month,
                paymentDate: new Date(currentDate),
                payment: monthlyPayment,
                principal: Number(principalPayment.toFixed(2)),
                interest: Number(interestPayment.toFixed(2)),
                totalInterest: Number(totalInterest.toFixed(2)),
                remainingBalance: Number(balance.toFixed(2)),
                extraPayment: extraPayment > 0 ? Number(extraPayment.toFixed(2)) : undefined
            });

            // Move to next month
            currentDate.setMonth(currentDate.getMonth() + 1);
        }

        return schedule;
    }

    /**
     * Calculates loan summary including total payments, interest, etc.
     * @param loan - Loan details
     * @returns Loan summary
     */
    calculateLoanSummary(loan: Loan): LoanSummary {
        const schedule = this.generateAmortizationSchedule(loan);
        const lastPayment = schedule[schedule.length - 1];
        const monthlyPayment = this.calculateMonthlyPayment(
            loan.amount,
            loan.annualInterestRate,
            loan.termMonths
        );

        return {
            totalPayments: Number((monthlyPayment * schedule.length).toFixed(2)),
            totalInterest: lastPayment.totalInterest,
            monthlyPayment: monthlyPayment,
            totalPrincipal: loan.amount,
            payoffDate: lastPayment.paymentDate
        };
    }
} 