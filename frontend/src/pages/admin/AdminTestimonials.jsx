import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminListTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminDeleteTestimonial,
} from '../../api/admin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Switch from '../../components/ui/Switch';

function IconPencil({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
      />
    </svg>
  );
}

function IconTrash({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}

const emptyForm = () => ({
  author_name: '',
  author_name_de: '',
  body: '',
  body_de: '',
  rating: '5',
  sort_order: '0',
  is_active: true,
});

const toPayload = (form) => ({
  author_name: form.author_name.trim(),
  author_name_de: form.author_name_de?.trim() || null,
  body: form.body.trim(),
  body_de: form.body_de?.trim() || null,
  rating: Math.min(5, Math.max(1, Number.parseInt(String(form.rating), 10) || 5)),
  sort_order: Math.max(0, Number.parseInt(String(form.sort_order), 10) || 0),
  is_active: !!form.is_active,
});

const AdminTestimonials = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [newRow, setNewRow] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-testimonials', page],
    queryFn: () => adminListTestimonials({ page }).then((r) => r.data),
  });

  const rows = data?.data || [];
  const lastPage = data?.last_page ?? 1;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const createMutation = useMutation({
    mutationFn: () => adminCreateTestimonial(toPayload(newRow)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setAddModal(false);
      setNewRow(emptyForm());
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const saveEditMutation = useMutation({
    mutationFn: () => adminUpdateTestimonial(editRow.id, toPayload(editRow)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setEditRow(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteTestimonial(id),
    onSuccess: () => {
      toast.success(t('admin.moved_to_trash'));
      invalidate();
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminUpdateTestimonial(id, { is_active: !isActive }),
    onSuccess: () => invalidate(),
    onError: () => toast.error(t('common.error')),
  });

  return (
    <>
      <Helmet>
        <title>{t('admin.testimonials')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">
              {t('admin.testimonials')}
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-body dark:text-gray-400">
              {t('admin.testimonials_subtitle')}
            </p>
            <p className="mt-2 text-sm font-body">
              <Link
                to="/admin/trash"
                className="font-medium text-sage hover:text-sage-dark hover:underline"
              >
                {t('admin.trash')} →
              </Link>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setNewRow(emptyForm());
              setAddModal(true);
            }}
            className="shadow-sm w-fit"
          >
            {t('admin.add_testimonial')}
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('common.loading')}</p>
          )}
          {!isLoading && rows.length === 0 && (
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('admin.no_testimonials')}</p>
          )}
          {!isLoading &&
            rows.map((row) => {
              const isLive = row.is_active !== false;
              const toggling =
                toggleActiveMutation.isPending &&
                toggleActiveMutation.variables?.id === row.id;
              return (
                <Card
                  key={row.id}
                  className={`border-gray-100 p-0 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-800 ${
                    !isLive ? 'opacity-80' : ''
                  }`}
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="font-display text-lg font-semibold text-charcoal dark:text-gray-100">
                          {row.author_name}
                        </span>
                        {!isLive && (
                          <span className="rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {t('admin.status_inactive')}
                          </span>
                        )}
                        <span className="rounded-md bg-gold/15 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-200">
                          {row.rating}★
                        </span>
                        <span className="text-xs text-gray-400 font-body">
                          #{row.sort_order ?? 0}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-body line-clamp-3">
                        {row.body}
                      </p>
                    </div>
                    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:border-t-0 sm:pt-0 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={isLive}
                          onCheckedChange={(next) => {
                            if (next !== isLive) {
                              toggleActiveMutation.mutate({ id: row.id, isActive: isLive });
                            }
                          }}
                          disabled={toggling}
                          ariaLabel={t('admin.switch_testimonial')}
                        />
                        <span
                          className={`text-sm font-semibold font-body ${
                            isLive ? 'text-sage-dark dark:text-sage-light' : 'text-gray-400'
                          }`}
                          aria-hidden
                        >
                          {isLive ? t('admin.status_active') : t('admin.status_inactive')}
                        </span>
                      </div>
                      <div className="hidden h-9 w-px bg-gray-200 dark:bg-gray-700 sm:block" aria-hidden />
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="muted"
                          className="gap-1.5"
                          onClick={() =>
                            setEditRow({
                              ...row,
                              rating: String(row.rating),
                              sort_order: String(row.sort_order ?? 0),
                              author_name_de: row.author_name_de || '',
                              body_de: row.body_de || '',
                              is_active: row.is_active !== false,
                            })
                          }
                        >
                          <IconPencil />
                          {t('admin.edit')}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="dangerOutline"
                          className="gap-1.5"
                          onClick={() => {
                            if (window.confirm(t('admin.confirm_move_trash')))
                              deleteMutation.mutate(row.id);
                          }}
                        >
                          <IconTrash />
                          {t('admin.delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>

        {lastPage > 1 && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">
              {t('booking.extras_page_indicator', { current: page, total: lastPage })}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="muted"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t('booking.extras_prev')}
              </Button>
              <Button
                type="button"
                variant="muted"
                size="sm"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
              >
                {t('booking.extras_next')}
              </Button>
            </div>
          </div>
        )}

        <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={t('admin.add_testimonial')}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label={t('admin.field_author_en')}
              value={newRow.author_name}
              onChange={(e) => setNewRow({ ...newRow, author_name: e.target.value })}
            />
            <Input
              label={t('admin.field_author_de')}
              value={newRow.author_name_de}
              onChange={(e) => setNewRow({ ...newRow, author_name_de: e.target.value })}
            />
            <div>
              <label className="form-label">
                {t('admin.field_body_en')}
              </label>
              <textarea
                className="form-control min-h-[88px]"
                value={newRow.body}
                onChange={(e) => setNewRow({ ...newRow, body: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">
                {t('admin.field_body_de')}
              </label>
              <textarea
                className="form-control min-h-[88px]"
                value={newRow.body_de}
                onChange={(e) => setNewRow({ ...newRow, body_de: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t('admin.field_rating')}
                type="number"
                min={1}
                max={5}
                value={newRow.rating}
                onChange={(e) => setNewRow({ ...newRow, rating: e.target.value })}
              />
              <Input
                label={t('admin.field_sort_order')}
                type="number"
                min={0}
                value={newRow.sort_order}
                onChange={(e) => setNewRow({ ...newRow, sort_order: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={newRow.is_active}
                onCheckedChange={(v) => setNewRow({ ...newRow, is_active: v })}
                ariaLabel={t('admin.switch_testimonial')}
              />
              <span className="text-sm font-body text-charcoal dark:text-gray-200">
                {t('admin.switch_testimonial')}
              </span>
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!newRow.author_name?.trim() || !newRow.body?.trim()}
            >
              {t('admin.save')}
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={!!editRow}
          onClose={() => setEditRow(null)}
          title={t('admin.edit_testimonial')}
        >
          {editRow && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <Input
                label={t('admin.field_author_en')}
                value={editRow.author_name}
                onChange={(e) => setEditRow({ ...editRow, author_name: e.target.value })}
              />
              <Input
                label={t('admin.field_author_de')}
                value={editRow.author_name_de}
                onChange={(e) => setEditRow({ ...editRow, author_name_de: e.target.value })}
              />
              <div>
                <label className="form-label">
                  {t('admin.field_body_en')}
                </label>
                <textarea
                  className="form-control min-h-[88px]"
                  value={editRow.body}
                  onChange={(e) => setEditRow({ ...editRow, body: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">
                  {t('admin.field_body_de')}
                </label>
                <textarea
                  className="form-control min-h-[88px]"
                  value={editRow.body_de}
                  onChange={(e) => setEditRow({ ...editRow, body_de: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('admin.field_rating')}
                  type="number"
                  min={1}
                  max={5}
                  value={editRow.rating}
                  onChange={(e) => setEditRow({ ...editRow, rating: e.target.value })}
                />
                <Input
                  label={t('admin.field_sort_order')}
                  type="number"
                  min={0}
                  value={editRow.sort_order}
                  onChange={(e) => setEditRow({ ...editRow, sort_order: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!editRow.is_active}
                  onCheckedChange={(v) => setEditRow({ ...editRow, is_active: v })}
                  ariaLabel={t('admin.switch_testimonial')}
                />
                <span className="text-sm font-body text-charcoal dark:text-gray-200">
                  {t('admin.switch_testimonial')}
                </span>
              </div>
              <Button
                onClick={() => saveEditMutation.mutate()}
                loading={saveEditMutation.isPending}
                disabled={!editRow.author_name?.trim() || !editRow.body?.trim()}
              >
                {t('admin.save')}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminTestimonials;
