import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../store/authStore';
import { useSiteBranding } from '../../hooks/useSiteBranding';
import ThemeToggle from '../ui/ThemeToggle';

const ADMIN_SIDEBAR_COLLAPSED_KEY = 'cleanpro-admin-sidebar-collapsed';

const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();
  const { displayName, logoUrl } = useSiteBranding();
  const [logoFailed, setLogoFailed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem(ADMIN_SIDEBAR_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_SIDEBAR_COLLAPSED_KEY, sidebarCollapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (!mobileSidebarOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const showFallbackMark = !logoUrl || logoFailed;

  const links = [
    { to: '/admin', label: t('admin.title'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { to: '/admin/settings', label: t('admin.settings'), icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { to: '/admin/page-content', label: t('admin.page_content'), icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    { to: '/admin/bookings', label: t('admin.bookings'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { to: '/admin/cleaners', label: t('admin.cleaners'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { to: '/admin/quotes', label: t('admin.quotes'), icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { to: '/admin/services', label: t('admin.services'), icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { to: '/admin/service-extras', label: t('admin.service_extras'), icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { to: '/admin/testimonials', label: t('admin.testimonials'), icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { to: '/admin/cities', label: t('admin.cities'), icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
    { to: '/admin/trash', label: t('admin.trash'), icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    if (path === '/admin/trash') return location.pathname === '/admin/trash';
    return location.pathname.startsWith(path);
  };

  const collapsed = sidebarCollapsed;

  const linkBase = collapsed
    ? 'flex items-center gap-3 px-6 py-3 text-sm font-body transition-colors lg:justify-center lg:px-2'
    : 'flex items-center gap-3 px-6 py-3 text-sm font-body transition-colors';

  const renderBrandMark = (sizeCls) => (
    <div className={`flex shrink-0 items-center justify-center rounded-lg bg-sage ${sizeCls}`}>
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {mobileSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-label={t('admin.sidebar_close_navigation')}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <aside
          id="admin-navigation"
          aria-label={t('admin.sidebar_label')}
          className={`fixed left-0 top-0 z-30 flex h-full flex-col bg-charcoal text-white shadow-lg transition-[transform,width] duration-200 ease-out lg:translate-x-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${
            collapsed ? 'w-64 lg:w-16' : 'w-64'
          }`}
        >
          <div className={`shrink-0 border-b border-white/10 pb-6 pt-6 ${collapsed ? 'lg:flex lg:flex-col lg:items-center lg:px-2 lg:py-5' : 'px-6'}`}>
            {collapsed ? (
              <Link
                to="/"
                title={displayName}
                onClick={() => setMobileSidebarOpen(false)}
                className="flex min-w-0 items-center gap-2 lg:justify-center"
              >
                <span className="hidden lg:flex">
                  {(logoUrl && !logoFailed) ? (
                    <img src={logoUrl} alt="" className="max-h-8 max-w-8 rounded object-contain brightness-0 invert opacity-90" onError={() => setLogoFailed(true)} />
                  ) : (
                    renderBrandMark('h-9 w-9')
                  )}
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
                  {logoUrl && !logoFailed ? (
                    <img
                      src={logoUrl}
                      alt=""
                      className="h-8 max-w-[100px] object-contain object-left brightness-0 invert opacity-90 sm:max-w-[120px]"
                      onError={() => setLogoFailed(true)}
                    />
                  ) : null}
                  {showFallbackMark ? (
                    <>
                      {renderBrandMark('h-8 w-8')}
                      <span className="truncate font-display text-lg font-bold text-white">{displayName}</span>
                    </>
                  ) : (
                    <span className="truncate font-display text-lg font-bold text-white">{displayName}</span>
                  )}
                </span>
              </Link>
            ) : (
              <Link to="/" className="flex min-w-0 items-center gap-2" onClick={() => setMobileSidebarOpen(false)}>
                {logoUrl && !logoFailed ? (
                  <img src={logoUrl} alt="" className="h-8 max-w-[100px] object-contain object-left brightness-0 invert opacity-90 sm:max-w-[120px]" onError={() => setLogoFailed(true)} />
                ) : null}
                {showFallbackMark ? (
                  <>
                    {renderBrandMark('h-8 w-8')}
                    <span className="truncate font-display text-lg font-bold text-white">{displayName}</span>
                  </>
                ) : (
                  <span className="truncate font-display text-lg font-bold text-white">{displayName}</span>
                )}
              </Link>
            )}
          </div>

          <nav className="mt-1 flex flex-1 flex-col overflow-y-auto pb-52">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                title={collapsed ? link.label : undefined}
                onClick={() => setMobileSidebarOpen(false)}
                className={`${linkBase} ${
                  isActive(link.to)
                    ? collapsed
                      ? 'border-sage bg-sage/20 text-sage-light lg:border-r-0'
                      : 'border-r-2 border-sage bg-sage/20 text-sage-light'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                </svg>
                <span className={collapsed ? 'lg:sr-only' : ''}>{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className={`absolute bottom-6 left-6 right-4 flex flex-col gap-3 ${collapsed ? 'lg:left-2 lg:right-2 lg:items-center' : ''}`}>
            <div className={collapsed ? 'lg:flex lg:justify-center' : ''}>
              <ThemeToggle inverted />
            </div>
            <button
              type="button"
              title={collapsed ? t('nav.logout') : undefined}
              onClick={() => {
                clearAuth();
                navigate('/');
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left font-body text-sm text-gray-400 transition-colors hover:bg-white/5 hover:text-white ${
                collapsed ? 'lg:justify-center' : ''
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 9l3 3m0 0l-3 3m3-3H9"
                />
              </svg>
              <span className={collapsed ? 'lg:sr-only' : ''}>{t('nav.logout')}</span>
            </button>
            <Link
              to="/"
              className={`font-body text-sm text-gray-400 hover:text-white ${collapsed ? 'lg:hidden' : ''}`}
              onClick={() => setMobileSidebarOpen(false)}
            >
              &larr; Back to Site
            </Link>
          </div>
        </aside>

        <main
          className={`min-h-screen flex-1 p-6 pt-[4.5rem] transition-[margin] duration-200 ease-out dark:text-gray-100 sm:p-8 lg:pt-8 ${
            collapsed ? 'lg:ml-16' : 'lg:ml-64'
          }`}
        >
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="-ml-1 inline-flex rounded-lg p-2 text-charcoal hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 lg:hidden"
              aria-expanded={mobileSidebarOpen}
              aria-controls="admin-navigation"
              aria-label={t('admin.sidebar_open_navigation')}
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <button
              type="button"
              className="hidden rounded-lg border border-transparent p-2 text-charcoal hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 lg:inline-flex"
              aria-expanded={!collapsed}
              aria-label={collapsed ? t('admin.sidebar_expand') : t('admin.sidebar_collapse')}
              title={collapsed ? t('admin.sidebar_expand') : t('admin.sidebar_collapse')}
              onClick={() => setSidebarCollapsed((v) => !v)}
            >
              {collapsed ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
