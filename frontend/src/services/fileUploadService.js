/**
 * @fileoverview File Upload Service for AgriSahayak Frontend
 * 
 * Provides helper functions for uploading files (images) to the backend
 * using FormData. Sets the correct Content-Type header for multipart uploads.
 * 
 * @module services/fileUploadService
 * @see Epic 2, Story 2.5 - Upload Crop Media
 */

import api from './api';

export const fileUploadService = {
    /**
     * Upload a crop image file
     * @param {File} file - The image file to upload
     * @returns {Promise<import('axios').AxiosResponse>} Response with file path
     */
    uploadCropImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        return api.post('/crops/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
