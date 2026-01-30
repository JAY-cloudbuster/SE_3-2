import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

export default function LanguagePicker() {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <select 
      value={language} 
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-white border border-emerald-100 text-emerald-800 text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <option value="en">English</option>
      <option value="hi">Hindi (हिन्दी)</option>
      <option value="ta">Tamil (தமிழ்)</option>
    </select>
  );
}