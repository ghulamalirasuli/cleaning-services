import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../../api/bookings';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { format } from 'date-fns';

const tabs = ['upcoming', 'past', 'cancelled'];

const AccountBookings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings().then(r => r.data),
  });

  const bookings = data?.data || [];
  const filtered = bookings.filter(b => {
    if (activeTab === 'upcoming') return ['pending', 'confirmed', 'in_progress'].includes(b.status);
    if (activeTab === 'past') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  return (
    <>
      <Helmet><title>{t('account.bookings')} | CleanPro</title></Helmet>
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-display font-bold text-charcoal mb-8">{t('account.bookings')}</h1>

          <div className="flex gap-2 mb-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  activeTab === tab ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t(`account.tabs_${tab}`)}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(i => <Card key={i}><Skeleton className="h-20" /></Card>)}
            </div>
          ) : filtered.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-400 font-body">{t('account.no_bookings')}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map(booking => (
                <Link key={booking.id} to={`/account/bookings/${booking.reference}`}>
                  <Card hover className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-charcoal">{booking.service?.name}</h3>
                        <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'error' : 'sage'}>
                          {t(`account.status_${booking.status}`)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 font-body">
                        {format(new Date(booking.scheduled_at), 'PPp')} — {booking.city?.name}
                      </p>
                      <p className="text-xs text-gray-400 font-body mt-1">Ref: {booking.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-charcoal">€{booking.deposit_amount}</p>
                      <p className="text-xs text-gray-400 font-body">{t('booking.deposit')}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AccountBookings;
