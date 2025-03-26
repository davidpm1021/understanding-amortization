# Web-Based Amortization Calculator – Project Plan

## 1. Overview
This amortization calculator will be a web-based interactive tool designed for high school personal finance students. It will allow students to:

- Enter loan details (amount, interest rate, term)
- View a detailed amortization schedule
- Adjust extra payments and see how they impact total interest and repayment time
- Use interactive graphs to visualize loan repayment
- Follow 508-compliant accessibility standards to ensure full usability

This tool is self-contained, meaning no need for downloads, teacher modifications, or saved scenarios—just a simple, effective educational calculator.

## 2. Core Functionality

### Loan Inputs
- Loan Amount ($)
- Annual Interest Rate (%)
- Loan Term (Months/Years)
- Start Date (Calendar Picker)
- Monthly Payment Calculation
- Extra Payment Option (One-time or Recurring)

### Amortization Schedule (Dynamic Table)
Month-by-month breakdown:
- Payment Date
- Monthly Payment
- Principal Paid
- Interest Paid
- Total Interest Paid to Date
- Remaining Balance
- Live Updates: Any change in input updates calculations immediately

### Extra Payment Scenarios:
- How does adding an extra payment affect the loan?
- How do smaller or larger payments change the payoff timeline?

### Visualizations
- Pie Chart – Principal vs. Interest Breakdown
- Line Chart – Loan Balance Over Time
- Bar Chart – Monthly Interest Paid

## 3. Accessibility (508 Compliance)
This tool will follow WCAG 2.1 Level AA standards for accessibility.

### Keyboard & Screen Reader Support
- Fully keyboard-navigable (Tab, Enter, Space)
- ARIA Labels on all form fields and buttons
- Visible Focus Indicators for easy navigation

### Color Contrast & Readability
- High-contrast mode for better visibility
- Readable fonts with resizable text options
- No color-dependent information (important for colorblind users)

### Input & Form Usability
- Clear labels and tooltips explaining terms like "Principal" and "Interest"
- Error Handling:
  - Prevents negative or invalid inputs
  - Provides clear error messages (e.g., "Please enter a valid interest rate")

## 4. User Experience (UX)
- Simple, clean interface with intuitive inputs
- No clutter—just essential fields and results
- Works across devices (desktop, tablet, mobile)
- Dark Mode Toggle for eye strain reduction

## 5. Tech Stack

### Frontend
- Framework: Angular (for real-time calculations)
- UI Library: Angular Material (pre-built accessible components)
- Charts: Chart.js (for graphs)
- Date Picker: Angular Material Datepicker

### Backend
- None required—everything will be computed client-side

### Deployment
- Hosting: GitHub Pages
- Performance Optimizations: Fast-loading, minimal dependencies 