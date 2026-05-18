import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useCmsPage } from '../hooks/useCmsPage';
import { cmsIconPath } from '../lib/cmsIcons';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const About = () => {
  const { t } = useTranslation();
  const { pickTitle, pickBody, firstBySection, bySection } = useCmsPage('about');
  const hero = firstBySection('hero');
  const mission = firstBySection('mission');
  const valuesHeading = firstBySection('values_heading');
  const valueBlocks = bySection('value');

  const pageTitle = pickTitle(hero) || t('about.title');
  const pageSubtitle = pickBody(hero) || t('about.subtitle');

  return (
    <>
      <Helmet>
        <title>{pageTitle} | CleanPro</title>
      </Helmet>
      <section className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16 pt-8">
            <h1 className="text-5xl font-display font-bold text-charcoal mb-4">{pageTitle}</h1>
            <p className="text-gray-500 font-body text-lg">{pageSubtitle}</p>
          </motion.div>

          <motion.div {...fadeUp} className="mb-16">
            <h2 className="text-3xl font-display font-bold text-charcoal mb-6">
              {pickTitle(mission) || t('about.mission_title')}
            </h2>
            <p className="text-gray-600 font-body text-lg leading-relaxed">
              {pickBody(mission) || t('about.mission_text')}
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <h2 className="text-3xl font-display font-bold text-charcoal mb-8">
              {pickTitle(valuesHeading) || t('about.values_title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(valueBlocks.length > 0
                ? valueBlocks.map((item, i) => ({
                    key: item.id,
                    icon: cmsIconPath(item.icon),
                    title: pickTitle(item),
                    desc: pickBody(item),
                    i,
                  }))
                : [
                    { key: 'a', icon: cmsIconPath('shield'), title: t('about.value_trust'), desc: t('about.value_trust_desc'), i: 0 },
                    { key: 'b', icon: cmsIconPath('sparkles'), title: t('about.value_quality'), desc: t('about.value_quality_desc'), i: 1 },
                    { key: 'c', icon: cmsIconPath('globe'), title: t('about.value_access'), desc: t('about.value_access_desc'), i: 2 },
                  ]
              ).map((item) => (
                <motion.div
                  key={item.key}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: item.i * 0.15 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200"
                >
                  <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-display font-bold text-charcoal mb-2">{item.title}</h3>
                  <p className="text-gray-500 font-body text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
