import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getCities } from '../api/cities';
import { useCmsPage } from '../hooks/useCmsPage';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Cities = () => {
  const { t } = useTranslation();
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities().then((r) => r.data),
  });
  const { pickTitle, pickBody, firstBySection } = useCmsPage('cities');
  const hero = firstBySection('hero');
  const pageTitle = pickTitle(hero) || t('cities.title');
  const pageSubtitle = pickBody(hero) || t('cities.subtitle');

  return (
    <>
      <Helmet>
        <title>{pageTitle} | CleanPro</title>
      </Helmet>
      <section className="pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16 pt-8">
            <h1 className="text-5xl font-display font-bold text-charcoal mb-4">{pageTitle}</h1>
            <p className="text-gray-500 font-body text-lg">{pageSubtitle}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities?.map((city, i) => (
              <motion.div key={city.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <Card className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-charcoal text-lg">{city.name}</h3>
                      <p className="text-sm text-gray-400 font-body">{city.country_code}</p>
                    </div>
                  </div>
                  <Badge variant={city.is_active ? 'sage' : 'default'}>
                    {city.is_active ? t('cities.available') : t('cities.coming_soon')}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cities;
