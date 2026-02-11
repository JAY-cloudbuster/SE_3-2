/**
 * @fileoverview Utility Formatters for AgriSahayak Frontend
 * 
 * This module provides common formatting and feedback utility functions
 * used across the application. Includes Indian currency formatting
 * and audio feedback functionality.
 * 
 * @module utils/formatters
 * 
 * @see Epic 6, Story 6.10 - Indian Number Formatting
 * @see Epic 6, Story 6.6 - Audio Feedback on Success
 */

/**
 * Format a Number as Indian Currency (₹)
 * 
 * Converts a number to the Indian currency format using the
 * Internationalization API (Intl.NumberFormat). Follows the
 * Indian numbering system with lakhs and crores grouping.
 * 
 * Examples of Indian vs Western formatting:
 * - 1,00,000 (Indian) vs 100,000 (Western) for one lakh
 * - 10,00,000 (Indian) vs 1,000,000 (Western) for ten lakhs
 * 
 * @function formatCurrency
 * @param {number} amount - Numeric amount to format
 * @returns {string} Formatted currency string with ₹ symbol
 * 
 * @example
 * formatCurrency(50000);    // Returns: '₹50,000'
 * formatCurrency(100000);   // Returns: '₹1,00,000'
 * formatCurrency(1500000);  // Returns: '₹15,00,000'
 * 
 * @see Epic 6, Story 6.10 - Indian Number Formatting
 * @see CurrencyLabel.jsx - Component that uses this function
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',     // Format as currency (adds symbol)
    currency: 'INR',       // Indian Rupee
    maximumFractionDigits: 0 // No decimal places for whole rupee amounts
  }).format(amount);
};

/**
 * Play Success Sound Effect
 * 
 * Plays a short audio feedback sound when an operation succeeds
 * (e.g., placing an order, saving a crop listing, completing a negotiation).
 * 
 * Uses a success sound from the public assets directory.
 * Audio playback errors are silently caught (e.g., if autoplay is blocked
 * by browser policies before user interaction).
 * 
 * @function playSuccessSound
 * @returns {void}
 * 
 * @see Epic 6, Story 6.6 - Audio Cue for Successful Trade
 * @see SuccessAudio.jsx - Component wrapper for this functionality
 */
export const playSuccessSound = () => {
  try {
    // Create a new Audio element with the success sound file
    const audio = new Audio('/sounds/success.mp3');
    // Attempt to play the sound (returns a Promise)
    audio.play().catch(() => { }); // Silently handle autoplay policy blocks
  } catch (e) {
    // Ignore errors (e.g., Audio API not available)
  }
};