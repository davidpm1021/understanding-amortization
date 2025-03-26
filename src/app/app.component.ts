import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface Payment {
  paymentNumber: number;
  paymentAmount: number;
  principal: number;
  interest: number;
  extraPayment?: number;
  totalPayment: number;
  remainingBalance: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('paymentChart') paymentChartCanvas!: ElementRef;
  @ViewChild('balanceChart') balanceChartCanvas!: ElementRef;

  // Charts
  paymentChart?: Chart;
  balanceChart?: Chart;

  // Form state
  isCalculating: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  // Pagination
  readonly rowsPerPage = 24;
  displayedRows = this.rowsPerPage;

  // Loan data
  loanAmount: number = 0;
  interestRate: number = 0;
  loanTerm: number = 0;
  monthlyPayment: number = 0;
  totalPayment: number = 0;
  totalInterest: number = 0;
  amortizationSchedule: Payment[] = [];
  monthlyExtraPayment: number = 0;
  oneTimeExtraPayment: number = 0;
  oneTimeExtraPaymentMonth: number = 1;
  payoffDate?: Date;
  totalSaved?: number;

  // Theme
  private currentTheme: 'light' | 'dark' = 'light';

  isFormVisible = true;

  ngOnInit() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme as 'light' | 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.setTheme(prefersDark.matches ? 'dark' : 'light');
      
      // Listen for system theme changes
      prefersDark.addEventListener('change', (e) => {
        this.setTheme(e.matches ? 'dark' : 'light');
      });
    }
  }

  ngAfterViewInit() {
    this.initializeCharts();
  }

  calculateLoan() {
    if (!this.isValidInput()) {
      return;
    }

    this.isCalculating = true;
    this.hasError = false;
    this.errorMessage = '';

    try {
      const monthlyRate = (this.interestRate / 100) / 12;
      const numberOfPayments = this.loanTerm * 12;
      const monthlyPayment = this.calculateMonthlyPayment(this.loanAmount, monthlyRate, numberOfPayments);

      this.monthlyPayment = monthlyPayment;
      this.generateAmortizationSchedule(monthlyRate, numberOfPayments);

      this.totalPayment = this.amortizationSchedule.reduce((sum, payment) => sum + payment.totalPayment, 0);
      this.totalInterest = this.totalPayment - this.loanAmount;

      // Calculate payoff date and savings
      const originalPayments = numberOfPayments;
      const actualPayments = this.amortizationSchedule.filter(p => p.remainingBalance > 0).length;
      const monthsSaved = originalPayments - actualPayments;
      
      this.payoffDate = new Date();
      this.payoffDate.setMonth(this.payoffDate.getMonth() + actualPayments);
      
      const originalTotalPayment = this.monthlyPayment * numberOfPayments;
      this.totalSaved = originalTotalPayment - this.totalPayment;

      this.resetDisplayedRows();
      this.updateCharts();
      
      // Automatically collapse the form after calculation
      this.isFormVisible = false;
    } catch (error) {
      this.hasError = true;
      this.errorMessage = 'An error occurred while calculating the loan. Please check your inputs.';
    } finally {
      this.isCalculating = false;
    }
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, numberOfPayments: number): number {
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) 
      / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  }

  private generateAmortizationSchedule(monthlyRate: number, numberOfPayments: number) {
    this.amortizationSchedule = [];
    let remainingBalance = this.loanAmount;

    for (let i = 1; i <= numberOfPayments && remainingBalance > 0; i++) {
      const interest = remainingBalance * monthlyRate;
      let principal = this.monthlyPayment - interest;
      let extraPayment = 0;

      // Handle extra payments
      if (this.monthlyExtraPayment > 0) {
        extraPayment = this.monthlyExtraPayment;
        principal += extraPayment;
      }

      if (i === this.oneTimeExtraPaymentMonth && this.oneTimeExtraPayment > 0) {
        extraPayment += this.oneTimeExtraPayment;
        principal += this.oneTimeExtraPayment;
      }

      // Adjust final payment if needed
      if (principal > remainingBalance) {
        principal = remainingBalance;
      }

      remainingBalance -= principal;

      this.amortizationSchedule.push({
        paymentNumber: i,
        paymentAmount: this.monthlyPayment,
        principal,
        interest,
        extraPayment: extraPayment > 0 ? extraPayment : undefined,
        totalPayment: this.monthlyPayment + extraPayment,
        remainingBalance
      });
    }
  }

  private isValidInput(): boolean {
    if (!this.loanAmount || this.loanAmount < 1000 || this.loanAmount > 10000000) {
      this.hasError = true;
      this.errorMessage = 'Loan amount must be between $1,000 and $10,000,000';
      return false;
    }

    if (!this.interestRate || this.interestRate < 0.1 || this.interestRate > 30) {
      this.hasError = true;
      this.errorMessage = 'Interest rate must be between 0.1% and 30%';
      return false;
    }

    if (!this.loanTerm || this.loanTerm < 1 || this.loanTerm > 40) {
      this.hasError = true;
      this.errorMessage = 'Loan term must be between 1 and 40 years';
      return false;
    }

    if (this.monthlyExtraPayment < 0) {
      this.hasError = true;
      this.errorMessage = 'Monthly extra payment cannot be negative';
      return false;
    }

    if (this.oneTimeExtraPayment < 0) {
      this.hasError = true;
      this.errorMessage = 'One-time extra payment cannot be negative';
      return false;
    }

    if (this.oneTimeExtraPaymentMonth < 1 || this.oneTimeExtraPaymentMonth > this.loanTerm * 12) {
      this.hasError = true;
      this.errorMessage = 'One-time extra payment month must be within the loan term';
      return false;
    }

    return true;
  }

  loadMoreRows() {
    this.displayedRows = Math.min(this.displayedRows + this.rowsPerPage, this.amortizationSchedule.length);
  }

  resetDisplayedRows() {
    this.displayedRows = this.rowsPerPage;
  }

  private getChartColors() {
    return {
      backgroundColor: this.currentTheme === 'dark' 
        ? ['#3b82f6', '#ef4444'] // Dark theme colors
        : ['#2563eb', '#dc2626'], // Light theme colors
      borderColor: this.currentTheme === 'dark' 
        ? '#3b82f6' 
        : '#2563eb'
    };
  }

  private createPaymentChart() {
    if (this.paymentChartCanvas) {
      const ctx = this.paymentChartCanvas.nativeElement.getContext('2d');
      const colors = this.getChartColors();
      this.paymentChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal', 'Interest'],
          datasets: [{
            data: [this.loanAmount, this.totalInterest],
            backgroundColor: colors.backgroundColor
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Payment Breakdown'
            }
          }
        }
      });
    }
  }

  private createBalanceChart() {
    if (this.balanceChartCanvas) {
      const ctx = this.balanceChartCanvas.nativeElement.getContext('2d');
      const colors = this.getChartColors();
      const labels = this.amortizationSchedule.map(p => p.paymentNumber);
      const balanceData = this.amortizationSchedule.map(p => p.remainingBalance);

      this.balanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Remaining Balance',
            data: balanceData,
            borderColor: colors.borderColor,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Balance Over Time'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  private initializeCharts() {
    this.createPaymentChart();
    this.createBalanceChart();
  }

  private updateCharts() {
    if (this.paymentChart) {
      const colors = this.getChartColors();
      this.paymentChart.data.datasets[0].data = [
        this.loanAmount,
        this.totalInterest
      ];
      this.paymentChart.data.datasets[0].backgroundColor = colors.backgroundColor;
      this.paymentChart.update();
    }

    if (this.balanceChart) {
      const colors = this.getChartColors();
      this.balanceChart.data.labels = this.amortizationSchedule.map(p => p.paymentNumber);
      this.balanceChart.data.datasets[0].data = this.amortizationSchedule.map(p => p.remainingBalance);
      this.balanceChart.data.datasets[0].borderColor = colors.borderColor;
      this.balanceChart.update();
    }
  }

  private setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update charts if they exist
    if (this.paymentChart) {
      const colors = this.getChartColors();
      this.paymentChart.data.datasets[0].backgroundColor = colors.backgroundColor;
      this.paymentChart.update();
    }
    
    if (this.balanceChart) {
      const colors = this.getChartColors();
      this.balanceChart.data.datasets[0].borderColor = colors.borderColor;
      this.balanceChart.update();
    }
  }

  exportAmortizationSchedule() {
    const headers = ['Payment #', 'Payment Amount', 'Principal', 'Interest', 'Extra Payment', 'Total Payment', 'Remaining Balance'];
    const data = this.amortizationSchedule.map(payment => [
      payment.paymentNumber,
      payment.paymentAmount.toFixed(2),
      payment.principal.toFixed(2),
      payment.interest.toFixed(2),
      (payment.extraPayment || 0).toFixed(2),
      payment.totalPayment?.toFixed(2),
      payment.remainingBalance.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `amortization_schedule_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  getProgress(): number {
    if (!this.amortizationSchedule.length) return 0;
    const initialBalance = this.loanAmount;
    const currentBalance = this.amortizationSchedule[this.amortizationSchedule.length - 1].remainingBalance;
    return ((initialBalance - currentBalance) / initialBalance) * 100;
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
}
