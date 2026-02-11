/**
 * @fileoverview Language Context Provider for AgriSahayak Frontend
 * 
 * This module provides a simple React Context for managing the currently
 * selected interface language. It works alongside the TranslationContext
 * (which handles actual text translation) and the LanguageSelector component.
 * 
 * This context stores a basic language code string (e.g., 'en', 'hi', 'ta')
 * and provides a setter function for components to change the language.
 * 
 * Note: The main translation logic is in TranslationContext.jsx.
 * This context provides a simpler, lightweight language state
 * that can be used independently.
 * 
 * @module context/LanguageContext
 * @requires react - React library for createContext, useState
 * 
 * @see Epic 1, Story 1.3 - Select Preferred Language
 * @see context/TranslationContext.jsx - Full translation system
 * @see components/common/LanguageSelector.jsx - UI for language switching
 */

import React, { createContext, useState } from 'react';

/**
 * LanguageContext - React Context for language preference state.
 * 
 * Provides:
 * - language: Current language code string (default: 'en')
 * - setLanguage: Function to change the language code
 * 
 * @type {React.Context}
 */
export const LanguageContext = createContext();

/**
 * LanguageProvider Component
 * 
 * Wraps child components to provide access to the current language
 * state and the ability to change it. Used in the App.jsx provider chain.
 * 
 * Provider hierarchy (in App.jsx):
 * AuthProvider → TranslationProvider → LanguageProvider → SocketProvider → BrowserRouter
 * 
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} LanguageContext.Provider wrapping children
 */
export const LanguageProvider = ({ children }) => {
  /**
   * Current language code following ISO 639-1 standard.
   * Default is 'en' (English).
   * @type {string}
   */
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};