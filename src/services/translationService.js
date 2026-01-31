// Google Translate API Integration for Dynamic Translation
// This uses the free Google Translate API via a proxy to avoid CORS issues

/**
 * Translates text from English to the target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'hi', 'bn', 'te')
 * @returns {Promise<string>} - Translated text
 */
export async function translateText(text, targetLang) {
    // If target is English, return original text
    if (targetLang === 'en') {
        return text;
    }

    // Check cache first
    const cacheKey = `translate_${targetLang}_${text}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        return cached;
    }

    try {
        // Using Google Translate API via free endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Extract translated text from response
        const translated = data[0][0][0];

        // Cache the translation
        localStorage.setItem(cacheKey, translated);

        return translated;
    } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original text if translation fails
        return text;
    }
}

/**
 * Translates multiple texts in batch
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} - Object mapping original text to translated text
 */
export async function translateBatch(texts, targetLang) {
    if (targetLang === 'en') {
        return texts.reduce((acc, text) => ({ ...acc, [text]: text }), {});
    }

    const translations = {};

    // Translate in parallel with rate limiting
    const promises = texts.map(async (text, index) => {
        // Add small delay to avoid rate limiting (50ms between requests)
        await new Promise(resolve => setTimeout(resolve, index * 50));
        const translated = await translateText(text, targetLang);
        translations[text] = translated;
    });

    await Promise.all(promises);
    return translations;
}

/**
 * Clears translation cache for a specific language or all languages
 * @param {string} [lang] - Language code to clear, or undefined to clear all
 */
export function clearTranslationCache(lang) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('translate_')) {
            if (!lang || key.startsWith(`translate_${lang}_`)) {
                localStorage.removeItem(key);
            }
        }
    });
}

/**
 * Preloads common UI strings for better performance
 * @param {string} targetLang - Target language code
 */
export async function preloadCommonTranslations(targetLang) {
    const commonStrings = [
        'Dashboard',
        'My Crops',
        'Orders',
        'Profile',
        'Logout',
        'Buy Now',
        'Place Bid',
        'Negotiate',
        'Price',
        'Quantity',
        'Quality',
        'Submit',
        'Cancel',
        'Save',
        'Edit',
        'Delete',
        'Search',
        'Filter',
        'Sort',
        'Loading...',
        'Success!',
        'Error',
        'Confirm',
        'Back',
        'Next',
    ];

    await translateBatch(commonStrings, targetLang);
}
