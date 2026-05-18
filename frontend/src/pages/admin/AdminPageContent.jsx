import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  adminListCmsBlocks,
  adminCreateCmsBlock,
  adminUpdateCmsBlock,
  adminDeleteCmsBlock,
} from '../../api/admin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch';

const PAGE_IDS = ['home', 'services', 'cities', 'about', 'contact'];

const ICON_OPTIONS = [
  { value: '', label: '—' },
  { value: 'shield', label: 'shield' },
  { value: 'sparkles', label: 'sparkles' },
  { value: 'globe', label: 'globe' },
  { value: 'trust_verified', label: 'trust_verified' },
  { value: 'trust_english', label: 'trust_english' },
  { value: 'trust_guarantee', label: 'trust_guarantee' },
  { value: 'trust_support', label: 'trust_support' },
];

const emptyForm = (page) => ({
  page: page || 'about',
  section_key: '',
  sort_order: '0',
  title_en: '',
  title_de: '',
  body_en: '',
  body_de: '',
  icon: '',
  is_active: true,
});

const toPayload = (form, isEdit) => {
  const payload = {
    page: form.page,
    section_key: form.section_key.trim(),
    sort_order: Number.parseInt(String(form.sort_order), 10) || 0,
    title_en: form.title_en?.trim() || null,
    title_de: form.title_de?.trim() || null,
    body_en: form.body_en?.trim() || null,
    body_de: form.body_de?.trim() || null,
    icon: form.icon?.trim() || null,
    is_active: form.is_active !== false,
  };
  if (isEdit) {
    return Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined));
  }
  return payload;
};

