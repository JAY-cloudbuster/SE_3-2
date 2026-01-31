import React, { useState, useEffect } from 'react';
import { useTranslation, T } from '../../context/TranslationContext';

/**
 * TranslatedText Component
 * Automatically translates text based on current language
 * 
 * Usage:
 * <TranslatedText>Hello World</TranslatedText>
 * 
 * Or use the shorthand <T> component:
 * <T>Hello World</T>
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
