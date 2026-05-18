import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getCmsBlocks } from '../api/cms';

/**
 * @param {string} page - about | contact | cities | services | home
 */
export function useCmsPage(page) {
  const { i18n } = useTranslation();
  const langIsDe = i18n.language?.toLowerCase().startsWith('de');
  const { data: blocks = [], isLoading } = useQuery({
    queryKey: ['cms-blocks', page],
    queryFn: () => getCmsBlocks(page).then((r) => r.data),
    staleTime: 60 * 1000,
  });

  const pickTitle = (b) =>
    b ? (langIsDe ? (b.title_de || b.title_en || '') : (b.title_en || b.title_de || '')) : '';
  const pickBody = (b) =>
    b ? (langIsDe ? (b.body_de || b.body_en || '') : (b.body_en || b.body_de || '')) : '';

  const bySection = (key) => blocks.filter((b) => b.section_key === key);
  const firstBySection = (key) => bySection(key)[0];

  return { blocks, pickTitle, pickBody, bySection, firstBySection, langIsDe, isLoading };
}
