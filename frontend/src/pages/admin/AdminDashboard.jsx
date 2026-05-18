import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { adminGetBookings } from '../../api/admin';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => adminGetBookings().then(r => r.data),
  });

  const bookings = data?.data || [];
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.scheduled_at?.startsWith(today)).length;
  const pendingAssignments = bookings.filter(b => b.status === 'confirmed' && !b.cleaner_id).length;
  const completedThisMonth = bookings.filter(b => b.status === 'completed').length;

  return (
    <>
      <Helmet><title>{t('admin.title')} | CleanPro</title></Helmet>
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100 mb-8">{t('admin.title')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <p className="text-sm text-gray-500 font-body mb-1">{t('admin.today')}</p>
            <p className="text-4xl font-display font-bold text-charcoal">{todayBookings}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 font-body mb-1">{t('admin.pending')}</p>
            <p className="text-4xl font-display font-bold text-gold">{pendingAssignments}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 font-body mb-1">{t('admin.bookings')}</p>
            <p className="text-4xl font-display font-bold text-charcoal">{bookings.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500 font-body mb-1">Completed</p>
            <p className="text-4xl font-display font-bold text-sage">{completedThisMonth}</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
