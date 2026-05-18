import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import { useSiteBranding } from '../../hooks/useSiteBranding';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import ThemeToggle from '../ui/ThemeToggle';
import Button from '../ui/Button';

const Navbar = () => {
  const { t } = useTranslation();
  const { displayName, logoUrl } = useSiteBranding();
  const { isAuthenticated, user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') closeSidebar();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/cities', label: t('nav.cities') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const showFallbackMark = !logoUrl || logoFailed;

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-16 z-[48] bg-black/40 backdrop-blur-[1px]"
          aria-label={t('nav.close_sidebar')}
          onClick={closeSidebar}
        />
      )}
      <aside
        role="navigation"
        id="site-navigation-drawer"
        aria-label={t('nav.sidebar_label')}
        aria-hidden={!sidebarOpen}
        className={`fixed bottom-0 left-0 top-16 z-[49] flex w-[min(288px,calc(100vw-48px))] max-w-[100vw] flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 ease-out dark:border-gray-800 dark:bg-charcoal lg:shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <p className="font-display font-semibold text-charcoal dark:text-cream">{t('nav.sidebar_title')}</p>
          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-charcoal hover:bg-gray-100 dark:text-cream dark:hover:bg-gray-800"
            aria-label={t('nav.close_sidebar')}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-lg px-3 py-2 font-body text-base text-gray-600 hover:bg-gray-50 hover:text-charcoal dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white"
              onClick={closeSidebar}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <div className="flex items-center gap-3 py-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <div className="flex flex-col gap-2 py-2">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-1 text-sm text-gray-600 hover:text-charcoal dark:text-gray-300" onClick={closeSidebar}>
                    {t('nav.admin')}
                  </Link>
                )}
                <Link to="/account" className="px-3 py-1 text-sm text-gray-600 hover:text-charcoal dark:text-gray-300" onClick={closeSidebar}>
                  {t('nav.account')}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    closeSidebar();
                  }}
                  className="w-full px-3 py-1 text-left text-sm text-gray-600 hover:text-charcoal dark:text-gray-300"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 text-sm text-gray-600 hover:text-charcoal dark:text-gray-300" onClick={closeSidebar}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="px-3 py-1 text-sm text-gray-600 hover:text-charcoal dark:text-gray-300" onClick={closeSidebar}>
                  {t('nav.register')}
                </Link>
              </>
            )}
          </div>
          <Link to="/book" className="mt-3 block px-3" onClick={closeSidebar}>
            <Button size="sm" className="w-full">
              {t('nav.book')}
            </Button>
          </Link>
        </div>
      </aside>

      <nav className="fixed left-0 right-0 top-0 z-[60] border-b border-gray-200 bg-white/85 backdrop-blur-md dark:border-gray-800 dark:bg-charcoal/90">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              className="shrink-0 rounded-lg p-2 text-charcoal hover:bg-gray-100 dark:text-cream dark:hover:bg-gray-800"
              aria-expanded={sidebarOpen}
              aria-controls="site-navigation-drawer"
              aria-label={sidebarOpen ? t('nav.sidebar_collapse_toggle') : t('nav.sidebar_expand_toggle')}
              title={t('nav.sidebar_toggle_title')}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link to="/" className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:max-w-[min(220px,40vw)]">
              {logoUrl && !logoFailed ? (
                <img
                  src={logoUrl}
                  alt=""
                  className="h-8 max-h-8 w-auto max-w-[100px] shrink-0 object-contain object-left sm:max-w-[140px]"
                  onError={() => setLogoFailed(true)}
                />
              ) : null}
              {showFallbackMark ? (
                <>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="truncate font-display text-xl font-bold text-charcoal dark:text-cream">{displayName}</span>
                </>
              ) : (
                <span className="truncate font-display text-xl font-bold text-charcoal dark:text-cream sm:text-lg">{displayName}</span>
              )}
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="font-body text-sm text-gray-600 hover:text-charcoal dark:text-gray-300 dark:hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
              <ThemeToggle />
              <LanguageSwitcher />
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="font-body text-sm text-gray-600 hover:text-charcoal dark:text-gray-300 dark:hover:text-white">
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Link to="/account" className="font-body text-sm text-gray-600 hover:text-charcoal dark:text-gray-300 dark:hover:text-white">
                    {t('nav.account')}
                  </Link>
                  <button type="button" onClick={handleLogout} className="font-body text-sm text-gray-600 hover:text-charcoal dark:text-gray-300 dark:hover:text-white">
                    {t('nav.logout')}
                  </button>
                  <Link to="/book">
                    <Button size="sm">{t('nav.book')}</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="font-body text-sm text-gray-600 hover:text-charcoal dark:text-gray-300 dark:hover:text-white">
                    {t('nav.login')}
                  </Link>
                  <Link to="/book">
                    <Button size="sm">{t('nav.book')}</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
