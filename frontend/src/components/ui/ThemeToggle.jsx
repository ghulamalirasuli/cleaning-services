import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../store/themeStore';

const ThemeToggle = ({ className = '', inverted = false }) => {
  const { t } = useTranslation();
  const mode = useThemeStore((s) => s.mode);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = mode === 'dark';

  const base = inverted
    ? `border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-white/30
       focus-visible:ring-offset-charcoal`
    : `border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50
       dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700
       dark:focus-visible:ring-offset-gray-900`;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`
        inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2
        ${base}
        ${className}
      `}
      aria-label={isDark ? t('nav.theme_light') : t('nav.theme_dark')}
      title={isDark ? t('nav.theme_light') : t('nav.theme_dark')}
    >
      {isDark ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
