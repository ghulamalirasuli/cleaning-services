import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminGetCities, adminCreateCity, adminUpdateCity, adminDeleteCity } from '../../api/admin';
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

function IconTrashBin({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}

const AdminCities = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [addModal, setAddModal] = useState(false);
  const [editCity, setEditCity] = useState(null);
  const [newCity, setNewCity] = useState({ name: '', country_code: 'DE' });

  const { data } = useQuery({
    queryKey: ['admin-cities', 'active'],
    queryFn: () => adminGetCities({ only_trashed: false }).then((r) => r.data),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
  };

  const createMutation = useMutation({
    mutationFn: () => adminCreateCity(newCity),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setAddModal(false);
      setNewCity({ name: '', country_code: 'DE' });
    },
    onError: () => toast.error(t('common.error')),
  });

  const saveEditMutation = useMutation({
    mutationFn: () =>
      adminUpdateCity(editCity.id, {
        name: editCity.name,
        country_code: editCity.country_code,
      }),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setEditCity(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminUpdateCity(id, { is_active: !isActive }),
    onSuccess: () => invalidate(),
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminDeleteCity(id),
    onSuccess: () => {
      toast.success(t('admin.moved_to_trash'));
      invalidate();
    },
    onError: () => toast.error(t('common.error')),
  });

  const cities = data?.data || [];

  return (
    <>
      <Helmet>
        <title>{t('admin.cities')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">{t('admin.cities')}</h1>
            <p className="mt-1 text-sm text-gray-500 font-body">
              {t('admin.cities_subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/trash"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50/80 font-body"
            >
              <IconTrashBin className="w-4 h-4 text-gray-500" />
              {t('admin.trash')}
            </Link>
            <Button size="sm" onClick={() => setAddModal(true)} className="shadow-sm">
              {t('admin.add_new')}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {cities.map((city) => {
            const initial = city.name?.trim()?.slice(0, 2)?.toUpperCase() || '—';
            const toggling =
              toggleMutation.isPending && toggleMutation.variables?.id === city.id;

            return (
              <Card
                key={city.id}
                className="border-gray-100 p-0 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold font-body tracking-tight ${
                        city.is_active
                          ? 'bg-sage/15 text-sage-dark ring-1 ring-sage/25'
                          : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200/80'
                      }`}
                      aria-hidden
                    >
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="truncate font-display text-lg font-semibold text-charcoal">
                          {city.name}
                        </span>
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          {city.country_code}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500 font-body">
                        {city.is_active ? t('admin.city_live_hint') : t('admin.city_paused_hint')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:border-t-0 sm:pt-0">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={!!city.is_active}
                        onCheckedChange={(next) => {
                          if (next !== city.is_active) {
                            toggleMutation.mutate({ id: city.id, isActive: city.is_active });
                          }
                        }}
                        disabled={toggling}
                        ariaLabel={t('admin.switch_city')}
                      />
                      <span
                        className={`text-sm font-semibold font-body ${
                          city.is_active ? 'text-sage-dark' : 'text-gray-400'
                        }`}
                        aria-hidden
                      >
                        {city.is_active ? t('admin.status_active') : t('admin.status_inactive')}
                      </span>
                    </div>
                    <div className="hidden h-9 w-px bg-gray-200 sm:block" aria-hidden />
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="muted"
                        className="gap-1.5"
                        onClick={() => setEditCity({ ...city })}
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
                            deleteMutation.mutate(city.id);
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

        <Modal isOpen={addModal} onClose={() => setAddModal(false)} title={t('admin.add_city')}>
          <div className="space-y-4">
            <Input
              label={t('contact.city')}
              value={newCity.name}
              onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
            />
            <Input
              label={t('admin.field_country_code')}
              value={newCity.country_code}
              onChange={(e) => setNewCity({ ...newCity, country_code: e.target.value.toUpperCase() })}
            />
            <Button
              onClick={() => createMutation.mutate()}
              loading={createMutation.isPending}
              disabled={!newCity.name}
            >
              {t('admin.save')}
            </Button>
          </div>
        </Modal>

        <Modal isOpen={!!editCity} onClose={() => setEditCity(null)} title={t('admin.edit_city')}>
          {editCity && (
            <div className="space-y-4">
              <Input
                label={t('contact.city')}
                value={editCity.name}
                onChange={(e) => setEditCity({ ...editCity, name: e.target.value })}
              />
              <Input
                label={t('admin.field_country_code')}
                value={editCity.country_code}
                onChange={(e) =>
                  setEditCity({ ...editCity, country_code: e.target.value.toUpperCase() })
                }
              />
              <Button
                onClick={() => saveEditMutation.mutate()}
                loading={saveEditMutation.isPending}
                disabled={!editCity.name}
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

export default AdminCities;
