import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminGetCities,
  adminGetCleaners,
  adminGetQuotes,
  adminGetBookings,
  adminRestoreCity,
  adminForceDeleteCity,
  adminRestoreCleaner,
  adminForceDeleteCleaner,
  adminRestoreQuote,
  adminForceDeleteQuote,
  adminRestoreBooking,
  adminForceDeleteBooking,
  adminListServices,
  adminRestoreService,
  adminForceDeleteService,
  adminGetServiceExtras,
  adminRestoreServiceExtra,
  adminForceDeleteServiceExtra,
  adminListTestimonials,
  adminRestoreTestimonial,
  adminForceDeleteTestimonial,
  adminListCmsBlocks,
  adminRestoreCmsBlock,
  adminForceDeleteCmsBlock,
} from '../../api/admin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';

const TABS = [
  'cities',
  'cleaners',
  'quotes',
  'bookings',
  'services',
  'service_extras',
  'testimonials',
  'cms_blocks',
];

const AdminTrash = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('cities');

  const toastApiError = (err) =>
    err?.response?.data?.message ? String(err.response.data.message) : t('common.error');

  const citiesQuery = useQuery({
    queryKey: ['admin-cities', 'trash'],
    queryFn: () => adminGetCities({ only_trashed: true }).then((r) => r.data),
    enabled: tab === 'cities',
  });

  const cleanersQuery = useQuery({
    queryKey: ['admin-cleaners', 'trash'],
    queryFn: () => adminGetCleaners({ only_trashed: true }).then((r) => r.data),
    enabled: tab === 'cleaners',
  });

  const quotesQuery = useQuery({
    queryKey: ['admin-quotes', 'trash'],
    queryFn: () => adminGetQuotes({ only_trashed: true }).then((r) => r.data),
    enabled: tab === 'quotes',
  });

  const bookingsQuery = useQuery({
    queryKey: ['admin-bookings', 'trash'],
    queryFn: () => adminGetBookings({ only_trashed: true }).then((r) => r.data),
    enabled: tab === 'bookings',
  });

  const servicesTrashQuery = useQuery({
    queryKey: ['admin-services', 'trash'],
    queryFn: () => adminListServices({ only_trashed: true, per_page: 100 }).then((r) => r.data),
    enabled: tab === 'services',
  });

  const extrasTrashQuery = useQuery({
    queryKey: ['admin-service-extras', 'trash'],
    queryFn: () => adminGetServiceExtras({ only_trashed: true, per_page: 100 }).then((r) => r.data),
    enabled: tab === 'service_extras',
  });

  const testimonialsTrashQuery = useQuery({
    queryKey: ['admin-testimonials', 'trash'],
    queryFn: () => adminListTestimonials({ only_trashed: true, per_page: 100 }).then((r) => r.data),
    enabled: tab === 'testimonials',
  });

  const cmsTrashQuery = useQuery({
    queryKey: ['admin-cms-blocks', 'trash'],
    queryFn: () => adminListCmsBlocks({ only_trashed: true, per_page: 200 }).then((r) => r.data),
    enabled: tab === 'cms_blocks',
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-cities'] });
    queryClient.invalidateQueries({ queryKey: ['admin-cleaners'] });
    queryClient.invalidateQueries({ queryKey: ['admin-quotes'] });
    queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
    queryClient.invalidateQueries({ queryKey: ['admin-services'] });
    queryClient.invalidateQueries({ queryKey: ['admin-service-extras'] });
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['admin-cms-blocks'] });
    queryClient.invalidateQueries({ queryKey: ['cms-blocks'] });
    queryClient.invalidateQueries({ queryKey: ['services'] });
    queryClient.invalidateQueries({ queryKey: ['testimonials'] });
  };

  const restoreCity = useMutation({
    mutationFn: (id) => adminRestoreCity(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: () => toast.error(t('common.error')),
  });

  const forceCity = useMutation({
    mutationFn: (id) => adminForceDeleteCity(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const restoreCleaner = useMutation({
    mutationFn: (id) => adminRestoreCleaner(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: () => toast.error(t('common.error')),
  });

  const forceCleaner = useMutation({
    mutationFn: (id) => adminForceDeleteCleaner(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const restoreQuote = useMutation({
    mutationFn: (id) => adminRestoreQuote(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: () => toast.error(t('common.error')),
  });

  const forceQuote = useMutation({
    mutationFn: (id) => adminForceDeleteQuote(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const restoreBooking = useMutation({
    mutationFn: (id) => adminRestoreBooking(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: () => toast.error(t('common.error')),
  });

  const forceBooking = useMutation({
    mutationFn: (id) => adminForceDeleteBooking(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: () => toast.error(t('common.error')),
  });

  const restoreService = useMutation({
    mutationFn: (id) => adminRestoreService(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const forceService = useMutation({
    mutationFn: (id) => adminForceDeleteService(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const restoreExtra = useMutation({
    mutationFn: (id) => adminRestoreServiceExtra(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const forceExtra = useMutation({
    mutationFn: (id) => adminForceDeleteServiceExtra(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const restoreTestimonial = useMutation({
    mutationFn: (id) => adminRestoreTestimonial(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const forceTestimonial = useMutation({
    mutationFn: (id) => adminForceDeleteTestimonial(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const restoreCmsBlock = useMutation({
    mutationFn: (id) => adminRestoreCmsBlock(id),
    onSuccess: () => {
      toast.success(t('admin.restored'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const forceCmsBlock = useMutation({
    mutationFn: (id) => adminForceDeleteCmsBlock(id),
    onSuccess: () => {
      toast.success(t('admin.deleted_forever_toast'));
      invalidateAll();
    },
    onError: (err) => toast.error(toastApiError(err)),
  });

  const rows = (() => {
    switch (tab) {
      case 'cities':
        return citiesQuery.data?.data ?? [];
      case 'cleaners':
        return cleanersQuery.data?.data ?? [];
      case 'quotes':
        return quotesQuery.data?.data ?? [];
      case 'bookings':
        return bookingsQuery.data?.data ?? [];
      case 'services':
        return servicesTrashQuery.data?.data ?? [];
      case 'service_extras':
        return extrasTrashQuery.data?.data ?? [];
      case 'testimonials':
        return testimonialsTrashQuery.data?.data ?? [];
      case 'cms_blocks':
        return cmsTrashQuery.data?.data ?? [];
      default:
        return [];
    }
  })();

  const loading = (() => {
    switch (tab) {
      case 'cities':
        return citiesQuery.isLoading;
      case 'cleaners':
        return cleanersQuery.isLoading;
      case 'quotes':
        return quotesQuery.isLoading;
      case 'bookings':
        return bookingsQuery.isLoading;
      case 'services':
        return servicesTrashQuery.isLoading;
      case 'service_extras':
        return extrasTrashQuery.isLoading;
      case 'testimonials':
        return testimonialsTrashQuery.isLoading;
      case 'cms_blocks':
        return cmsTrashQuery.isLoading;
      default:
        return false;
    }
  })();

  const renderRow = (item) => {
    const restore = () => {
      if (tab === 'cities') restoreCity.mutate(item.id);
      else if (tab === 'cleaners') restoreCleaner.mutate(item.id);
      else if (tab === 'quotes') restoreQuote.mutate(item.id);
      else if (tab === 'bookings') restoreBooking.mutate(item.id);
      else if (tab === 'services') restoreService.mutate(item.id);
      else if (tab === 'service_extras') restoreExtra.mutate(item.id);
      else if (tab === 'testimonials') restoreTestimonial.mutate(item.id);
      else if (tab === 'cms_blocks') restoreCmsBlock.mutate(item.id);
    };
    const force = () => {
      if (!window.confirm(t('admin.confirm_delete_forever'))) return;
      if (tab === 'cities') forceCity.mutate(item.id);
      else if (tab === 'cleaners') forceCleaner.mutate(item.id);
      else if (tab === 'quotes') forceQuote.mutate(item.id);
      else if (tab === 'bookings') forceBooking.mutate(item.id);
      else if (tab === 'services') forceService.mutate(item.id);
      else if (tab === 'service_extras') forceExtra.mutate(item.id);
      else if (tab === 'testimonials') forceTestimonial.mutate(item.id);
      else if (tab === 'cms_blocks') forceCmsBlock.mutate(item.id);
    };

    if (tab === 'cities') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div>
            <span className="font-body font-bold text-charcoal">{item.name}</span>
            <span className="text-sm text-gray-400 ml-2">{item.country_code}</span>
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">
                {t('admin.deleted_at')}: {format(new Date(item.deleted_at), 'PPp')}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreCity.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceCity.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    if (tab === 'cleaners') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div>
            <span className="font-body font-bold text-charcoal">{item.user?.name}</span>
            <span className="text-sm text-gray-500 ml-2">{item.city?.name}</span>
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">
                {format(new Date(item.deleted_at), 'PPp')}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreCleaner.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceCleaner.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    if (tab === 'quotes') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-body font-bold text-charcoal">{item.name}</span>
              <Badge variant="default">{item.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 font-body">{item.email}</p>
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">{format(new Date(item.deleted_at), 'PPp')}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreQuote.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceQuote.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    if (tab === 'bookings') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-body font-bold text-charcoal text-sm">{item.reference}</span>
              <Badge variant={item.status === 'cancelled' ? 'error' : 'default'}>{item.status}</Badge>
            </div>
            <p className="text-sm text-gray-500 font-body">
              {item.user?.name} — {item.service?.name}
            </p>
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">{format(new Date(item.deleted_at), 'PPp')}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreBooking.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceBooking.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    if (tab === 'services') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="font-body font-bold text-charcoal">{item.name}</span>
            <span className="text-sm text-gray-500 ml-2 font-mono">{item.slug}</span>
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">{format(new Date(item.deleted_at), 'PPp')}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreService.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceService.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    if (tab === 'service_extras') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="font-body font-bold text-charcoal">{item.name}</span>
            {item.service?.name && (
              <span className="text-sm text-gray-500 ml-2">{item.service.name}</span>
            )}
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">{format(new Date(item.deleted_at), 'PPp')}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreExtra.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceExtra.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    if (tab === 'cms_blocks') {
      return (
        <Card key={item.id} className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-xs text-gray-400">
              {item.page} · {item.section_key} · {item.sort_order}
            </p>
            <p className="font-body font-bold text-charcoal line-clamp-1">{item.title_en || '—'}</p>
            {item.deleted_at && (
              <p className="text-xs text-gray-400 mt-1">{format(new Date(item.deleted_at), 'PPp')}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" onClick={restore} loading={restoreCmsBlock.isPending}>
              {t('admin.restore')}
            </Button>
            <Button size="sm" variant="outline" onClick={force} loading={forceCmsBlock.isPending}>
              {t('admin.delete_forever')}
            </Button>
          </div>
        </Card>
      );
    }

    return (
      <Card key={item.id} className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-body font-bold text-charcoal line-clamp-1">{item.author_name}</p>
          <p className="text-sm text-gray-500 font-body line-clamp-2">{item.body}</p>
          {item.deleted_at && (
            <p className="text-xs text-gray-400 mt-1">{format(new Date(item.deleted_at), 'PPp')}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={restore} loading={restoreTestimonial.isPending}>
            {t('admin.restore')}
          </Button>
          <Button size="sm" variant="outline" onClick={force} loading={forceTestimonial.isPending}>
            {t('admin.delete_forever')}
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <>
      <Helmet>
        <title>{t('admin.trash')} | CleanPro</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100 mb-2">{t('admin.trash')}</h1>
        <p className="text-gray-500 font-body mb-6">{t('admin.trash_hint')}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                tab === key ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(`admin.trash_tab_${key}`)}
            </button>
          ))}
        </div>

        {loading && (
          <Card className="text-center py-8">
            <p className="text-gray-400 font-body">{t('common.loading')}</p>
          </Card>
        )}

        {!loading && rows.length === 0 && (
          <Card className="text-center py-8">
            <p className="text-gray-400 font-body">{t('admin.trash_empty')}</p>
          </Card>
        )}

        {!loading && rows.length > 0 && <div className="space-y-3">{rows.map(renderRow)}</div>}
      </div>
    </>
  );
};

export default AdminTrash;
