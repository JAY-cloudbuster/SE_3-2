/**
 * @fileoverview Translation Context Provider for AgriSahayak Frontend
 * 
 * This module is the central hub for the multilingual translation system.
 * It manages the current language preference, provides translation functions
 * to all components, and includes the `<T>` component for automatic
 * text translation in JSX.
 * 
 * Architecture:
 * ┌─────────────────────────┐
 * │  TranslationProvider    │ ← Wraps entire app (App.jsx)
 * │  ├── currentLanguage    │ ← Current language code (persisted in localStorage)
 * │  ├── changeLanguage()   │ ← Switch language (used by LanguageSelector)
 * │  ├── t()                │ ← Translate a string (async)
 * │  ├── isTranslating      │ ← Loading indicator during translation
 * │  └── languages          │ ← List of supported languages
 * └─────────────────────────┘
 * 
 * The `<T>` component allows declarative translation in JSX:
 *   <T>Hello World</T> → renders translated text based on current language
 * 
 * Supported Languages: English, Hindi, Bengali, Telugu, Marathi, Tamil,
 * Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu (13 total)
 * 
 * @module context/TranslationContext
 * @requires react - React hooks for state management
 * @requires services/translationService - Google Translate API integration
 * 
 * @see Epic 1, Story 1.3 - Select Preferred Language
 * @see Epic 6, Story 6.1 - Persist Interface Language
 * @see Epic 6, Story 6.2 - Dynamic Translation
 */

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { translateText, preloadCommonTranslations } from '../services/translationService';

/**
 * TranslationContext - React Context for translation state and functions.
 * 
 * Not exported directly — use the `useTranslation()` hook instead.
 * @type {React.Context}
 */
const TranslationContext = createContext();

/**
 * Supported Languages Configuration
 * 
 * Array of language objects representing all 13 Indian languages
 * supported by the platform. Each object contains:
 * - code: ISO 639-1 language code (used for API calls and storage)
 * - name: English name of the language
 * - nativeName: Language name in its own script (shown in LanguageSelector)
 * 
 * @constant {Array<{code: string, name: string, nativeName: string}>}
 * @see Epic 1, Story 1.3 - Language selection during registration
 * @see LanguageSelector.jsx - Dropdown that uses this array
 */
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
];

/**
 * TranslationProvider Component
 * 
 * Top-level context provider that wraps the entire application.
 * Manages the current language state, persists it to localStorage,
 * and preloads common translations when the language changes.
 * 
 * Provider hierarchy (in App.jsx):
 * AuthProvider → TranslationProvider → LanguageProvider → SocketProvider
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} TranslationContext.Provider wrapping children
 */
export const TranslationProvider = ({ children }) => {
    /**
     * Current language code - initialized from localStorage
     * Falls back to 'en' (English) if no saved preference exists.
     * @type {string}
     */
    const [currentLanguage, setCurrentLanguage] = useState('en');

    /**
     * Translation loading indicator.
     * True while common strings are being preloaded after a language change.
     * Can be used by components to show a loading spinner during translation.
     * @type {boolean}
     */
    const [isTranslating, setIsTranslating] = useState(false);

    /**
     * Effect: Persist Language & Preload Translations
     * 
     * Runs whenever the current language changes:
     * 1. Saves the language code to localStorage for persistence
     * 2. If non-English, preloads common UI strings for faster rendering
     * 
     * @see preloadCommonTranslations() in translationService.js
     */
    useEffect(() => {
        // Save the selected language to localStorage for session persistence
        localStorage.setItem('appLanguage', currentLanguage);

        // Preload common translations for non-English languages
        // This ensures navigation items, buttons, etc. translate instantly
        if (currentLanguage !== 'en') {
            setIsTranslating(true);
            preloadCommonTranslations(currentLanguage)
                .finally(() => setIsTranslating(false));
        }
    }, [currentLanguage]);

    /**
     * Translate Function (t)
     * 
     * Translates a single English string to the current language.
     * Uses the translation service which handles caching internally.
     * 
     * @async
     * @param {string} text - English text to translate
     * @returns {Promise<string>} Translated text
     * 
     * @example
     * const translated = await t('Dashboard'); // Returns 'डैशबोर्ड' (in Hindi)
     */
    const t = async (text) => {
        if (!text) return '';
        return await translateText(text, currentLanguage);
    };

    /**
     * Change Language Function
     * 
     * Updates the current language, triggering:
     * 1. localStorage update (persistence)
     * 2. Common string preloading (for non-English)
     * 3. Re-render of all <T> components
     * 
     * Wrapped in useCallback to prevent unnecessary re-renders.
     * 
     * @function
     * @param {string} langCode - Language code to switch to (e.g., 'hi', 'ta')
     * @see LanguageSelector.jsx - Component that calls this function
     */
    const changeLanguage = useCallback((langCode) => {
        setCurrentLanguage(langCode);
    }, []);

    // Context value object providing all translation functionality
    const value = {
        currentLanguage,   // Current language code string
        changeLanguage,    // Function to switch language
        t,                 // Async translate function
        isTranslating,     // Boolean loading indicator
        languages: SUPPORTED_LANGUAGES, // Array of supported languages
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

/**
 * useTranslation Hook
 * 
 * Custom React hook for accessing the translation context.
 * Must be called from within a component wrapped by TranslationProvider.
 * Throws an error if used outside the provider (helps catch setup issues).
 * 
 * @function useTranslation
 * @returns {Object} Translation context value
 * @returns {string} returns.currentLanguage - Current language code
 * @returns {Function} returns.changeLanguage - Function to change language
 * @returns {Function} returns.t - Async translation function
 * @returns {boolean} returns.isTranslating - Loading indicator
 * @returns {Array} returns.languages - List of supported languages
 * 
 * @example
 * const { t, currentLanguage, changeLanguage } = useTranslation();
 * const translated = await t('Hello'); // Translates based on current language
 */
export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider');
    }
    return context;
};

/**
 * T Component - Declarative Translation Wrapper
 * 
 * A React component that automatically translates its children text.
 * Provides a clean, declarative way to mark text for translation
 * without manually calling the t() function in every component.
 * 
 * When the language changes, this component automatically re-translates
 * its content and updates the rendered text.
 * 
 * For English, it renders the original text without any API call.
 * For other languages, it renders the translated text after the API responds.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.children - English text to translate
 * @returns {JSX.Element} Fragment containing the translated text
 * 
 * @example
 * // In a component's JSX:
 * <h1><T>Welcome to AgriSahayak</T></h1>
 * // Renders: <h1>AgriSahayak में आपका स्वागत है</h1> (in Hindi)
 * 
 * @see Epic 6, Story 6.2 - Dynamic Translation
 */
export const T = ({ children }) => {
    const { t, currentLanguage } = useTranslation();
    const [translated, setTranslated] = useState(children);

    useEffect(() => {
        if (currentLanguage === 'en') {
            // English: use original text directly (no API call)
            setTranslated(children);
        } else {
            // Non-English: translate via Google Translate API
            t(children).then(setTranslated);
        }
    }, [children, currentLanguage, t]);

    // Render the translated (or original) text inside a Fragment
    return <>{translated}</>;
};
