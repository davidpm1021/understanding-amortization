export interface Loan {
    amount: number;
    annualInterestRate: number;
    termMonths: number;
    startDate: Date;
    extraPayment?: number;
    extraPaymentFrequency?: 'one-time' | 'monthly';
}

export interface PaymentSchedule {
    paymentDate: Date;
    paymentNumber: number;
    payment: number;
    principal: number;
    interest: number;
    totalInterest: number;
    remainingBalance: number;
    extraPayment?: number;
}

export interface LoanSummary {
    totalPayments: number;
    totalInterest: number;
    monthlyPayment: number;
    totalPrincipal: number;
    payoffDate: Date;
} 