import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getBooking, cancelBooking, requestCorrection } from '../../api/bookings';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { format } from 'date-fns';

const AccountBookingDetail = () => {
  const { reference } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', reference],
    queryFn: () => getBooking(reference).then(r => r.data),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(booking.id),
    onSuccess: () => {
      toast.success('Booking cancelled');
      queryClient.invalidateQueries(['booking', reference]);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const correctionMutation = useMutation({
    mutationFn: () => requestCorrection(booking.id),
    onSuccess: (data) => {
      toast.success('Correction booking created');
      navigate(`/booking/${data.data.booking.reference}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
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

  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canCorrect = booking.status === 'completed';
  const hasBalance = booking.status === 'completed' && booking.total_amount && (booking.total_amount - booking.deposit_amount) > 0;

  return (
    <>
      <Helmet><title>Booking {reference} | CleanPro</title></Helmet>
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/account/bookings" className="text-sage font-body text-sm hover:underline mb-4 inline-block">
            &larr; {t('account.bookings')}
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-bold text-charcoal">{booking.service?.name}</h1>
              <p className="text-sage font-display font-bold">{booking.reference}</p>
            </div>
            <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'error' : 'sage'}>
              {t(`account.status_${booking.status}`)}
            </Badge>
          </div>

          <Card className="space-y-4 mb-6">
            <Row label={t('booking.step2')} value={`${booking.city?.name} — ${booking.address}`} />
            <Row label={t('booking.step3')} value={format(new Date(booking.scheduled_at), 'PPp')} />
            <Row label={t('booking.frequency_label')} value={booking.frequency} />
            <Row label={t('booking.hours_label')} value={`${booking.estimated_hours}h`} />
            {booking.english_speaker_requested && <Row label={t('booking.english_label')} value="Yes" />}
            {booking.cleaner?.user && <Row label="Cleaner" value={booking.cleaner.user.name} />}
            {booking.notes && <Row label={t('booking.notes_label')} value={booking.notes} />}
          </Card>

          <Card className="space-y-3 mb-6">
            <h3 className="font-display font-bold text-charcoal">Payment</h3>
            <Row label={t('booking.deposit')} value={`€${booking.deposit_amount}`} />
            {booking.total_amount && <Row label="Total" value={`€${booking.total_amount}`} bold />}
            {booking.payments?.map(p => (
              <div key={p.id} className="flex justify-between text-sm font-body">
                <span className="text-gray-500 capitalize">{p.type}</span>
                <span className={p.status === 'paid' ? 'text-green-500' : p.status === 'failed' ? 'text-red-500' : 'text-gold'}>
                  €{p.amount} — {p.status}
                </span>
              </div>
            ))}
          </Card>

          <div className="flex flex-wrap gap-3">
            {canCancel && (
              <Button variant="outline" onClick={() => cancelMutation.mutate()} loading={cancelMutation.isPending}>
                {t('account.cancel_booking')}
              </Button>
            )}
            {canCorrect && (
              <Button variant="outline" onClick={() => correctionMutation.mutate()} loading={correctionMutation.isPending}>
                {t('account.request_correction')}
              </Button>
            )}
            <Link to="/book">
              <Button variant="ghost">{t('account.repeat_booking')}</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

const Row = ({ label, value, bold = false }) => (
  <div className="flex justify-between text-sm font-body">
    <span className="text-gray-500">{label}</span>
    <span className={`text-charcoal ${bold ? 'font-bold' : 'font-medium'}`}>{value}</span>
  </div>
);

export default AccountBookingDetail;
