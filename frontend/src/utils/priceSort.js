/**
 * @fileoverview Price Sorting Utility for AgriSahayak Frontend
 * 
 * This module provides a helper function for sorting crop listings
 * by price. Used in marketplace views to allow buyers to sort
 * crops from highest to lowest price (or vice versa).
 * 
 * @module utils/priceSort
 * 
 * @see Epic 3, Story 3.7 - Sort / Filter Crops by Price
 */

/**
 * Sort an Array of Items by Price
 * 
 * Creates a new sorted array (does not mutate the original)
 * by price in the specified direction.
 * 
 * Uses the spread operator `[...data]` to create a shallow copy
 * before sorting, preserving the original array's order.
 * 
 * @function sortByPrice
 * @param {Array<{price: number}>} data - Array of objects with a `price` property
 * @param {string} [direction='desc'] - Sort direction: 'desc' (highest first) or 'asc' (lowest first)
 * @returns {Array<{price: number}>} New sorted array
 * 
 * @example
 * const crops = [{ price: 30 }, { price: 10 }, { price: 50 }];
 * sortByPrice(crops, 'asc');  // Returns: [{ price: 10 }, { price: 30 }, { price: 50 }]
 * sortByPrice(crops, 'desc'); // Returns: [{ price: 50 }, { price: 30 }, { price: 10 }]
 * sortByPrice(crops);         // Returns: [{ price: 50 }, { price: 30 }, { price: 10 }] (default: desc)
 */
export const sortByPrice = (data, direction = 'desc') => {
  return [...data].sort((a, b) => {
    // Descending: higher price first (b - a), Ascending: lower price first (a - b)
    return direction === 'desc' ? b.price - a.price : a.price - b.price;
  });
};