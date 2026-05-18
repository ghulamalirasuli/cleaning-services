import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const BookingConfirm = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const reference = params.get('ref');

  return (
    <>
      <Helmet><title>{t('booking.confirm_title')} | CleanPro</title></Helmet>
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-charcoal mb-3">{t('booking.confirm_title')}</h1>
          <p className="text-gray-500 font-body mb-8">{t('booking.confirm_message')}</p>
          {reference && (
            <p className="text-sm text-gray-400 font-body mb-6">{t('booking.reference')}: <strong className="text-charcoal">{reference}</strong></p>
          )}
          <div className="flex flex-col gap-3">
            {reference && (
              <Link to={`/booking/${reference}`}>
                <Button className="w-full">{t('booking.view_booking')}</Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="ghost" className="w-full">{t('common.go_home')}</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default BookingConfirm;
