import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getBookings } from '../../api/bookings';
import useAuthStore from '../../store/authStore';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Account = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => getBookings().then(r => r.data),
  });

  const bookings = data?.data || [];
  const upcoming = bookings.find(b => ['pending', 'confirmed'].includes(b.status));
  const totalBookings = bookings.length;
  const activeSubscriptions = bookings.filter(b => b.frequency !== 'once' && b.status !== 'cancelled').length;

  return (
    <>
      <Helmet><title>{t('account.title')} | CleanPro</title></Helmet>
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp}>
            <h1 className="text-3xl font-display font-bold text-charcoal mb-2">
              {t('account.welcome')}, {user?.name}!
            </h1>
            <p className="text-gray-500 font-body mb-8">{t('account.dashboard')}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <Card>
              <p className="text-sm text-gray-500 font-body mb-1">{t('account.total_bookings')}</p>
              <p className="text-3xl font-display font-bold text-charcoal">{totalBookings}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500 font-body mb-1">{t('account.active_subs')}</p>
              <p className="text-3xl font-display font-bold text-charcoal">{activeSubscriptions}</p>
            </Card>
            <Card className="flex items-center justify-center">
              <Link to="/book"><Button>{t('nav.book')}</Button></Link>
            </Card>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-display font-bold text-charcoal mb-4">{t('account.upcoming')}</h2>
            {upcoming ? (
              <Card className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-charcoal">{upcoming.service?.name}</h3>
                  <p className="text-sm text-gray-500 font-body">
                    {format(new Date(upcoming.scheduled_at), 'PPp')} — {upcoming.city?.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="sage">{t(`account.status_${upcoming.status}`)}</Badge>
                  <Link to={`/account/bookings/${upcoming.reference}`}>
                    <Button size="sm" variant="outline">{t('services.details')}</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <Card className="text-center py-8">
                <p className="text-gray-400 font-body">{t('account.no_upcoming')}</p>
                <Link to="/book" className="mt-4 inline-block">
                  <Button size="sm">{t('nav.book')}</Button>
                </Link>
              </Card>
            )}
          </div>

          <Link to="/account/bookings">
            <Button variant="outline">{t('account.bookings')} &rarr;</Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Account;
