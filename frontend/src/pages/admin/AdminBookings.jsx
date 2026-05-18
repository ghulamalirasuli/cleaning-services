import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminGetBookings,
  adminAssignCleaner,
  adminCompleteBooking,
  adminUpdateBooking,
  adminDeleteBooking,
  adminGetCleaners,
} from '../../api/admin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { format } from 'date-fns';

const BOOKING_STATUSES = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

const AdminBookings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [assignModal, setAssignModal] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);
  const [editBooking, setEditBooking] = useState(null);
  const [selectedCleaner, setSelectedCleaner] = useState('');
  const [actualHours, setActualHours] = useState('');

  const { data } = useQuery({
    queryKey: ['admin-bookings', statusFilter, 'active'],
    queryFn: () =>
      adminGetBookings({
        only_trashed: false,
        ...(statusFilter ? { status: statusFilter } : {}),
      }).then((r) => r.data),
  });

  const { data: cleanersData } = useQuery({
    queryKey: ['admin-cleaners', 'active'],
    queryFn: () => adminGetCleaners({ only_trashed: false }).then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });

  const assignMutation = useMutation({
    mutationFn: ({ id, cleanerId }) => adminAssignCleaner(id, cleanerId),
    onSuccess: () => {
      toast.success(t('admin.toast_cleaner_assigned'));
      invalidate();
      setAssignModal(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, hours }) => adminCompleteBooking(id, hours),
    onSuccess: () => {
      toast.success(t('admin.toast_booking_completed'));
      invalidate();
      setCompleteModal(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  const saveEditMutation = useMutation({
    mutationFn: () =>
      adminUpdateBooking(editBooking.id, {
        status: editBooking.status,
        notes: editBooking.notes || null,
      }),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setEditBooking(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteBooking(id),
    onSuccess: () => {
      toast.success(t('admin.moved_to_trash'));
      invalidate();
    },
    onError: () => toast.error(t('common.error')),
  });

  const bookings = data?.data || [];
  const cleaners = cleanersData?.data || [];
  const statusSelectOptions = BOOKING_STATUSES.map((s) => ({ value: s, label: s }));

  const statuses = ['', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

  return (
    <>
      <Helmet>
        <title>{t('admin.bookings')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">{t('admin.bookings')}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to="/admin/trash"
              className="text-sm font-body text-gray-600 hover:text-charcoal underline underline-offset-2"
            >
              {t('admin.trash')}
            </Link>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
                    statusFilter === s ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s || t('admin.filter_all')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id} className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-body font-bold text-charcoal text-sm">{booking.reference}</span>
                  <Badge
                    variant={
                      booking.status === 'completed'
                        ? 'success'
                        : booking.status === 'cancelled'
                          ? 'error'
                          : 'sage'
                    }
                  >
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 font-body">
                  {booking.user?.name} — {booking.service?.name} — {booking.city?.name}
                </p>
                <p className="text-xs text-gray-400 font-body">
                  {booking.scheduled_at ? format(new Date(booking.scheduled_at), 'PPp') : ''}
                  {booking.cleaner?.user ? ` | Cleaner: ${booking.cleaner.user.name}` : ''}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditBooking({ ...booking })}>
                  {t('admin.edit')}
                </Button>
                {!booking.cleaner_id && booking.status !== 'cancelled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAssignModal(booking);
                      setSelectedCleaner('');
                    }}
                  >
                    {t('admin.assign_cleaner')}
                  </Button>
                )}
                {booking.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setCompleteModal(booking);
                      setActualHours(String(booking.estimated_hours));
                    }}
                  >
                    {t('admin.mark_complete')}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm(t('admin.confirm_move_trash'))) deleteMutation.mutate(booking.id);
                  }}
                >
                  {t('admin.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={!!assignModal}
          onClose={() => setAssignModal(null)}
          title={t('admin.assign_cleaner')}
        >
          <Select
            label="Cleaner"
            value={selectedCleaner}
            onChange={(e) => setSelectedCleaner(e.target.value)}
            options={cleaners.map((c) => ({ value: String(c.id), label: `${c.user?.name} — ${c.city?.name}` }))}
            placeholder="Select cleaner..."
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() =>
                assignMutation.mutate({ id: assignModal?.id, cleanerId: selectedCleaner })
              }
              disabled={!selectedCleaner}
              loading={assignMutation.isPending}
            >
              {t('admin.assign_cleaner')}
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={!!completeModal}
          onClose={() => setCompleteModal(null)}
          title={t('admin.mark_complete')}
        >
          <Input
            label={t('admin.actual_hours')}
            type="number"
            value={actualHours}
            onChange={(e) => setActualHours(e.target.value)}
            min="1"
            step="0.5"
          />
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() =>
                completeMutation.mutate({ id: completeModal?.id, hours: Number(actualHours) })
              }
              disabled={!actualHours}
              loading={completeMutation.isPending}
            >
              {t('admin.mark_complete')}
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={!!editBooking}
          onClose={() => setEditBooking(null)}
          title={t('admin.edit_booking')}
        >
          {editBooking && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 font-body">{editBooking.reference}</p>
              <Select
                label={t('admin.status')}
                value={editBooking.status}
                onChange={(e) => setEditBooking({ ...editBooking, status: e.target.value })}
                options={statusSelectOptions}
              />
              <div>
                <label className="form-label">
                  {t('booking.notes_label')}
                </label>
                <textarea
                  className="form-control min-h-[100px]"
                  value={editBooking.notes || ''}
                  onChange={(e) => setEditBooking({ ...editBooking, notes: e.target.value })}
                />
              </div>
              <Button onClick={() => saveEditMutation.mutate()} loading={saveEditMutation.isPending}>
                {t('admin.save')}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminBookings;
