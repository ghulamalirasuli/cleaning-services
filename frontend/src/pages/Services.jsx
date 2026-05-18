import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getServices } from '../api/services';
import { useCmsPage } from '../hooks/useCmsPage';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Services = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { pickTitle, pickBody, firstBySection } = useCmsPage('services');
  const hero = firstBySection('hero');
  const subHeading = firstBySection('subscription_heading');
  const oneTimeHeading = firstBySection('onetime_heading');

  const pageTitle = pickTitle(hero) || t('services.title');
  const pageSubtitle = pickBody(hero) || t('services.subtitle');
  const subscriptionLabel = pickTitle(subHeading) || t('services.subscription');
  const oneTimeLabel = pickTitle(oneTimeHeading) || t('services.one_time');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices().then((r) => r.data),
  });

  const subscriptionServices = services?.filter((s) => s.slug === 'regular-basic') || [];
  const oneTimeServices = services?.filter((s) => s.slug !== 'regular-basic') || [];

  return (
    <>
      <Helmet>
        <title>{pageTitle} | CleanPro</title>
        <meta name="description" content={pageSubtitle} />
      </Helmet>

      <section className="pt-20 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16 pt-8">
            <h1 className="text-5xl font-display font-bold text-charcoal mb-4">{pageTitle}</h1>
            <p className="text-gray-500 font-body text-lg max-w-2xl mx-auto">{pageSubtitle}</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-64" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              {subscriptionServices.length > 0 && (
                <div className="mb-16">
                  <motion.h2 {...fadeUp} className="text-2xl font-display font-bold text-charcoal mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    {subscriptionLabel}
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subscriptionServices.map((service, i) => (
                      <ServiceCard key={service.id} service={service} lang={lang} t={t} index={i} featured />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <motion.h2 {...fadeUp} className="text-2xl font-display font-bold text-charcoal mb-8">
                  {oneTimeLabel}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {oneTimeServices.map((service, i) => (
                    <ServiceCard key={service.id} service={service} lang={lang} t={t} index={i} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

const ServiceCard = ({ service, lang, t, index, featured = false }) => (
  <motion.div {...fadeUp} transition={{ duration: 0.6, delay: index * 0.1 }}>
    <Card hover className={`h-full flex flex-col ${featured ? 'border-sage border-2' : ''}`}>
      {featured && (
        <span className="inline-block px-3 py-1 bg-sage/10 text-sage-dark text-xs font-body font-semibold rounded-full mb-4 w-fit">
          Best Value
        </span>
      )}
      <h3 className="text-xl font-display font-bold text-charcoal mb-2">
        {lang === 'de' && service.name_de ? service.name_de : service.name}
      </h3>
      <p className="text-gray-500 font-body text-sm leading-relaxed mb-4 flex-1">
        {lang === 'de' && service.description_de ? service.description_de : service.description}
      </p>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-end gap-1 mb-4">
          <span className="text-sm text-gray-500 font-body">{t('services.from')}</span>
          <span className="text-3xl font-display font-bold text-charcoal">€{service.hourly_rate}</span>
          <span className="text-sm text-gray-400 font-body">{t('services.per_hour')}</span>
        </div>

        <div className="space-y-2 mb-4 text-sm font-body text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('services.min_hours')}: 2 {t('services.hours')}
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('services.english_speaker')}: {t('services.included')}
          </div>
        </div>

        {service.is_quote_based ? (
          <Link to="/contact">
            <Button variant="outline" className="w-full">
              {t('services.get_quote')}
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2">
            <Link to={`/services/${service.slug}`} className="flex-1">
              <Button variant="outline" className="w-full">
                {t('services.details')}
              </Button>
            </Link>
            <Link to="/book">
              <Button>{t('services.book_now')}</Button>
            </Link>
          </div>
        )}
      </div>
    </Card>
  </motion.div>
);

export default Services;
