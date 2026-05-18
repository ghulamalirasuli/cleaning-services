import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getBooking } from '../api/bookings';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { format } from 'date-fns';
import { BOOKING_STATUSES } from '../lib/constants';

const BookingStatus = () => {
  const { reference } = useParams();
  const { t } = useTranslation();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', reference],
    queryFn: () => getBooking(reference).then(r => r.data),
    enabled: !!reference,
  });

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!booking) return null;

  const statusConfig = BOOKING_STATUSES[booking.status] || BOOKING_STATUSES.pending;

  return (
    <>
      <Helmet><title>{t('booking.reference')}: {reference} | CleanPro</title></Helmet>
      <section className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-4 mb-8">
            <h1 className="text-3xl font-display font-bold text-charcoal mb-2">{t('booking.reference')}</h1>
            <p className="text-2xl font-display font-bold text-sage">{booking.reference}</p>
          </div>

          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 font-body">{t('admin.status')}</span>
              <Badge variant={booking.status === 'confirmed' ? 'sage' : booking.status === 'completed' ? 'success' : 'gold'}>
                {t(statusConfig.labelKey)}
              </Badge>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">{t('booking.step1')}</span>
              <span className="text-charcoal font-medium">{booking.service?.name}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">{t('booking.step2')}</span>
              <span className="text-charcoal font-medium">{booking.city?.name} - {booking.address}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">{t('booking.step3')}</span>
              <span className="text-charcoal font-medium">{format(new Date(booking.scheduled_at), 'PPp')}</span>
            </div>
            <div className="flex justify-between text-sm font-body">
              <span className="text-gray-500">{t('booking.deposit')}</span>
              <span className="text-charcoal font-medium">€{booking.deposit_amount}</span>
            </div>
            {booking.total_amount && (
              <div className="flex justify-between text-sm font-body border-t border-gray-100 pt-3">
                <span className="text-gray-500 font-semibold">Total</span>
                <span className="text-charcoal font-bold">€{booking.total_amount}</span>
              </div>
            )}
          </Card>

          <div className="mt-6 flex gap-3">
            <Link to="/account/bookings">
              <Button variant="outline">{t('account.bookings')}</Button>
            </Link>
            <Link to="/">
              <Button variant="ghost">{t('common.go_home')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingStatus;
