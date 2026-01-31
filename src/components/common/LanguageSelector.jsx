import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Check, ChevronDown } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../../context/TranslationContext';

export default function LanguageSelector() {
    const { currentLanguage, changeLanguage, isTranslating } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

    return (
        <div className="relative">
            {/* Language Selector Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all shadow-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Languages size={18} className="text-emerald-600" />
                <span className="font-semibold text-sm text-slate-700">
                    {currentLang?.nativeName}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />

                {/* Translating Indicator */}
                {isTranslating && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-emerald-100 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                    Select Language
                                </p>
                            </div>

                            {/* Language List */}
                            <div className="max-h-96 overflow-y-auto">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <motion.button
                                        key={lang.code}
                                        onClick={() => {
                                            changeLanguage(lang.code);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-emerald-50 transition-colors ${currentLanguage === lang.code ? 'bg-emerald-50' : ''
                                            }`}
                                        whileHover={{ x: 4 }}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span className="font-semibold text-sm text-slate-800">
                                                {lang.nativeName}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {lang.name}
                                            </span>
                                        </div>

                                        {currentLanguage === lang.code && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                            >
                                                <Check size={14} className="text-white" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Footer Info */}
                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                                <p className="text-xs text-slate-500 text-center">
                                    Powered by Google Translate
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
