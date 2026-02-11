import React, { useState, useEffect } from 'react';
import { useTranslation, T } from '../../context/TranslationContext';

/**
 * @fileoverview TranslatedText Component & useTranslate Hook for AgriSahayak
 * 
 * Provides two utilities for text translation:
 * 1. TranslatedText component - Wrapped version of <T> with loading opacity
 * 2. useTranslate hook - Returns the async t() function for imperative use
 * 
 * The TranslatedText component is similar to the <T> component from
 * TranslationContext but adds a loading state (opacity change) while
 * translation is in progress. Use this when you need visual feedback.
 * 
 * For simpler use cases, prefer the <T> component from TranslationContext.
 * 
 * @component TranslatedText
 * @param {Object} props
 * @param {string} props.children - English text to translate
 * @param {string} [props.className=''] - Additional CSS classes
 * 
 * @see Epic 6, Story 6.2 - Dynamic Translation
 * @see TranslationContext.jsx - Provides the <T> shorthand component
 */
export default function TranslatedText({ children, className = '' }) {
    const { t, currentLanguage } = useTranslation();
    const [translated, setTranslated] = useState(children);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (currentLanguage === 'en' || !children) {
            setTranslated(children);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        t(children)
            .then(setTranslated)
            .finally(() => setIsLoading(false));
    }, [children, currentLanguage, t]);

    return (
        <span className={`${className} ${isLoading ? 'opacity-70' : ''}`}>
            {translated}
        </span>
    );
}

/**
 * Hook for translating text in functional components
 * 
 * Usage:
 * const translate = useTranslate();
 * const [text, setText] = useState('');
 * 
 * useEffect(() => {
 *   translate('Hello').then(setText);
 * }, []);
 */
export function useTranslate() {
    const { t } = useTranslation();
    return t;
}
