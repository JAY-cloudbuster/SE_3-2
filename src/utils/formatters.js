// Story 6.10: Indian Number Formatting [cite: 296, 297]
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Story 6.8: Success Audio [cite: 288]
export const playSuccessSound = () => {
  const audio = new Audio('/audio/success-chime.mp3');
  audio.play();
};