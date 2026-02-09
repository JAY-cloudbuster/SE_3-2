export default function CurrencyLabel({ amount, className }) {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount); // Story 6.10 [cite: 296]

  return <span className={className}>{formatted}</span>;
}