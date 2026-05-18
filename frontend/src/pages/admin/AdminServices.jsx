import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminListServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
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
  name: '',
  name_de: '',
  description: '',
  description_de: '',
  hourly_rate: '0',
  is_quote_based: false,
  is_active: true,
  slug: '',
});

const toCreatePayload = (form) => {
  const payload = {
    name: form.name.trim(),
    name_de: form.name_de?.trim() || null,
    description: form.description.trim(),
    description_de: form.description_de?.trim() || null,
    hourly_rate: Number.parseFloat(String(form.hourly_rate).replace(',', '.')) || 0,
    is_quote_based: !!form.is_quote_based,
    is_active: !!form.is_active,
  };
  if (form.slug?.trim()) {
    payload.slug = form.slug.trim();
  }
  return payload;
};

const toUpdatePayload = (form) => ({
  name: form.name.trim(),
  name_de: form.name_de?.trim() || null,
  description: form.description.trim(),
  description_de: form.description_de?.trim() || null,
  hourly_rate: Number.parseFloat(String(form.hourly_rate).replace(',', '.')) || 0,
  is_quote_based: !!form.is_quote_based,
  is_active: !!form.is_active,
  slug: form.slug?.trim() || '',
});

const AdminServices = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [newService, setNewService] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services', page],
    queryFn: () => adminListServices({ page }).then((r) => r.data),
  });

  const services = data?.data || [];
  const lastPage = data?.last_page ?? 1;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
  };

  const createMutation = useMutation({
    mutationFn: () => adminCreateService(toCreatePayload(newService)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setAddModal(false);
      setNewService(emptyForm());
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const saveEditMutation = useMutation({
    mutationFn: () => adminUpdateService(editService.id, toUpdatePayload(editService)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setEditService(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteService(id),
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
    mutationFn: ({ id, isActive }) => adminUpdateService(id, { is_active: !isActive }),
    onSuccess: () => invalidate(),
    onError: () => toast.error(t('common.error')),
  });

  return (
    <>
      <Helmet>
        <title>{t('admin.services')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">
              {t('admin.services')}
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-body dark:text-gray-400">
              {t('admin.manage_services_subtitle')}
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setNewService(emptyForm());
              setAddModal(true);
            }}
            className="shadow-sm w-fit"
          >
            {t('admin.add_service')}
          </Button>
        </div>

        <div className="space-y-3">
          {isLoading && (
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('common.loading')}</p>
          )}
          {!isLoading && services.length === 0 && (
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('admin.no_services')}</p>
          )}
          {!isLoading &&
            services.map((svc) => {
              const isLive = svc.is_active !== false;
              const toggling =
                toggleActiveMutation.isPending &&
                toggleActiveMutation.variables?.id === svc.id;

              return (
              <Card
                key={svc.id}
                className={`border-gray-100 p-0 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-800 ${
                  !isLive ? 'opacity-80' : ''
                }`}
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="font-display text-lg font-semibold text-charcoal dark:text-gray-100">
                        {svc.name}
                      </span>
                      {!isLive && (
                        <span className="rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {t('admin.status_inactive')}
                        </span>
                      )}
                      {svc.is_quote_based && (
                        <span className="rounded-md bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-200">
                          {t('services.quote_based')}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 font-body dark:text-gray-400">
                      /services/{svc.slug}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 font-body dark:text-gray-400">
                      {isLive ? t('admin.service_live_hint') : t('admin.service_paused_hint')}
                    </p>
                    {svc.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-body line-clamp-2">
                        {svc.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-body text-gray-600 dark:text-gray-400">
                      <span className="font-display font-bold text-charcoal dark:text-gray-200">
                        €{Number(svc.hourly_rate).toFixed(2)}
                        <span className="font-body font-normal text-gray-500">{t('common.per_hour')}</span>
                      </span>
                      <span>
                        {t('admin.service_extras')}: {svc.extras_count ?? 0}
                      </span>
                      <span>
                        {t('admin.bookings')}: {svc.bookings_count ?? 0}
                      </span>
                    </div>
                    {isLive ? (
                      <Link
                        to={`/services/${svc.slug}`}
                        className="mt-2 inline-block text-sm text-sage font-body hover:underline"
                      >
                        {t('services.details')} →
                      </Link>
                    ) : (
                      <p className="mt-2 text-sm text-gray-400 font-body">
                        {t('admin.service_public_hidden')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:border-t-0 sm:pt-0 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={isLive}
                        onCheckedChange={(next) => {
                          if (next !== isLive) {
                            toggleActiveMutation.mutate({ id: svc.id, isActive: isLive });
                          }
                        }}
                        disabled={toggling}
                        ariaLabel={t('admin.switch_service')}
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
                        setEditService({
                          ...svc,
                          hourly_rate: String(svc.hourly_rate),
                          name_de: svc.name_de || '',
                          description_de: svc.description_de || '',
                          is_active: svc.is_active !== false,
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
                        if (window.confirm(t('admin.confirm_move_trash_service')))
                          deleteMutation.mutate(svc.id);
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

        <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={t('admin.add_service')}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input
              label={t('admin.field_name_en')}
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <Input
              label={t('admin.field_name_de')}
              value={newService.name_de}
              onChange={(e) => setNewService({ ...newService, name_de: e.target.value })}
            />
            <div>
              <label className="form-label">
                {t('admin.field_slug')}
              </label>
              <p className="text-xs text-gray-500 font-body mb-2 dark:text-gray-400">
                {t('admin.field_slug_hint')}
              </p>
              <input
                type="text"
                className="form-control"
                value={newService.slug}
                onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                placeholder="e.g. deep-cleaning"
              />
            </div>
            <div>
              <label className="form-label">
                {t('admin.field_description_en')}
              </label>
              <textarea
                required
                className="form-control min-h-[80px]"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">
                {t('admin.field_description_de')}
              </label>
              <textarea
                className="form-control min-h-[80px]"
                value={newService.description_de}
                onChange={(e) => setNewService({ ...newService, description_de: e.target.value })}
              />
            </div>
            <Input
              label={t('admin.field_hourly_rate')}
              type="text"
              inputMode="decimal"
              value={newService.hourly_rate}
              onChange={(e) => setNewService({ ...newService, hourly_rate: e.target.value })}
            />
            <div className="flex items-center gap-3">
              <Switch
                checked={newService.is_quote_based}
                onCheckedChange={(v) =>
                  setNewService({ ...newService, is_quote_based: v })
                }
                ariaLabel={t('admin.field_quote_based')}
              />
              <span className="text-sm font-body text-charcoal dark:text-gray-200">
                {t('admin.field_quote_based')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={newService.is_active}
                onCheckedChange={(v) =>
                  setNewService({ ...newService, is_active: v })
                }
                ariaLabel={t('admin.field_service_active')}
              />
              <span className="text-sm font-body text-charcoal dark:text-gray-200">
                {t('admin.field_service_active')}
              </span>
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!newService.name?.trim() || !newService.description?.trim()}
            >
              {t('admin.save')}
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={!!editService}
          onClose={() => setEditService(null)}
          title={t('admin.edit_service')}
        >
          {editService && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <Input
                label={t('admin.field_name_en')}
                value={editService.name}
                onChange={(e) => setEditService({ ...editService, name: e.target.value })}
              />
              <Input
                label={t('admin.field_name_de')}
                value={editService.name_de}
                onChange={(e) => setEditService({ ...editService, name_de: e.target.value })}
              />
              <div>
                <label className="form-label">
                  {t('admin.field_slug')}
                </label>
                <p className="text-xs text-gray-500 font-body mb-2 dark:text-gray-400">
                  {t('admin.field_slug_hint_edit')}
                </p>
                <input
                  type="text"
                  className="form-control"
                  value={editService.slug}
                  onChange={(e) => setEditService({ ...editService, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">
                  {t('admin.field_description_en')}
                </label>
                <textarea
                  required
                  className="form-control min-h-[80px]"
                  value={editService.description}
                  onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">
                  {t('admin.field_description_de')}
                </label>
                <textarea
                  className="form-control min-h-[80px]"
                  value={editService.description_de}
                  onChange={(e) => setEditService({ ...editService, description_de: e.target.value })}
                />
              </div>
              <Input
                label={t('admin.field_hourly_rate')}
                type="text"
                inputMode="decimal"
                value={editService.hourly_rate}
                onChange={(e) => setEditService({ ...editService, hourly_rate: e.target.value })}
              />
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!editService.is_quote_based}
                  onCheckedChange={(v) =>
                    setEditService({ ...editService, is_quote_based: v })
                  }
                  ariaLabel={t('admin.field_quote_based')}
                />
                <span className="text-sm font-body text-charcoal dark:text-gray-200">
                  {t('admin.field_quote_based')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!editService.is_active}
                  onCheckedChange={(v) =>
                    setEditService({ ...editService, is_active: v })
                  }
                  ariaLabel={t('admin.field_service_active')}
                />
                <span className="text-sm font-body text-charcoal dark:text-gray-200">
                  {t('admin.field_service_active')}
                </span>
              </div>
              <Button
                onClick={() => saveEditMutation.mutate()}
                loading={saveEditMutation.isPending}
                disabled={
                  !editService.name?.trim() ||
                  !editService.description?.trim() ||
                  !editService.slug?.trim()
                }
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

export default AdminServices;
