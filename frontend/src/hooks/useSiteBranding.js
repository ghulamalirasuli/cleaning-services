import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getSiteSettings } from '../api/settings';

const FALLBACK_BRAND = 'CleanPro';

export function useSiteBranding() {
  const { i18n } = useTranslation();
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const langIsDe = i18n.language?.toLowerCase().startsWith('de');
  const displayName = langIsDe
    ? settings?.app_name_de || settings?.app_name || FALLBACK_BRAND
    : settings?.app_name || settings?.app_name_de || FALLBACK_BRAND;

  const legalName = settings?.legal_name?.trim() || displayName;
  const logoUrl = settings?.logo_url?.trim() || null;

  const heroBadge = langIsDe
    ? settings?.hero_badge_de?.trim() || settings?.hero_badge_en?.trim() || null
    : settings?.hero_badge_en?.trim() || settings?.hero_badge_de?.trim() || null;

  return {
    settings,
    isLoading,
    displayName,
    legalName,
    logoUrl,
    heroBadge,
  };
}
