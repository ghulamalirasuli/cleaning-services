import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminGetSiteSettings, adminUpdateSiteSettings, adminDownloadDatabaseBackup } from '../../api/admin';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const empty = {
  app_name: '',
  app_name_de: '',
  tagline: '',
  tagline_de: '',
  logo_url: '',
  legal_name: '',
  contact_email: '',
  contact_phone: '',
  contact_address: '',
  support_intro: '',
  support_intro_de: '',
  support_hours_phone: '',
  support_hours_email: '',
  support_hours_chat: '',
  support_chat_label: '',
  support_chat_label_de: '',
  country_code: 'DE',
  hero_badge_en: '',
  hero_badge_de: '',
};

const AdminSettings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-site-settings'],
    queryFn: () => adminGetSiteSettings().then((r) => r.data),
  });

  useEffect(() => {
    if (data) {
      setForm({
        app_name: data.app_name ?? '',
        app_name_de: data.app_name_de ?? '',
        tagline: data.tagline ?? '',
        tagline_de: data.tagline_de ?? '',
        logo_url: data.logo_url ?? '',
        legal_name: data.legal_name ?? '',
        contact_email: data.contact_email ?? '',
        contact_phone: data.contact_phone ?? '',
        contact_address: data.contact_address ?? '',
        support_intro: data.support_intro ?? '',
        support_intro_de: data.support_intro_de ?? '',
        support_hours_phone: data.support_hours_phone ?? '',
        support_hours_email: data.support_hours_email ?? '',
        support_hours_chat: data.support_hours_chat ?? '',
        support_chat_label: data.support_chat_label ?? '',
        support_chat_label_de: data.support_chat_label_de ?? '',
        country_code: data.country_code ?? 'DE',
        hero_badge_en: data.hero_badge_en ?? '',
        hero_badge_de: data.hero_badge_de ?? '',
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: () => adminUpdateSiteSettings(form),
    onSuccess: () => {
      toast.success(t('common.success'));
      queryClient.invalidateQueries({ queryKey: ['admin-site-settings'] });
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const [backupLoading, setBackupLoading] = useState(false);

  const handleBackupDownload = async () => {
    setBackupLoading(true);
    try {
      const res = await adminDownloadDatabaseBackup();
      const blob = res.data;
      if (!(blob instanceof Blob)) {
        toast.error(t('common.error'));
        return;
      }
      const cd = res.headers['content-disposition'] || res.headers['Content-Disposition'];
      let filename = `cleanpro-db-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.sql`;
      if (cd) {
        const m = /filename\*?=(?:UTF-8'')?["']?([^\"';]+)/i.exec(cd);
        if (m?.[1]) {
          try {
            filename = decodeURIComponent(m[1].replace(/['"]/g, ''));
          } catch {
            filename = m[1].replace(/['"]/g, '');
          }
        }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(t('admin.backup_started'));
    } catch (err) {
      const data = err.response?.data;
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const json = JSON.parse(text);
          toast.error(json.message || t('common.error'));
        } catch {
          toast.error(t('common.error'));
        }
      } else {
        toast.error(err.response?.data?.message || t('common.error'));
      }
    } finally {
      setBackupLoading(false);
    }
  };

  const f = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  if (isLoading && !data) {
    return (
      <div>
        <Helmet>
          <title>{t('admin.settings')} | CleanPro</title>
        </Helmet>
        <p className="font-body text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('admin.settings')} | CleanPro</title>
      </Helmet>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-display font-bold text-charcoal dark:text-gray-100 mb-2">{t('admin.settings')}</h1>
        <p className="text-gray-500 font-body text-sm mb-8">{t('admin.settings_hint')}</p>

        <Card className="mb-8 space-y-4 p-6 dark:border-gray-800">
          <h2 className="font-display font-bold text-charcoal dark:text-gray-100">{t('admin.backup_title')}</h2>
          <p className="text-sm text-gray-500 font-body dark:text-gray-400">{t('admin.backup_hint')}</p>
          <Button type="button" variant="outline" onClick={handleBackupDownload} loading={backupLoading} disabled={backupLoading}>
            {t('admin.backup_download')}
          </Button>
        </Card>

        <Card className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('admin.field_app_name')} value={form.app_name} onChange={(e) => f('app_name', e.target.value)} />
            <Input label={t('admin.field_app_name_de')} value={form.app_name_de} onChange={(e) => f('app_name_de', e.target.value)} />
          </div>
          <Input label={t('admin.field_logo_url')} value={form.logo_url} onChange={(e) => f('logo_url', e.target.value)} placeholder="https://..." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('admin.field_tagline')} value={form.tagline} onChange={(e) => f('tagline', e.target.value)} />
            <Input label={t('admin.field_tagline_de')} value={form.tagline_de} onChange={(e) => f('tagline_de', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t('admin.field_hero_badge_en')}
              value={form.hero_badge_en}
              onChange={(e) => f('hero_badge_en', e.target.value)}
              placeholder="Trusted by 25,000+ customers"
            />
            <Input
              label={t('admin.field_hero_badge_de')}
              value={form.hero_badge_de}
              onChange={(e) => f('hero_badge_de', e.target.value)}
            />
          </div>
          <Input label={t('admin.field_legal_name')} value={form.legal_name} onChange={(e) => f('legal_name', e.target.value)} />
          <Input label={t('admin.field_country_code')} value={form.country_code} onChange={(e) => f('country_code', e.target.value)} maxLength={5} />

          <hr className="border-gray-100 dark:border-gray-800" />
          <h2 className="font-display font-bold text-charcoal dark:text-gray-100">{t('admin.settings_contact')}</h2>
          <Input label={t('admin.field_contact_email')} type="email" value={form.contact_email} onChange={(e) => f('contact_email', e.target.value)} />
          <Input label={t('admin.field_contact_phone')} value={form.contact_phone} onChange={(e) => f('contact_phone', e.target.value)} />
          <div>
            <label className="form-label">{t('admin.field_contact_address')}</label>
            <textarea
              className="form-control min-h-[100px]"
              value={form.contact_address}
              onChange={(e) => f('contact_address', e.target.value)}
            />
          </div>

          <hr className="border-gray-100 dark:border-gray-800" />
          <h2 className="font-display font-bold text-charcoal dark:text-gray-100">{t('admin.settings_support')}</h2>
          <div>
            <label className="form-label">{t('admin.field_support_intro')}</label>
            <textarea
              className="form-control min-h-[72px]"
              value={form.support_intro}
              onChange={(e) => f('support_intro', e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">{t('admin.field_support_intro_de')}</label>
            <textarea
              className="form-control min-h-[72px]"
              value={form.support_intro_de}
              onChange={(e) => f('support_intro_de', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('admin.field_support_hours_phone')} value={form.support_hours_phone} onChange={(e) => f('support_hours_phone', e.target.value)} />
            <Input label={t('admin.field_support_hours_email')} value={form.support_hours_email} onChange={(e) => f('support_hours_email', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label={t('admin.field_support_chat_label')} value={form.support_chat_label} onChange={(e) => f('support_chat_label', e.target.value)} />
            <Input label={t('admin.field_support_chat_label_de')} value={form.support_chat_label_de} onChange={(e) => f('support_chat_label_de', e.target.value)} />
          </div>
          <Input label={t('admin.field_support_hours_chat')} value={form.support_hours_chat} onChange={(e) => f('support_hours_chat', e.target.value)} />

          <div className="pt-4">
            <Button onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} disabled={!form.app_name?.trim() || !form.contact_email?.trim()}>
              {t('admin.save')}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminSettings;