const AdminPageContent = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [page, setPage] = useState('home');
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [newRow, setNewRow] = useState(() => emptyForm('home'));

  const { data, isLoading } = useQuery({
    queryKey: ['admin-cms-blocks', page],
    queryFn: () => adminListCmsBlocks({ page, per_page: 200 }).then((r) => r.data),
  });

  const rows = data?.data || [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-cms-blocks'] });
    queryClient.invalidateQueries({ queryKey: ['cms-blocks'] });
  };

  const createMutation = useMutation({
    mutationFn: () => adminCreateCmsBlock(toPayload(newRow, false)),
    onSuccess: () => {
      toast.success(t('admin.saved'));
      invalidate();
      setAddOpen(false);
      setNewRow(emptyForm(page));
    },
    onError: (err) => {
      const msg = err.response?.data?.message;
      if (err.response?.data?.errors) {
        const first = Object.values(err.response.data.errors)[0];
        toast.error(Array.isArray(first) ? first[0] : msg || t('common.error'));
      } else toast.error(msg || t('common.error'));
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => adminUpdateCmsBlock(editRow.id, toPayload(editRow, true)),
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
    mutationFn: (id) => adminDeleteCmsBlock(id),
    onSuccess: () => {
      toast.success(t('admin.moved_to_trash'));
      invalidate();
    },
    onError: (err) => toast.error(err.response?.data?.message || t('common.error')),
  });

  const pageOptions = PAGE_IDS.map((id) => ({
    value: id,
    label: t(`admin.cms_page_${id}`),
  }));

  return (
    <>
      <Helmet>
        <title>{t('admin.page_content')} | CleanPro</title>
      </Helmet>
      <div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100">{t('admin.page_content')}</h1>
            <p className="mt-1 text-sm text-gray-500 font-body dark:text-gray-400">{t('admin.page_content_hint')}</p>
            <p className="mt-2 text-sm font-body">
              <Link to="/admin/trash" className="font-medium text-sage hover:underline">
                {t('admin.trash')} →
              </Link>
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setNewRow(emptyForm(page));
              setAddOpen(true);
            }}
          >
            {t('admin.cms_add_block')}
          </Button>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {PAGE_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPage(id)}
              className={`rounded-full px-4 py-2 text-sm font-body font-medium transition-all ${
                page === id ? 'bg-charcoal text-white dark:bg-cream dark:text-charcoal' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}
            >
              {t(`admin.cms_page_${id}`)}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-gray-500 font-body">{t('common.loading')}</p>}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-gray-500 font-body">{t('admin.cms_no_blocks')}</p>
        )}

        <div className="space-y-3">
          {!isLoading &&
            rows.map((row) => (
              <Card key={row.id} className="p-4 dark:border-gray-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-gray-400">
                      {row.section_key} · sort {row.sort_order}
                      {row.icon ? ` · ${row.icon}` : ''}
                    </p>
                    <p className="font-body text-sm font-semibold text-charcoal dark:text-gray-100">{row.title_en || '—'}</p>
                    {row.body_en && (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400 font-body">{row.body_en}</p>
                    )}
                    {row.is_active === false && (
                      <span className="mt-2 inline-block rounded-md bg-gray-200 px-2 py-0.5 text-xs font-semibold dark:bg-gray-700">
                        {t('admin.status_inactive')}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="muted" onClick={() => setEditRow({ ...row, sort_order: String(row.sort_order), icon: row.icon || '' })}>
                      {t('admin.edit')}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="dangerOutline"
                      onClick={() => {
                        if (window.confirm(t('admin.confirm_move_trash'))) deleteMutation.mutate(row.id);
                      }}
                    >
                      {t('admin.delete')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title={t('admin.cms_add_block')}>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <Select
              label={t('admin.cms_field_page')}
              value={newRow.page}
              onChange={(e) => setNewRow({ ...newRow, page: e.target.value })}
              options={pageOptions}
            />
            <Input
              label={t('admin.cms_field_section')}
              value={newRow.section_key}
              onChange={(e) => setNewRow({ ...newRow, section_key: e.target.value })}
              placeholder="hero, mission, value, …"
            />
            <Input
              label={t('admin.field_sort_order')}
              type="number"
              value={newRow.sort_order}
              onChange={(e) => setNewRow({ ...newRow, sort_order: e.target.value })}
            />
            <Input label={t('admin.field_title_en')} value={newRow.title_en} onChange={(e) => setNewRow({ ...newRow, title_en: e.target.value })} />
            <Input label={t('admin.field_title_de')} value={newRow.title_de} onChange={(e) => setNewRow({ ...newRow, title_de: e.target.value })} />
            <div>
              <label className="form-label">{t('admin.cms_field_body_en')}</label>
              <textarea
                className="form-control min-h-[72px]"
                value={newRow.body_en}
                onChange={(e) => setNewRow({ ...newRow, body_en: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">{t('admin.cms_field_body_de')}</label>
              <textarea
                className="form-control min-h-[72px]"
                value={newRow.body_de}
                onChange={(e) => setNewRow({ ...newRow, body_de: e.target.value })}
              />
            </div>
            <Select label={t('admin.cms_field_icon')} value={newRow.icon} onChange={(e) => setNewRow({ ...newRow, icon: e.target.value })} options={ICON_OPTIONS} />
            <div className="flex items-center gap-3">
              <Switch
                checked={newRow.is_active !== false}
                onCheckedChange={(v) => setNewRow({ ...newRow, is_active: v })}
                ariaLabel={t('admin.field_service_active')}
              />
              <span className="text-sm font-body text-charcoal dark:text-gray-200">{t('admin.cms_active_public')}</span>
            </div>
            <Button onClick={() => createMutation.mutate()} loading={createMutation.isPending} disabled={!newRow.section_key?.trim()}>
              {t('admin.save')}
            </Button>
          </div>
        </Modal>

        <Modal isOpen={!!editRow} onClose={() => setEditRow(null)} title={t('admin.cms_edit_block')}>
          {editRow && (
            <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
              <Select
                label={t('admin.cms_field_page')}
                value={editRow.page}
                onChange={(e) => setEditRow({ ...editRow, page: e.target.value })}
                options={pageOptions}
              />
              <Input
                label={t('admin.cms_field_section')}
                value={editRow.section_key}
                onChange={(e) => setEditRow({ ...editRow, section_key: e.target.value })}
              />
              <Input
                label={t('admin.field_sort_order')}
                type="number"
                value={editRow.sort_order}
                onChange={(e) => setEditRow({ ...editRow, sort_order: e.target.value })}
              />
              <Input label={t('admin.field_title_en')} value={editRow.title_en || ''} onChange={(e) => setEditRow({ ...editRow, title_en: e.target.value })} />
              <Input label={t('admin.field_title_de')} value={editRow.title_de || ''} onChange={(e) => setEditRow({ ...editRow, title_de: e.target.value })} />
              <div>
                <label className="form-label">{t('admin.cms_field_body_en')}</label>
                <textarea
                  className="form-control min-h-[72px]"
                  value={editRow.body_en || ''}
                  onChange={(e) => setEditRow({ ...editRow, body_en: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">{t('admin.cms_field_body_de')}</label>
                <textarea
                  className="form-control min-h-[72px]"
                  value={editRow.body_de || ''}
                  onChange={(e) => setEditRow({ ...editRow, body_de: e.target.value })}
                />
              </div>
              <Select label={t('admin.cms_field_icon')} value={editRow.icon || ''} onChange={(e) => setEditRow({ ...editRow, icon: e.target.value })} options={ICON_OPTIONS} />
              <div className="flex items-center gap-3">
                <Switch
                  checked={editRow.is_active !== false}
                  onCheckedChange={(v) => setEditRow({ ...editRow, is_active: v })}
                  ariaLabel={t('admin.field_service_active')}
                />
                <span className="text-sm font-body text-charcoal dark:text-gray-200">{t('admin.cms_active_public')}</span>
              </div>
              <Button onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} disabled={!editRow.section_key?.trim()}>
                {t('admin.save')}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default AdminPageContent;
