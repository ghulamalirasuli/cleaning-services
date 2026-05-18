import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminGetQuotes,
  adminUpdateQuote,
  adminDeleteQuote,
  adminGetCities,
} from '../../api/admin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { format } from 'date-fns';

const statusColors = {
  new: 'gold',
  contacted: 'info',
  quoted: 'sage',
  won: 'success',
  lost: 'error',
};

const QUOTE_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'];

const AdminQuotes = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editQuote, setEditQuote] = useState(null);

  const { data } = useQuery({
    queryKey: ['admin-quotes', 'active'],
    queryFn: () => adminGetQuotes({ only_trashed: false }).then((r) => r.data),
  });

  const { data: citiesData } = useQuery({
    queryKey: ['admin-cities', 'active'],
    queryFn: () => adminGetCities({ only_trashed: false }).then((r) => r.data),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => adminUpdateQuote(id, { status }),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
    },
    onError: () => toast.error(t('common.error')),
  });

  const saveEditMutation = useMutation({
    mutationFn: () =>
      adminUpdateQuote(editQuote.id, {
        name: editQuote.name,
        email: editQuote.email,
        phone: editQuote.phone || null,
        company: editQuote.company || null,
        city_id: Number(editQuote.city_id),
        description: editQuote.description,
        status: editQuote.status,
      }),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setEditQuote(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteQuote(id),
    onSuccess: () => {
      toast.success(t('admin.moved_to_trash'));
      invalidate();
    },
    onError: () => toast.error(t('common.error')),
  });

  const quotes = data?.data || [];
  const cityOptions =
    citiesData?.data?.map((c) => ({ value: String(c.id), label: c.name })) || [];
  const statusOptions = QUOTE_STATUSES.map((s) => ({ value: s, label: s }));

  const nextStatuses = {
    new: 'contacted',
    contacted: 'quoted',
    quoted: 'won',
  };

  return (
    <>
      <Helmet>
        <title>{t('admin.quotes')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">{t('admin.quotes')}</h1>
          <Link
            to="/admin/trash"
            className="text-sm font-body text-gray-600 hover:text-charcoal underline underline-offset-2"
          >
            {t('admin.trash')}
          </Link>
        </div>
        <div className="space-y-3">
          {quotes.map((quote) => (
            <Card key={quote.id} className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-body font-bold text-charcoal">{quote.name}</span>
                  <Badge variant={statusColors[quote.status] || 'default'}>{quote.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 font-body">
                  {quote.email} {quote.phone ? `| ${quote.phone}` : ''}{' '}
                  {quote.company ? `| ${quote.company}` : ''}
                </p>
                <p className="text-xs text-gray-400 font-body mt-1">
                  {quote.city?.name} — {quote.description?.substring(0, 80)}
                  {quote.description?.length > 80 ? '…' : ''}
                </p>
                <p className="text-xs text-gray-300 font-body mt-1">
                  {format(new Date(quote.created_at), 'PPp')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditQuote({ ...quote })}>
                  {t('admin.edit')}
                </Button>
                {nextStatuses[quote.status] && (
                  <Button
                    size="sm"
                    onClick={() =>
                      updateMutation.mutate({ id: quote.id, status: nextStatuses[quote.status] })
                    }
                  >
                    → {nextStatuses[quote.status]}
                  </Button>
                )}
                {quote.status !== 'lost' && quote.status !== 'won' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateMutation.mutate({ id: quote.id, status: 'lost' })}
                  >
                    {t('admin.quote_lost')}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm(t('admin.confirm_move_trash'))) deleteMutation.mutate(quote.id);
                  }}
                >
                  {t('admin.delete')}
                </Button>
              </div>
            </Card>
          ))}
          {quotes.length === 0 && (
            <Card className="text-center py-8">
              <p className="text-gray-400 font-body">{t('admin.no_quotes')}</p>
            </Card>
          )}
        </div>

        <Modal
          isOpen={!!editQuote}
          onClose={() => setEditQuote(null)}
          title={t('admin.edit_quote')}
        >
          {editQuote && (
            <div className="space-y-4">
              <Input
                label={t('contact.name')}
                value={editQuote.name}
                onChange={(e) => setEditQuote({ ...editQuote, name: e.target.value })}
              />
              <Input
                label={t('contact.email')}
                type="email"
                value={editQuote.email}
                onChange={(e) => setEditQuote({ ...editQuote, email: e.target.value })}
              />
              <Input
                label={t('contact.phone')}
                value={editQuote.phone || ''}
                onChange={(e) => setEditQuote({ ...editQuote, phone: e.target.value })}
              />
              <Input
                label={t('contact.company')}
                value={editQuote.company || ''}
                onChange={(e) => setEditQuote({ ...editQuote, company: e.target.value })}
              />
              <Select
                label={t('contact.city')}
                value={String(editQuote.city_id)}
                onChange={(e) => setEditQuote({ ...editQuote, city_id: e.target.value })}
                options={cityOptions}
              />
              <Select
                label={t('admin.status')}
                value={editQuote.status}
                onChange={(e) => setEditQuote({ ...editQuote, status: e.target.value })}
                options={statusOptions}
              />
              <div>
                <label className="form-label">
                  {t('contact.message')}
                </label>
                <textarea
                  className="form-control min-h-[120px]"
                  value={editQuote.description || ''}
                  onChange={(e) => setEditQuote({ ...editQuote, description: e.target.value })}
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

export default AdminQuotes;
