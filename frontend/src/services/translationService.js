/**
 * @fileoverview Translation Service for AgriSahayak Frontend
 * 
 * This module provides real-time text translation functionality using
 * the Google Translate API (via a free endpoint). It enables the platform
 * to dynamically translate all UI text from English to any of the
 * 13 supported Indian languages.
 * 
 * Key features:
 * - Single text translation with localStorage caching
 * - Batch translation with rate limiting (50ms delay between requests)
 * - Cache management (clear by language or all)
 * - Common string preloading for faster initial UI rendering
 * 
 * Caching Strategy:
 * Translations are cached in localStorage with keys formatted as:
 * `translate_{langCode}_{originalText}` (e.g., "translate_hi_Dashboard")
 * This avoids redundant API calls for previously translated strings.
 * 
 * @module services/translationService
 * 
 * @see Epic 6, Story 6.1 - Persist Interface Language
 * @see Epic 6, Story 6.2 - Dynamic Translation
 * @see context/TranslationContext.jsx - Context that consumes this service
 * @see components/common/LanguageSelector.jsx - UI for language switching
 */

/**
 * Translate a Single Text String
 * 
 * Translates the given English text to the target language using
 * the Google Translate API. Implements a caching layer via localStorage
 * to avoid redundant API calls for previously translated strings.
 * 
 * Translation flow:
 * 1. If target is English → return original text (no API call)
 * 2. Check localStorage cache → return cached translation if found
 * 3. Call Google Translate API → cache result → return translation
 * 4. On error → fallback to original English text
 * 
 * @async
 * @function translateText
 * @param {string} text - English text to translate
 * @param {string} targetLang - Target language code (e.g., 'hi', 'bn', 'te', 'mr')
 * @returns {Promise<string>} Translated text (or original text on failure)
 * 
 * @example
 * const hindi = await translateText('Dashboard', 'hi'); // Returns: 'डैशबोर्ड'
 * const same = await translateText('Hello', 'en');       // Returns: 'Hello' (no API call)
 */
export async function translateText(text, targetLang) {
    // English is the source language - no translation needed
    if (targetLang === 'en') {
        return text;
    }

    // Check localStorage cache to avoid redundant API calls
    // Cache key format: translate_{langCode}_{originalText}
    const cacheKey = `translate_${targetLang}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        return cached; // Return cached translation
    }

    try {
        // Call Google Translate API via the free gtx endpoint
        // Parameters:
        //   client=gtx  → Use the free Google Translate client
        //   sl=en       → Source language: English
        //   tl={lang}   → Target language code
        //   dt=t        → Return type: translation
        //   q={text}    → URL-encoded text to translate
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        // The Google Translate response structure:
        // data[0] = array of translation segments
        // data[0][0] = first segment
        // data[0][0][0] = translated text string
        const translated = data[0][0][0];

        // Store translation in localStorage cache for future use
        localStorage.setItem(cacheKey, translated);

        return translated;
    } catch (error) {
        // Log the error and gracefully degrade to original English text
        console.error('Translation error:', error);
        return text; // Fallback: return untranslated text
    }
}

/**
 * Translate Multiple Texts in Batch
 * 
 * Translates an array of English texts to the target language.
 * Implements basic rate limiting (50ms delay between requests)
 * to avoid being blocked by the Google Translate API.
 * 
 * Returns an object mapping original text → translated text
 * for easy lookup in components.
 * 
 * @async
 * @function translateBatch
 * @param {string[]} texts - Array of English texts to translate
 * @param {string} targetLang - Target language code (e.g., 'hi', 'ta')
 * @returns {Promise<Object>} Object mapping original text to translated text
 * 
 * @example
 * const translations = await translateBatch(['Hello', 'Price'], 'hi');
 * // Returns: { 'Hello': 'नमस्ते', 'Price': 'कीमत' }
 */
export async function translateBatch(texts, targetLang) {
    // If target is English, return identity mapping (no API calls needed)
    if (targetLang === 'en') {
        return texts.reduce((acc, text) => ({ ...acc, [text]: text }), {});
    }

    const translations = {};

    // Translate each text with staggered delays to prevent rate limiting
    // Each request is delayed by (index * 50)ms
    const promises = texts.map(async (text, index) => {
        // Stagger requests: 0ms, 50ms, 100ms, 150ms, etc.
        await new Promise(resolve => setTimeout(resolve, index * 50));
        const translated = await translateText(text, targetLang);
        translations[text] = translated;
    });

    // Wait for all translations to complete
    await Promise.all(promises);
    return translations;
}

/**
 * Clear Translation Cache
 * 
 * Removes cached translations from localStorage.
 * Can clear all cached translations or only those for a specific language.
 * 
 * Useful when:
 * - localStorage is getting too large
 * - Translation quality has been updated
 * - User wants to force fresh translations
 * 
 * @function clearTranslationCache
 * @param {string} [lang] - Optional language code to clear.
 *                           If omitted, clears ALL cached translations.
 * 
 * @example
 * clearTranslationCache('hi');   // Clear only Hindi translations
 * clearTranslationCache();       // Clear all translations
 */
export function clearTranslationCache(lang) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        // Only target keys that start with 'translate_'
        if (key.startsWith('translate_')) {
            // If a specific language is given, only clear that language's cache
            // Otherwise, clear all translation cache entries
            if (!lang || key.startsWith(`translate_${lang}_`)) {
                localStorage.removeItem(key);
            }
        }
    });
}

/**
 * Preload Common UI String Translations
 * 
 * Pre-fetches translations for frequently used UI strings
 * (navigation labels, buttons, form labels, status messages).
 * 
 * This is called when the user changes their language preference
 * (see TranslationContext.jsx). By pre-caching these translations,
 * the UI renders translated text instantly without visible delays.
 * 
 * @async
 * @function preloadCommonTranslations
 * @param {string} targetLang - Target language code to preload translations for
 * @returns {Promise<void>}
 * 
 * @see TranslationContext.jsx - Calls this on language change
 * @see Epic 6, Story 6.1 - Persist Interface Language
 */
export async function preloadCommonTranslations(targetLang) {
    // List of commonly displayed UI strings across the platform
    // These are translated first to minimize visible English text flashes
    const commonStrings = [
        'Dashboard',      // Sidebar navigation
        'My Crops',       // Farmer dashboard section
        'Orders',         // Order management section
        'Profile',        // User profile section
        'Logout',         // Logout button
        'Buy Now',        // Purchase button
        'Place Bid',      // Auction bid button
        'Negotiate',      // Negotiation button
        'Price',          // Crop listing field
        'Quantity',       // Crop listing field
        'Quality',        // Crop listing field
        'Submit',         // Form button
        'Cancel',         // Form button
        'Save',           // Form button
        'Edit',           // Action button
        'Delete',         // Action button
        'Search',         // Search functionality
        'Filter',         // Filter functionality
        'Sort',           // Sort functionality
        'Loading...',     // Loading state
        'Success!',       // Success notification
        'Error',          // Error notification
        'Confirm',        // Confirmation dialog
        'Back',           // Navigation button
        'Next',           // Navigation button
    ];

    // Batch translate all common strings (with rate limiting)
    await translateBatch(commonStrings, targetLang);
}
