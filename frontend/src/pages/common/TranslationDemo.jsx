import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { T, useTranslation } from '../../context/TranslationContext';
import { Globe, Sparkles, CheckCircle } from 'lucide-react';

/**
 * Demo page showing how to use the translation system
 * This can be accessed at /demo/translation for testing
 */
export default function TranslationDemo() {
    const { currentLanguage, t } = useTranslation();
    const [dynamicText, setDynamicText] = useState('');

    // Example of translating dynamic content
    useEffect(() => {
        const message = `You are currently viewing this page in ${currentLanguage.toUpperCase()} language.`;
        t(message).then(setDynamicText);
    }, [currentLanguage, t]);

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full">
                    <Globe size={18} />
                    <span className="font-bold text-sm">
                        <T>Translation Demo</T>
                    </span>
                </div>

                <h1 className="text-4xl font-black text-slate-900">
                    <T>Dynamic Translation System</T>
                </h1>

                <p className="text-slate-600 max-w-2xl mx-auto">
                    <T>This page demonstrates automatic translation using Google Translate API. Change the language from the navbar to see it in action!</T>
                </p>
            </motion.div>

            {/* Current Language Info */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="text-emerald-600" size={24} />
                    <h2 className="text-xl font-bold text-emerald-900">
                        <T>Current Language</T>
                    </h2>
                </div>
                <p className="text-slate-700">{dynamicText}</p>
            </motion.div>

            {/* Examples Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Example 1: Simple Text */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 space-y-3"
                >
                    <h3 className="font-bold text-lg text-slate-800">
                        <T>Simple Text Translation</T>
                    </h3>
                    <div className="space-y-2">
                        <p className="text-sm text-slate-600">
                            <T>Welcome to AgriTech Marketplace</T>
                        </p>
                        <p className="text-sm text-slate-600">
                            <T>Find the best crops at the best prices</T>
                        </p>
                        <p className="text-sm text-slate-600">
                            <T>Connect directly with farmers</T>
                        </p>
                    </div>
                </motion.div>

                {/* Example 2: Form Labels */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 space-y-3"
                >
                    <h3 className="font-bold text-lg text-slate-800">
                        <T>Form Labels</T>
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">
                                <T>Crop Name</T>
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="e.g., Wheat"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 block mb-1">
                                <T>Quantity (kg)</T>
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                                placeholder="100"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Example 3: Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 space-y-3"
                >
                    <h3 className="font-bold text-lg text-slate-800">
                        <T>Action Buttons</T>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">
                            <T>Buy Now</T>
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                            <T>Place Bid</T>
                        </button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold">
                            <T>Negotiate</T>
                        </button>
                    </div>
                </motion.div>

                {/* Example 4: Status Messages */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 space-y-3"
                >
                    <h3 className="font-bold text-lg text-slate-800">
                        <T>Status Messages</T>
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 text-sm">
                            <CheckCircle size={16} />
                            <span><T>Order placed successfully!</T></span>
                        </div>
                        <div className="flex items-center gap-2 text-blue-600 text-sm">
                            <CheckCircle size={16} />
                            <span><T>Your bid has been recorded</T></span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600 text-sm">
                            <CheckCircle size={16} />
                            <span><T>Profile updated</T></span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Features List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 space-y-4"
            >
                <h3 className="font-bold text-xl text-slate-800">
                    <T>Translation Features</T>
                </h3>
                <ul className="space-y-2">
                    {[
                        'Automatic translation to 13 Indian languages',
                        'Caching for better performance',
                        'Offline fallback to English',
                        'No translation files to maintain',
                        'Real-time language switching',
                        'Supports unlimited languages'
                    ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-600">
                            <CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span><T>{feature}</T></span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Code Example */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6 space-y-3"
            >
                <h3 className="font-bold text-xl text-slate-800">
                    <T>How to Use</T>
                </h3>
                <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                        {`import { T } from '../context/TranslationContext';

function MyComponent() {
  return (
    <div>
      <h1><T>Welcome</T></h1>
      <button><T>Click Me</T></button>
    </div>
  );
}`}
                    </pre>
                </div>
            </motion.div>
        </div>
    );
}
