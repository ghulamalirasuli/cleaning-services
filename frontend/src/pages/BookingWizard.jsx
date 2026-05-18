import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import useBookingStore from '../store/bookingStore';
import Step1Service from '../components/booking/Step1Service';
import Step2Location from '../components/booking/Step2Location';
import Step3DateTime from '../components/booking/Step3DateTime';
import Step4Extras from '../components/booking/Step4Extras';
import Step5Review from '../components/booking/Step5Review';

const steps = [
  { key: 'step1', labelKey: 'booking.step1' },
  { key: 'step2', labelKey: 'booking.step2' },
  { key: 'step3', labelKey: 'booking.step3' },
  { key: 'step4', labelKey: 'booking.step4' },
  { key: 'step5', labelKey: 'booking.step5' },
];

const BookingWizard = () => {
  const { t } = useTranslation();
  const { step } = useBookingStore();

  const stepsBeforePay = [Step1Service, Step2Location, Step3DateTime, Step4Extras];
  const StepEarly = stepsBeforePay[step - 1];

  return (
    <>
      <Helmet><title>{t('booking.title')} | CleanPro</title></Helmet>
      <section className="pt-24 pb-16 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-display font-bold text-charcoal dark:text-cream mb-8 pt-4">{t('booking.title')}</h1>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-medium transition-all ${
                    i + 1 <= step ? 'bg-sage text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {i + 1 <= step ? (
                      i + 1 < step ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : i + 1
                    ) : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 lg:w-24 h-0.5 mx-2 ${i + 1 < step ? 'bg-sage' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {steps.map((s, i) => (
                <span key={s.key} className={`text-xs font-body ${i + 1 === step ? 'text-sage font-semibold' : 'text-gray-400'}`}>
                  {t(s.labelKey)}
                </span>
              ))}
            </div>
          </div>

          {/* Step 5 mounts Stripe outside Framer Motion so no animated ancestor interferes with the iframe. */}
          {step === 5 ? (
            <Step5Review />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <StepEarly />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
};

export default BookingWizard;
