import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteBranding } from '../../hooks/useSiteBranding';

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const { displayName, legalName, logoUrl } = useSiteBranding();
  const [logoFailed, setLogoFailed] = useState(false);
  const showFallbackMark = !logoUrl || logoFailed;

  return (
    <footer className="bg-charcoal text-white dark:bg-[#0a0a0a] dark:ring-1 dark:ring-white/10">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {logoUrl && !logoFailed ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-9 max-w-[140px] object-contain object-left opacity-95"
                  onError={() => setLogoFailed(true)}
                />
              ) : null}
              {showFallbackMark ? (
                <>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <span className="font-display text-xl font-bold">{displayName}</span>
                </>
              ) : (
                <span className="font-display text-xl font-bold">{displayName}</span>
              )}
            </div>
            <p className="font-body text-sm leading-relaxed text-gray-400">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold">{t('footer.services')}</h4>
            <ul className="space-y-2 font-body text-sm text-gray-400">
              <li>
                <Link to="/services/regular-basic" className="transition-colors hover:text-white">
                  Regular Basic
                </Link>
              </li>
              <li>
                <Link to="/services/basic-cleaning" className="transition-colors hover:text-white">
                  Basic Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services/deep-cleaning" className="transition-colors hover:text-white">
                  Deep Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services/move-in-out" className="transition-colors hover:text-white">
                  Move-In/Out
                </Link>
              </li>
              <li>
                <Link to="/services/office-cleaning" className="transition-colors hover:text-white">
                  Office Cleaning
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold">{t('footer.company')}</h4>
            <ul className="space-y-2 font-body text-sm text-gray-400">
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  {t('footer.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-white">
                  {t('footer.contact')}
                </Link>
              </li>
              <li>
                <Link to="/cities" className="transition-colors hover:text-white">
                  {t('nav.cities')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold">{t('footer.support')}</h4>
            <ul className="space-y-2 font-body text-sm text-gray-400">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center font-body text-sm text-gray-500">
          &copy; {year} {legalName}. {t('footer.rights')}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
