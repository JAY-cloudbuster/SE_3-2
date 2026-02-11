/**
 * @fileoverview Indian Currency Label Component for AgriSahayak Frontend
 * 
 * Renders a formatted Indian Rupee (₹) amount using Intl.NumberFormat
 * with the 'en-IN' locale for proper lakh/crore grouping.
 * 
 * @component CurrencyLabel
 * @param {Object} props
 * @param {number} props.amount - Numeric amount to format
 * @param {string} [props.className] - CSS classes for the <span>
 * 
 * @see Epic 6, Story 6.10 - Indian Number Formatting
 * @see CropCard.jsx - Uses this for displaying crop prices
 */
export default function CurrencyLabel({ amount, className }) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount); // Story 6.10 [cite: 296]

  return <span className={className}>{formatted}</span>;
}