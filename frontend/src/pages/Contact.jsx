import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getCities } from '../api/cities';
import { createQuote } from '../api/quotes';
import { useCmsPage } from '../hooks/useCmsPage';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Contact = () => {
  const { t } = useTranslation();
  const { pickTitle, pickBody, firstBySection } = useCmsPage('contact');
  const hero = firstBySection('hero');
  const formIntro = firstBySection('form_intro');
  const sidebar = firstBySection('sidebar');

  const pageTitle = pickTitle(hero) || t('contact.title');
  const pageSubtitle = pickBody(hero) || t('contact.subtitle');
  const formTitle = pickTitle(formIntro) || t('contact.form_title');
  const officeTitle = pickTitle(sidebar) || t('contact.office_title');
  const officeDesc = pickBody(sidebar) || t('contact.office_desc');

  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: () => getCities().then((r) => r.data) });
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', city_id: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await createQuote(form);
      toast.success(t('common.success'));
      setForm({ name: '', email: '', phone: '', company: '', city_id: '', description: '' });
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {});
      else toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

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

          <motion.div {...fadeUp} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-2xl font-display font-bold text-charcoal mb-6">{formTitle}</h2>
                {pickBody(formIntro) ? (
                  <p className="text-gray-500 font-body text-sm mb-6 leading-relaxed">{pickBody(formIntro)}</p>
                ) : null}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('contact.name')} value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name?.[0]} required />
                    <Input label={t('contact.email')} type="email" value={form.email} onChange={(e) => update('email', e.target.value)} error={errors.email?.[0]} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label={t('contact.phone')} value={form.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone?.[0]} />
                    <Input label={t('contact.company')} value={form.company} onChange={(e) => update('company', e.target.value)} />
                  </div>
                  <Select
                    label={t('contact.city')}
                    value={form.city_id}
                    onChange={(e) => update('city_id', e.target.value)}
                    options={cities?.map((c) => ({ value: c.id, label: c.name })) || []}
                    placeholder={t('booking.select_city')}
                    error={errors.city_id?.[0]}
                  />
                  <div>
                    <label className="form-label">{t('contact.message')}</label>
                    <textarea
                      className="form-control min-h-[120px]"
                      value={form.description}
                      onChange={(e) => update('description', e.target.value)}
                      required
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.description[0]}</p>}
                  </div>
                  <Button type="submit" className="w-full" loading={loading}>
                    {t('contact.send')}
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-sage/5 rounded-2xl p-8">
                <h3 className="text-xl font-display font-bold text-charcoal mb-4">{officeTitle}</h3>
                <p className="text-gray-500 font-body text-sm leading-relaxed">{officeDesc}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;
