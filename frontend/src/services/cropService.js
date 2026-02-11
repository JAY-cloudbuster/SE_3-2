/**
 * @fileoverview Crop Service for AgriSahayak Frontend
 * 
 * This module provides functions for crop listing operations:
 * creating new listings, fetching the farmer's own crops,
 * and getting all marketplace crops.
 * 
 * All requests are authenticated via the JWT interceptor in api.js.
 * 
 * @module services/cropService
 * @requires services/api - Pre-configured Axios instance with auth interceptor
 * 
 * @see Epic 2, Story 2.4 - Add Crop Listing
 * @see Epic 2, Story 2.6 - View Crop Listings
 * @see controllers/cropController.js (backend) - Server-side handlers
 */

import api from './api';

/**
 * Crop Service Object
 * 
 * Exposes methods for all crop-related API operations.
 * Each method returns the full Axios response object.
 * 
 * @namespace cropService
 */
export const cropService = {
  /**
   * Create a New Crop Listing
   * 
   * Sends crop details to the backend to create a new listing.
   * The farmer's identity is determined from the JWT token (backend).
   * 
   * @async
   * @function create
   * @param {Object} data - Crop listing data
   * @param {string} data.name - Crop name (e.g., "Organic Wheat")
   * @param {number} data.quantity - Quantity in kg (1-200)
   * @param {number} data.price - Price per kg in ₹ (1-500)
   * @param {string} data.quality - Quality grade: 'A', 'B', or 'C'
   * @param {string} [data.description] - Optional description (max 500 chars)
   * @param {string} [data.location] - Crop location (defaults to farmer's location)
   * @returns {Promise<import('axios').AxiosResponse>} Response with created crop document
   * 
   * @see CropForm.jsx - Frontend component that calls this function
   * @see POST /api/crops - Backend endpoint
   */
  create: async (data) => {
    const response = await api.post('/crops', data);
    return response;
  },

  /**
   * Get Farmer's Own Crop Listings
   * 
   * Retrieves all crop listings created by the currently authenticated farmer.
   * Results are sorted by newest first. Used by the Farmer Dashboard's
   * "My Harvest Inventory" section.
   * 
   * @async
   * @function getMyCrops
   * @returns {Promise<import('axios').AxiosResponse>} Response with array of crop documents
   * 
   * @see CropList.jsx - Frontend component that displays these results
   * @see GET /api/crops/my - Backend endpoint
   */
  getMyCrops: async () => {
    const response = await api.get('/crops/my');
    return response;
  },

  /**
   * Get All Available Crops (Marketplace)
   * 
   * Retrieves all available (unsold) crop listings for the marketplace.
   * Each crop includes populated farmer info (name, location, trustScore).
   * Results sorted by newest first.
   * 
   * @async
   * @function getAll
   * @returns {Promise<import('axios').AxiosResponse>} Response with array of crops + farmer data
   * 
   * @see FarmerMarketplace.jsx / CropCard.jsx - Frontend components
   * @see GET /api/crops - Backend endpoint
   */
  getAll: async () => {
    const response = await api.get('/crops');
    return response;
  }
};