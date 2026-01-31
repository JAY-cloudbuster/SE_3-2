import React, { createContext, useState, useEffect, useContext } from 'react';
import { translateText, preloadCommonTranslations } from '../services/translationService';

const TranslationContext = createContext();

// Supported Indian languages with their codes and native names
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

export const TranslationProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        // Load saved language or default to English
        return localStorage.getItem('appLanguage') || 'en';
    });
    const [isTranslating, setIsTranslating] = useState(false);

    // Save language preference when it changes
    useEffect(() => {
        localStorage.setItem('appLanguage', currentLanguage);

        // Preload common translations for better UX
        if (currentLanguage !== 'en') {
            setIsTranslating(true);
            preloadCommonTranslations(currentLanguage)
                .finally(() => setIsTranslating(false));
        }
    }, [currentLanguage]);

    /**
     * Translate a single text string
     * @param {string} text - Text to translate
     * @returns {Promise<string>} - Translated text
     */
    const t = async (text) => {
        if (!text) return '';
        return await translateText(text, currentLanguage);
    };

    /**
     * Change the current language
     * @param {string} langCode - Language code to switch to
     */
    const changeLanguage = (langCode) => {
        setCurrentLanguage(langCode);
    };

    const value = {
        currentLanguage,
        changeLanguage,
        t,
        isTranslating,
        languages: SUPPORTED_LANGUAGES,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

/**
 * Hook to use translation in components
 * @returns {Object} Translation context
 */
export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within TranslationProvider');
    }
    return context;
};

/**
 * Higher-order component to translate text automatically
 * Usage: <T>Hello World</T> will translate "Hello World"
 */
export const T = ({ children }) => {
    const { t, currentLanguage } = useTranslation();
    const [translated, setTranslated] = useState(children);

    useEffect(() => {
        if (currentLanguage === 'en') {
            setTranslated(children);
        } else {
            t(children).then(setTranslated);
        }
    }, [children, currentLanguage, t]);

    return <>{translated}</>;
};
