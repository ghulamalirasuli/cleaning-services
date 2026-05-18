import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../api/services';
import useBookingStore from '../../store/bookingStore';
import Button from '../ui/Button';

const EXTRAS_PER_PAGE = 6;

const Step4Extras = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { serviceId, extras, toggleExtra, notes, setNotes, nextStep, prevStep } = useBookingStore();
  const [extrasPage, setExtrasPage] = useState(1);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices().then(r => r.data),
  });

  const service = services?.find(s => s.id === serviceId);
  const serviceExtras = service?.extras || [];

  const totalExtrasPages = Math.max(1, Math.ceil(serviceExtras.length / EXTRAS_PER_PAGE));

  useEffect(() => {
    setExtrasPage(1);
  }, [serviceId, serviceExtras.length]);

  useEffect(() => {
    if (extrasPage > totalExtrasPages) {
      setExtrasPage(totalExtrasPages);
    }
  }, [extrasPage, totalExtrasPages]);

  const pagedExtras = useMemo(() => {
    const start = (extrasPage - 1) * EXTRAS_PER_PAGE;
    return serviceExtras.slice(start, start + EXTRAS_PER_PAGE);
  }, [serviceExtras, extrasPage]);

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-charcoal dark:text-gray-100 mb-6">{t('booking.extras_label')}</h2>
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {pagedExtras.map((extra) => (
            <label
              key={extra.id}
              className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all h-full sm:flex-row sm:items-start sm:justify-between ${
                extras.includes(extra.id) ? 'border-sage bg-sage/5' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={extras.includes(extra.id)}
                  onChange={() => toggleExtra(extra.id)}
                  className="w-5 h-5 mt-0.5 shrink-0 rounded border-gray-300 text-sage focus:ring-sage"
                />
                <div className="min-w-0">
                  <span className="font-body text-charcoal dark:text-gray-100 font-medium block">
                    {lang === 'de' && extra.name_de ? extra.name_de : extra.name}
                  </span>
                  {extra.description && (
                    <p className="text-xs text-gray-400 font-body mt-0.5">
                      {lang === 'de' && extra.description_de ? extra.description_de : extra.description}
                    </p>
                  )}
                </div>
              </div>
              {extra.price > 0 && (
                <span className="font-display font-bold text-charcoal dark:text-gray-100 shrink-0 sm:text-right">€{extra.price}</span>
              )}
            </label>
          ))}
        </div>

        {serviceExtras.length > EXTRAS_PER_PAGE && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body">
              {t('booking.extras_page_indicator', { current: extrasPage, total: totalExtrasPages })}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="muted"
                size="sm"
                disabled={extrasPage <= 1}
                onClick={() => setExtrasPage((p) => Math.max(1, p - 1))}
              >
                {t('booking.extras_prev')}
              </Button>
              <Button
                type="button"
                variant="muted"
                size="sm"
                disabled={extrasPage >= totalExtrasPages}
                onClick={() => setExtrasPage((p) => Math.min(totalExtrasPages, p + 1))}
              >
                {t('booking.extras_next')}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="form-label">{t('booking.notes_label')}</label>
        <textarea
          className="form-control min-h-[100px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('booking.notes_placeholder')}
        />
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={prevStep}>{t('booking.back')}</Button>
        <Button onClick={nextStep}>{t('booking.next')}</Button>
      </div>
    </div>
  );
};

export default Step4Extras;
