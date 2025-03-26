# Project Memory

## Project Overview
A loan amortization calculator built with Angular that helps users understand their loan payments, including the impact of extra payments.

## Current Status
- ✅ Basic loan calculator functionality
- ✅ Extra payment support (monthly and one-time)
- ✅ Amortization schedule display
- ✅ Responsive design
- ✅ Modern UI with clean styling
- ✅ GitHub Pages deployment setup

## Recent Changes
- Changed "Payment #" column header to "Month" in amortization table
- Increased default display to 24 payments (2 years)
- Set up GitHub Pages deployment configuration
- Added deployment scripts to package.json

## Next Steps
1. Deploy to GitHub Pages
2. Add dark mode support
3. Enhance accessibility
4. Add advanced features:
   - Loan comparison
   - Bi-weekly payment option
   - Early payoff calculator
5. Improve visualizations
6. Performance optimization

## Technical Details
- Built with Angular 17
- Uses Chart.js for visualizations
- Deployed via GitHub Pages
- Base URL: /understanding-amortization/

## Deployment Instructions
1. Build the project: `npm run build`
2. Deploy to GitHub Pages: `npm run deploy`
3. Configure GitHub repository settings:
   - Enable GitHub Pages
   - Set source to gh-pages branch
   - Set custom domain if needed

## Notes
- The application is now ready for GitHub Pages deployment
- The amortization table is the main focus of the interface
- Form collapses automatically after calculation
- Summary information is displayed in a wide bar 