import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getService } from '../api/services';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', slug],
    queryFn: () => getService(slug).then(r => r.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-6 w-3/4 mb-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!service) return null;

  const name = lang === 'de' && service.name_de ? service.name_de : service.name;
  const desc = lang === 'de' && service.description_de ? service.description_de : service.description;
  const standardExtras = service.extras?.filter(e => !e.requires_equipment) || [];
  const equipmentExtras = service.extras?.filter(e => e.requires_equipment) || [];

  return (
    <>
      <Helmet>
        <title>{name} | CleanPro</title>
        <meta name="description" content={desc} />
      </Helmet>

      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <Link to="/services" className="text-sage font-body text-sm hover:underline mb-4 inline-block">&larr; {t('nav.services')}</Link>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-charcoal mb-4">{name}</h1>
            <p className="text-gray-500 font-body text-lg leading-relaxed mb-8">{desc}</p>

            <div className="flex items-center gap-6 mb-10">
              <div>
                <span className="text-sm text-gray-500 font-body">{t('services.from')}</span>
                <div className="text-4xl font-display font-bold text-charcoal">
                  €{service.hourly_rate}<span className="text-base text-gray-400 font-body">{t('services.per_hour')}</span>
                </div>
              </div>
              {service.is_quote_based ? (
                <Link to="/contact">
                  <Button size="lg">{t('services.get_quote')}</Button>
                </Link>
              ) : (
                <Link to="/book">
                  <Button size="lg">{t('services.book_now')}</Button>
                </Link>
              )}
            </div>
          </motion.div>

          {standardExtras.length > 0 && (
            <motion.div {...fadeUp} className="mb-10">
              <h2 className="text-2xl font-display font-bold text-charcoal mb-6">{t('services.scope')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {standardExtras.map((extra) => (
                  <div key={extra.id} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100">
                    <svg className="w-5 h-5 text-sage flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-sm text-charcoal">
                      {lang === 'de' && extra.name_de ? extra.name_de : extra.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {equipmentExtras.length > 0 && (
            <motion.div {...fadeUp} className="mb-10">
              <h2 className="text-2xl font-display font-bold text-charcoal mb-6">{t('services.equipment')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {equipmentExtras.map((extra) => (
                  <Card key={extra.id} className="flex items-center justify-between">
                    <span className="font-body text-sm text-charcoal">
                      {lang === 'de' && extra.name_de ? extra.name_de : extra.name}
                    </span>
                    <span className="font-display font-bold text-charcoal">€{extra.price}</span>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {!service.is_quote_based && (
            <motion.div {...fadeUp} className="bg-sage/5 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-display font-bold text-charcoal mb-3">{t('home.cta_title')}</h3>
              <p className="text-gray-500 font-body mb-6">{t('home.cta_subtitle')}</p>
              <Link to="/book"><Button size="lg">{t('services.book_now')}</Button></Link>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
