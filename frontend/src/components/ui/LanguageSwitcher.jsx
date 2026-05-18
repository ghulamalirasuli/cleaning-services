import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`flex items-center gap-1 rounded px-2 py-1 font-body text-sm transition-all ${
          i18n.language === 'en'
            ? 'bg-sage/10 font-semibold text-sage-dark dark:bg-sage/25 dark:text-sage-light'
            : 'text-gray-500 hover:text-charcoal dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        <svg className="w-5 h-4 rounded-sm overflow-hidden" viewBox="0 0 640 480">
          <path fill="#012169" d="M0 0h640v480H0z"/>
          <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 82 480H0v-60l239-178L0 64V0z"/>
          <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
          <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
          <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
        </svg>
        EN
      </button>
      <button
        onClick={() => changeLanguage('de')}
        className={`flex items-center gap-1 rounded px-2 py-1 font-body text-sm transition-all ${
          i18n.language === 'de'
            ? 'bg-sage/10 font-semibold text-sage-dark dark:bg-sage/25 dark:text-sage-light'
            : 'text-gray-500 hover:text-charcoal dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        <svg className="w-5 h-4 rounded-sm overflow-hidden" viewBox="0 0 640 480">
          <path fill="#FFCE00" d="M0 320h640v160H0z"/>
          <path fill="#000" d="M0 0h640v160H0z"/>
          <path fill="#DD0000" d="M0 160h640v160H0z"/>
        </svg>
        DE
      </button>
    </div>
  );
};

export default LanguageSwitcher;
