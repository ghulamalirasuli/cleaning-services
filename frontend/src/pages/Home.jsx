import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getServices } from '../api/services';
import { getCities } from '../api/cities';
import { getTestimonials } from '../api/testimonials';
import { useSiteBranding } from '../hooks/useSiteBranding';
import { useCmsPage } from '../hooks/useCmsPage';
import { cmsIconPath } from '../lib/cmsIcons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const { displayName, heroBadge } = useSiteBranding();
  const lang = i18n.language;
  const { pickTitle, pickBody, firstBySection, bySection } = useCmsPage('home');

  const hero = firstBySection('hero');
  const howTitleBlock = firstBySection('how_section');
  const howSteps = bySection('how_step');
  const servicesIntro = firstBySection('services_intro');
  const reviewsHeading = firstBySection('reviews_heading');
  const citiesIntro = firstBySection('cities_intro');
  const trustTitleBlock = firstBySection('trust_section');
  const trustItems = bySection('trust_item');
  const ctaBlock = firstBySection('cta');

  const heroTitle = pickTitle(hero) || t('home.hero_title');
  const heroSubtitle = pickBody(hero) || t('home.hero_subtitle');
  const howTitle = pickTitle(howTitleBlock) || t('home.how_title');
  const servicesTitle = pickTitle(servicesIntro) || t('home.services_title');
  const servicesSubtitle = pickBody(servicesIntro) || t('home.services_subtitle');
  const reviewsTitle = pickTitle(reviewsHeading) || t('home.reviews_title');
  const citiesTitle = pickTitle(citiesIntro) || t('home.cities_title');
  const citiesSubtitle = pickBody(citiesIntro) || t('home.cities_subtitle');
  const trustTitle = pickTitle(trustTitleBlock) || t('home.trust_title');
  const ctaTitle = pickTitle(ctaBlock) || t('home.cta_title');
  const ctaSubtitle = pickBody(ctaBlock) || t('home.cta_subtitle');

  const howStepsDisplay =
    howSteps.length > 0
      ? howSteps.map((b, idx) => ({
          key: b.id,
          num: String(idx + 1).padStart(2, '0'),
          title: pickTitle(b),
          desc: pickBody(b),
        }))
      : [
          { key: 's1', num: '01', title: t('home.how_step1_title'), desc: t('home.how_step1_desc') },
          { key: 's2', num: '02', title: t('home.how_step2_title'), desc: t('home.how_step2_desc') },
          { key: 's3', num: '03', title: t('home.how_step3_title'), desc: t('home.how_step3_desc') },
        ];

  const trustDisplay =
    trustItems.length > 0
      ? trustItems.map((b, idx) => ({
          key: b.id,
          icon: cmsIconPath(b.icon),
          title: pickTitle(b),
          desc: pickBody(b),
          i: idx,
        }))
      : [
          { key: 't1', icon: cmsIconPath('trust_verified'), title: t('home.trust_verified'), desc: t('home.trust_verified_desc'), i: 0 },
          { key: 't2', icon: cmsIconPath('trust_english'), title: t('home.trust_english'), desc: t('home.trust_english_desc'), i: 1 },
          { key: 't3', icon: cmsIconPath('trust_guarantee'), title: t('home.trust_guarantee'), desc: t('home.trust_guarantee_desc'), i: 2 },
          { key: 't4', icon: cmsIconPath('trust_support'), title: t('home.trust_support'), desc: t('home.trust_support_desc'), i: 3 },
        ];

  const { data: services } = useQuery({ queryKey: ['services'], queryFn: () => getServices().then((r) => r.data) });
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: () => getCities().then((r) => r.data) });
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => getTestimonials().then((r) => r.data),
  });

  return (
    <>
      <Helmet>
        <title>
          {displayName} | {heroTitle}
        </title>
        <meta name="description" content={heroSubtitle} />
      </Helmet>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-sage/10 blur-3xl dark:bg-sage/20" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl dark:bg-gold/15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {heroBadge ? (
                <span className="mb-6 inline-block rounded-full bg-sage/10 px-4 py-1.5 font-body text-sm font-medium text-sage-dark dark:bg-sage/20 dark:text-sage-light">
                  {heroBadge}
                </span>
              ) : null}
              <h1 className="mb-6 font-display text-5xl font-bold leading-tight text-charcoal dark:text-cream sm:text-6xl lg:text-7xl">{heroTitle}</h1>
              <p className="mb-10 max-w-xl font-body text-xl leading-relaxed text-gray-500 dark:text-gray-400">{heroSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book">
                  <Button size="lg" className="text-lg px-10">
                    {t('home.hero_cta')}
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg">
                    {t('nav.services')}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <h2 className="mb-4 font-display text-4xl font-bold text-charcoal dark:text-cream">{howTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howStepsDisplay.map((step, i) => (
              <motion.div key={step.key} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.15 }} className="text-center">
                <div className="w-16 h-16 bg-sage/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-display font-bold text-sage">{step.num}</span>
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-charcoal dark:text-cream">{step.title}</h3>
                <p className="font-body leading-relaxed text-gray-500 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="mb-4 font-display text-4xl font-bold text-charcoal dark:text-cream">{servicesTitle}</h2>
            <p className="font-body text-lg text-gray-500 dark:text-gray-400">{servicesSubtitle}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.filter((s) => !s.is_quote_based).map((service, i) => (
              <motion.div key={service.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <Card hover className="h-full flex flex-col">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 font-display text-xl font-bold text-charcoal dark:text-cream">
                    {lang === 'de' && service.name_de ? service.name_de : service.name}
                  </h3>
                  <p className="mb-4 flex-1 font-body text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    {lang === 'de' && service.description_de ? service.description_de : service.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                    <span className="font-display text-2xl font-bold text-charcoal dark:text-cream">
                      €{service.hourly_rate}
                      <span className="font-body text-sm text-gray-400">{t('common.per_hour')}</span>
                    </span>
                    <Link to={`/services/${service.slug}`}>
                      <Button size="sm">{t('services.details')}</Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{trustTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustDisplay.map((item) => (
              <motion.div key={item.key} {...fadeUp} transition={{ duration: 0.6, delay: item.i * 0.1 }} className="text-center">
                <div className="w-14 h-14 bg-sage/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-sage-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="mb-4 font-display text-4xl font-bold text-charcoal dark:text-cream">{reviewsTitle}</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((review, i) => (
              <motion.div key={review.id} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }}>
                <Card className="h-full">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }, (_, j) => (
                      <svg key={j} className={`w-4 h-4 ${j < review.rating ? 'text-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 font-body text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {lang === 'de' && review.body_de ? review.body_de : review.body}
                  </p>
                  <p className="font-body text-xs font-medium text-gray-400 dark:text-gray-500">
                    {lang === 'de' && review.author_name_de ? review.author_name_de : review.author_name}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <h2 className="mb-2 font-display text-3xl font-bold text-charcoal dark:text-cream">{citiesTitle}</h2>
            <p className="font-body text-gray-500 dark:text-gray-400">{citiesSubtitle}</p>
          </motion.div>
          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-3">
            {cities?.map((city) => (
              <span
                key={city.id}
                className="rounded-full border border-gray-200 bg-cream px-5 py-2.5 font-body text-sm font-medium text-charcoal dark:border-gray-600 dark:bg-gray-800 dark:text-cream"
              >
                {city.name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-sage">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">{ctaTitle}</h2>
            <p className="text-sage-light/80 font-body text-lg mb-10">{ctaSubtitle}</p>
            <Link to="/book">
              <Button variant="gold" size="lg" className="text-lg px-12">
                {t('home.cta_button')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
