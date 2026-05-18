import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminGetServiceExtras,
  adminCreateServiceExtra,
  adminUpdateServiceExtra,
  adminDeleteServiceExtra,
  adminListServices,
} from '../../api/admin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
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
  service_id: '',
  name: '',
  name_de: '',
  description: '',
  description_de: '',
  price: '0',
  requires_equipment: false,
  is_active: true,
});

const AdminServiceExtras = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [serviceFilter, setServiceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editExtra, setEditExtra] = useState(null);
  const [newExtra, setNewExtra] = useState(emptyForm);

  const { data: adminServicesPage } = useQuery({
    queryKey: ['admin-services', 'extras-dropdown'],
    queryFn: () => adminListServices({ per_page: 500 }).then((r) => r.data),
  });

  const services = adminServicesPage?.data || [];

  useEffect(() => {
    setPage(1);
  }, [serviceFilter]);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-service-extras', serviceFilter, page],
    queryFn: () =>
      adminGetServiceExtras({
        page,
        ...(serviceFilter ? { service_id: serviceFilter } : {}),
      }).then((r) => r.data),
  });

  const extras = data?.data || [];
  const lastPage = data?.last_page ?? 1;

  const serviceOptions = services.map((s) => ({ value: String(s.id), label: s.name }));

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-service-extras'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
    queryClient.invalidateQueries({ queryKey: ['admin-services'] });
  };

  const toPayload = (form) => ({
    service_id: Number(form.service_id),
    name: form.name.trim(),
    name_de: form.name_de?.trim() || null,
    description: form.description?.trim() || null,
    description_de: form.description_de?.trim() || null,
    price: Number.parseFloat(String(form.price).replace(',', '.')) || 0,
    requires_equipment: !!form.requires_equipment,
    is_active: form.is_active !== false,
  });

  const createMutation = useMutation({
    mutationFn: () => adminCreateServiceExtra(toPayload(newExtra)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setAddModal(false);
      setNewExtra(emptyForm());
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const saveEditMutation = useMutation({
    mutationFn: () =>
      adminUpdateServiceExtra(editExtra.id, toPayload(editExtra)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setEditExtra(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const toggleExtraActiveMutation = useMutation({
    mutationFn: ({ id, isActive }) =>
      adminUpdateServiceExtra(id, { is_active: !isActive }),
    onSuccess: () => invalidate(),
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteServiceExtra(id),
    onSuccess: () => {
      toast.success(t('admin.moved_to_trash'));
      invalidate();
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      toast.error(msg || t('common.error'));
    },
  });

  const openAdd = () => {
    setNewExtra({
      ...emptyForm(),
      service_id: serviceFilter ? String(serviceFilter) : '',
    });
    setAddModal(true);
  };

  return (
    <>
      <Helmet>
        <title>{t('admin.service_extras')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">
              {t('admin.service_extras')}
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-body dark:text-gray-400">
              {t('admin.extras_subtitle')}
            </p>
            <p className="mt-2 text-sm font-body">
              <Link
                to="/admin/services"
                className="font-medium text-sage hover:text-sage-dark hover:underline"
              >
                {t('admin.manage_main_services_link')}
              </Link>
            </p>
          </div>
          <Button size="sm" onClick={openAdd} className="shadow-sm w-fit">
            {t('admin.add_extra')}
          </Button>
        </div>

        <div className="mb-6 max-w-md">
          <Select
            label={t('admin.field_service')}
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            options={serviceOptions}
            placeholder={t('admin.filter_all_services')}
          />
        </div>

        <div className="space-y-3">
          {isLoading && (
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('common.loading')}</p>
          )}
          {!isLoading && extras.length === 0 && (
            <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('admin.no_extras')}</p>
          )}
          {!isLoading &&
            extras.map((extra) => {
              const isLive = extra.is_active !== false;
              const toggling =
                toggleExtraActiveMutation.isPending &&
                toggleExtraActiveMutation.variables?.id === extra.id;
              return (
            <Card
              key={extra.id}
              className={`border-gray-100 p-0 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-gray-800 ${
                !isLive ? 'opacity-80' : ''
              }`}
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-display text-lg font-semibold text-charcoal dark:text-gray-100">
                      {extra.name}
                    </span>
                    {extra.service?.name && (
                      <span className="rounded-md bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {extra.service.name}
                      </span>
                    )}
                    {!isLive && (
                      <span className="rounded-md bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                        {t('admin.status_inactive')}
                      </span>
                    )}
                    {extra.requires_equipment && (
                      <span className="rounded-md bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-200">
                        {t('services.equipment')}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 font-body dark:text-gray-400">
                    {isLive ? t('admin.extra_live_hint') : t('admin.extra_paused_hint')}
                  </p>
                  {extra.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-body line-clamp-2">
                      {extra.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm font-display font-bold text-charcoal dark:text-gray-200">
                    €{Number(extra.price).toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:border-t-0 sm:pt-0 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isLive}
                      onCheckedChange={(next) => {
                        if (next !== isLive) {
                          toggleExtraActiveMutation.mutate({
                            id: extra.id,
                            isActive: isLive,
                          });
                        }
                      }}
                      disabled={toggling}
                      ariaLabel={t('admin.switch_extra')}
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
                      setEditExtra({
                        ...extra,
                        service_id: String(extra.service_id),
                        price: String(extra.price),
                        name_de: extra.name_de || '',
                        description: extra.description || '',
                        description_de: extra.description_de || '',
                        is_active: extra.is_active !== false,
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
                        deleteMutation.mutate(extra.id);
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

        <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={t('admin.add_extra')}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Select
              label={t('admin.field_service')}
              value={newExtra.service_id}
              onChange={(e) => setNewExtra({ ...newExtra, service_id: e.target.value })}
              options={serviceOptions}
              placeholder={t('admin.select_service_placeholder')}
            />
            <Input
              label={t('admin.field_name_en')}
              value={newExtra.name}
              onChange={(e) => setNewExtra({ ...newExtra, name: e.target.value })}
            />
            <Input
              label={t('admin.field_name_de')}
              value={newExtra.name_de}
              onChange={(e) => setNewExtra({ ...newExtra, name_de: e.target.value })}
            />
            <div>
              <label className="form-label">
                {t('admin.field_description_en')}
              </label>
              <textarea
                className="form-control min-h-[80px]"
                value={newExtra.description}
                onChange={(e) => setNewExtra({ ...newExtra, description: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">
                {t('admin.field_description_de')}
              </label>
              <textarea
                className="form-control min-h-[80px]"
                value={newExtra.description_de}
                onChange={(e) => setNewExtra({ ...newExtra, description_de: e.target.value })}
              />
            </div>
            <Input
              label={t('admin.field_price')}
              type="text"
              inputMode="decimal"
              value={newExtra.price}
              onChange={(e) => setNewExtra({ ...newExtra, price: e.target.value })}
            />
            <div className="flex items-center gap-3">
              <Switch
                checked={newExtra.requires_equipment}
                onCheckedChange={(v) =>
                  setNewExtra({ ...newExtra, requires_equipment: v })
                }
                ariaLabel={t('admin.field_requires_equipment')}
              />
              <span className="text-sm font-body text-charcoal dark:text-gray-200">
                {t('admin.field_requires_equipment')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={newExtra.is_active !== false}
                onCheckedChange={(v) => setNewExtra({ ...newExtra, is_active: v })}
                ariaLabel={t('admin.switch_extra')}
              />
              <span className="text-sm font-body text-charcoal dark:text-gray-200">
                {t('admin.switch_extra')}
              </span>
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!newExtra.service_id || !newExtra.name?.trim()}
            >
              {t('admin.save')}
            </Button>
          </div>
        </Modal>

        <Modal
          isOpen={!!editExtra}
          onClose={() => setEditExtra(null)}
          title={t('admin.edit_extra')}
        >
          {editExtra && (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <Select
                label={t('admin.field_service')}
                value={editExtra.service_id}
                onChange={(e) => setEditExtra({ ...editExtra, service_id: e.target.value })}
                options={serviceOptions}
                placeholder={t('admin.select_service_placeholder')}
              />
              <Input
                label={t('admin.field_name_en')}
                value={editExtra.name}
                onChange={(e) => setEditExtra({ ...editExtra, name: e.target.value })}
              />
              <Input
                label={t('admin.field_name_de')}
                value={editExtra.name_de}
                onChange={(e) => setEditExtra({ ...editExtra, name_de: e.target.value })}
              />
              <div>
                <label className="form-label">
                  {t('admin.field_description_en')}
                </label>
                <textarea
                  className="form-control min-h-[80px]"
                  value={editExtra.description}
                  onChange={(e) => setEditExtra({ ...editExtra, description: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">
                  {t('admin.field_description_de')}
                </label>
                <textarea
                  className="form-control min-h-[80px]"
                  value={editExtra.description_de}
                  onChange={(e) => setEditExtra({ ...editExtra, description_de: e.target.value })}
                />
              </div>
              <Input
                label={t('admin.field_price')}
                type="text"
                inputMode="decimal"
                value={editExtra.price}
                onChange={(e) => setEditExtra({ ...editExtra, price: e.target.value })}
              />
              <div className="flex items-center gap-3">
                <Switch
                  checked={!!editExtra.requires_equipment}
                  onCheckedChange={(v) =>
                    setEditExtra({ ...editExtra, requires_equipment: v })
                  }
                  ariaLabel={t('admin.field_requires_equipment')}
                />
                <span className="text-sm font-body text-charcoal dark:text-gray-200">
                  {t('admin.field_requires_equipment')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editExtra.is_active !== false}
                  onCheckedChange={(v) =>
                    setEditExtra({ ...editExtra, is_active: v })
                  }
                  ariaLabel={t('admin.switch_extra')}
                />
                <span className="text-sm font-body text-charcoal dark:text-gray-200">
                  {t('admin.switch_extra')}
                </span>
              </div>
              <Button
                onClick={() => saveEditMutation.mutate()}
                loading={saveEditMutation.isPending}
                disabled={!editExtra.service_id || !editExtra.name?.trim()}
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

export default AdminServiceExtras;
