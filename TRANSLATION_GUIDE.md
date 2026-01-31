# Dynamic Translation System - Usage Guide

## Overview

The AgriTech platform now uses **Google Translate API** for automatic translation to 13 Indian languages. No hardcoded translation files needed!

## Supported Languages

- English (en)
- Hindi (hi) - हिन्दी
- Bengali (bn) - বাংলা
- Telugu (te) - తెలుగు
- Marathi (mr) - मराठी
- Tamil (ta) - தமிழ்
- Gujarati (gu) - ગુજરાતી
- Kannada (kn) - ಕನ್ನಡ
- Malayalam (ml) - മലയാളം
- Punjabi (pa) - ਪੰਜਾਬੀ
- Odia (or) - ଓଡ଼ିଆ
- Assamese (as) - অসমীয়া
- Urdu (ur) - اردو

---

## How to Use Translation in Components

### Method 1: Using the `<T>` Component (Recommended)

```jsx
import { T } from '../context/TranslationContext';

function MyComponent() {
  return (
    <div>
      <h1><T>Welcome to AgriTech</T></h1>
      <p><T>Find the best crops at the best prices</T></p>
      <button><T>Buy Now</T></button>
    </div>
  );
}
```

### Method 2: Using the `useTranslation` Hook

```jsx
import { useTranslation } from '../context/TranslationContext';
import { useState, useEffect } from 'react';

function MyComponent() {
  const { t, currentLanguage } = useTranslation();
  const [welcomeText, setWelcomeText] = useState('Welcome');

  useEffect(() => {
    t('Welcome to AgriTech').then(setWelcomeText);
  }, [currentLanguage, t]);

  return <h1>{welcomeText}</h1>;
}
```

### Method 3: Using `TranslatedText` Component

```jsx
import TranslatedText from '../components/common/TranslatedText';

function MyComponent() {
  return (
    <div>
      <TranslatedText className="text-2xl font-bold">
        Dashboard
      </TranslatedText>
    </div>
  );
}
```

---

## Features

### 1. **Automatic Caching**
- Translations are cached in localStorage
- Same text won't be translated twice
- Improves performance and reduces API calls

### 2. **Language Persistence**
- User's language choice is saved
- Automatically loads on next visit

### 3. **Preloading**
- Common UI strings are preloaded when language changes
- Reduces loading time for frequently used text

### 4. **Offline Fallback**
- If translation fails, shows original English text
- No broken UI

---

## Language Selector

The language selector is already integrated in the Navbar. Users can:
- Click the language button to see all options
- See language names in their native script
- Current language is highlighted with a checkmark

---

## How It Works

1. **User selects a language** from the dropdown
2. **TranslationContext** saves the choice to localStorage
3. **Components using `<T>` or `useTranslation`** automatically detect the change
4. **Google Translate API** translates the text
5. **Translation is cached** for future use
6. **UI updates** with translated text

---

## Performance Tips

### Batch Translation
For multiple texts, use batch translation:

```jsx
import { translateBatch } from '../services/translationService';

const texts = ['Hello', 'Welcome', 'Goodbye'];
const translations = await translateBatch(texts, 'hi');
// { 'Hello': 'नमस्ते', 'Welcome': 'स्वागत', 'Goodbye': 'अलविदा' }
```

### Clear Cache
To clear translation cache (e.g., after app update):

```jsx
import { clearTranslationCache } from '../services/translationService';

// Clear all translations
clearTranslationCache();

// Clear specific language
clearTranslationCache('hi');
```

---

## Examples

### Example 1: Translating Form Labels

```jsx
import { T } from '../context/TranslationContext';

function CropForm() {
  return (
    <form>
      <label><T>Crop Name</T></label>
      <input placeholder="e.g., Wheat" />
      
      <label><T>Quantity (kg)</T></label>
      <input type="number" />
      
      <button><T>Submit</T></button>
    </form>
  );
}
```

### Example 2: Translating Dynamic Content

```jsx
import { useTranslation } from '../context/TranslationContext';
import { useState, useEffect } from 'react';

function PriceAlert({ crop, increase }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const englishMessage = `${crop} prices are expected to rise by ${increase}% next week.`;
    t(englishMessage).then(setMessage);
  }, [crop, increase, t]);

  return <p>{message}</p>;
}
```

### Example 3: Translating Button Text

```jsx
import { T } from '../context/TranslationContext';

function ActionButtons() {
  return (
    <div className="flex gap-2">
      <button className="btn-primary">
        <T>Buy Now</T>
      </button>
      <button className="btn-secondary">
        <T>Negotiate Price</T>
      </button>
      <button className="btn-outline">
        <T>Add to Cart</T>
      </button>
    </div>
  );
}
```

---

## Migration Guide

### Old Code (i18next with hardcoded files)
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

### New Code (Google Translate API)
```jsx
import { T } from '../context/TranslationContext';

function MyComponent() {
  return <h1><T>Welcome</T></h1>;
}
```

**Benefits:**
- ✅ No translation files to maintain
- ✅ Supports unlimited languages
- ✅ Automatic translation
- ✅ Simpler code

---

## Troubleshooting

### Translation not working?
1. Check browser console for errors
2. Verify internet connection (Google Translate API requires internet)
3. Clear translation cache: `clearTranslationCache()`

### Text showing in English?
- Translation might be loading (check for loading indicator)
- API might have failed (check console)
- Fallback to English is intentional for reliability

### Slow translation?
- First translation is slower (API call)
- Subsequent loads are instant (cached)
- Consider preloading common strings

---

## Next Steps

Now that translation is set up, you can:
1. Wrap all UI text with `<T>` component
2. Test with different languages
3. Add more languages if needed (just add to `SUPPORTED_LANGUAGES`)
4. Optimize by preloading frequently used strings
