import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { getServices } from '../../api/services';
import { createBooking } from '../../api/bookings';
import useBookingStore from '../../store/bookingStore';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { format } from 'date-fns';
import { useThemeStore } from '../../store/themeStore';

function isStripePublishableKey(value) {
  return typeof value === 'string' && /^pk_(test|live)_/.test(value.trim());
}

const stripePublishableKey = (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '').trim();
const stripePromise = isStripePublishableKey(stripePublishableKey) ? loadStripe(stripePublishableKey) : null;

function useCardElementOptions() {
  const mode = useThemeStore((s) => s.mode);
  return useMemo(
    () => ({
      style: {
        base: {
          fontSize: '16px',
          color: mode === 'dark' ? '#f3f3f3' : '#1C1C1C',
          fontFamily: 'DM Sans, sans-serif',
          '::placeholder': { color: mode === 'dark' ? '#9ca3af' : '#A3A3A3' },
        },
        invalid: { color: '#EF4444' },
      },
    }),
    [mode]
  );
}

const ReviewForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const themeMode = useThemeStore((s) => s.mode);
  const cardElementOptions = useCardElementOptions();
  const { isAuthenticated } = useAuthStore();
  const store = useBookingStore();
  const [loading, setLoading] = useState(false);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices().then(r => r.data),
  });

  const service = services?.find(s => s.id === store.serviceId);
  const depositAmount = service ? Number(service.hourly_rate) : 0;
  const estimatedTotal = service ? Number(service.hourly_rate) * store.estimatedHours : 0;

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in first');
      navigate('/login');
      return;
    }

    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { data } = await createBooking({
        service_id: store.serviceId,
        city_id: store.cityId,
        address: store.address,
        scheduled_at: store.scheduledAt,
        frequency: store.frequency,
        estimated_hours: store.estimatedHours,
        english_speaker_requested: store.englishSpeaker,
        extras: store.extras,
        notes: store.notes,
      });

      const { error } = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t('booking.confirm_title'));
        store.reset();
        navigate(`/booking/${data.booking.reference}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-charcoal dark:text-cream mb-6">{t('booking.summary')}</h2>

      <Card className="mb-6 space-y-3">
        <div className="flex justify-between text-sm font-body">
          <span className="text-gray-500 dark:text-gray-400">{t('booking.step1')}</span>
          <span className="text-charcoal dark:text-cream font-medium text-right max-w-[65%]">{store.serviceName}</span>
        </div>
        <div className="flex justify-between text-sm font-body">
          <span className="text-gray-500 dark:text-gray-400">{t('booking.step2')}</span>
          <span className="text-charcoal dark:text-cream font-medium text-right max-w-[65%]">{store.cityName} - {store.address}</span>
        </div>
        <div className="flex justify-between text-sm font-body">
          <span className="text-gray-500 dark:text-gray-400">{t('booking.step3')}</span>
          <span className="text-charcoal dark:text-cream font-medium text-right max-w-[65%]">
            {store.scheduledAt ? format(new Date(store.scheduledAt), 'PPp') : '-'}
          </span>
        </div>
        <div className="flex justify-between text-sm font-body">
          <span className="text-gray-500 dark:text-gray-400">{t('booking.frequency_label')}</span>
          <span className="text-charcoal dark:text-cream font-medium capitalize">{store.frequency}</span>
        </div>
        <div className="flex justify-between text-sm font-body">
          <span className="text-gray-500 dark:text-gray-400">{t('booking.hours_label')}</span>
          <span className="text-charcoal dark:text-cream font-medium">{store.estimatedHours}h</span>
        </div>
        {store.extras.length > 0 && (
          <div className="flex justify-between text-sm font-body">
            <span className="text-gray-500 dark:text-gray-400">{t('booking.extras_label')}</span>
            <span className="text-charcoal dark:text-cream font-medium">{store.extras.length} selected</span>
          </div>
        )}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
          <div className="flex justify-between font-body">
            <span className="text-gray-500 dark:text-gray-400">{t('booking.deposit')}</span>
            <span className="text-xl font-display font-bold text-charcoal dark:text-cream">€{depositAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-body text-gray-400 dark:text-gray-500 mt-1">
            <span>{t('booking.total_estimate')}</span>
            <span>€{estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <label className="form-label !mb-3">{t('booking.card_details')}</label>
        <div className="relative z-10 min-h-[52px] rounded-lg border border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-950/40">
          <CardElement key={themeMode} options={cardElementOptions} />
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={store.prevStep}>{t('booking.back')}</Button>
        <Button onClick={handleSubmit} loading={loading} disabled={!stripe}>
          {t('booking.pay_deposit')} — €{depositAmount.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

const Step5Review = () => {
  const { t } = useTranslation();
  if (!stripePromise) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 font-body text-sm text-amber-950 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100">
        {t('booking.stripe_unconfigured')}
      </div>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <ReviewForm />
    </Elements>
  );
};

export default Step5Review;
