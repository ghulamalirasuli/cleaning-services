import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getCities } from '../../api/cities';
import { getSiteSettings } from '../../api/settings';
import useBookingStore from '../../store/bookingStore';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';

const telHref = (phone) => {
  if (!phone) return '#';
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned.startsWith('+') ? `tel:${cleaned}` : `tel:${cleaned}`;
};

const Step2Location = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { cityId, setCity, address, setAddress, englishSpeaker, setEnglishSpeaker, nextStep, prevStep } = useBookingStore();

  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: () => getCities().then((r) => r.data),
  });

  const { data: site } = useQuery({
    queryKey: ['site-settings'],
    queryFn: () => getSiteSettings().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const countryCode = site?.country_code || 'DE';
  const countryLabel = `${t('booking.country_de')} (${countryCode})`;

  const phone = site?.contact_phone || t('booking.support_phone_value');
  const email = site?.contact_email || t('booking.support_email_value');
  const intro =
    lang === 'de' && site?.support_intro_de
      ? site.support_intro_de
      : site?.support_intro || t('booking.support_intro');
  const chatLabel =
    lang === 'de' && site?.support_chat_label_de
      ? site.support_chat_label_de
      : site?.support_chat_label || t('booking.support_chat');
  const hoursPhone = site?.support_hours_phone || t('booking.support_hours_phone');
  const hoursEmail = site?.support_hours_email || t('booking.support_hours_email');
  const hoursChat = site?.support_hours_chat || t('booking.support_hours_chat');

  const handleCityChange = (e) => {
    const id = Number(e.target.value);
    const city = cities?.find((c) => c.id === id);
    setCity(id, city?.name || '');
  };

  const canProceed = cityId && address.trim().length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-charcoal dark:text-gray-100 mb-6">{t('booking.select_city')}</h2>
        <div className="space-y-5">
          <Select
            label={t('booking.country_label')}
            value={countryCode}
            onChange={() => {}}
            disabled
            options={[{ value: countryCode, label: countryLabel }]}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body -mt-2">{t('booking.country_hint')}</p>

          <Select
            label={t('booking.select_city')}
            value={cityId || ''}
            onChange={handleCityChange}
            options={cities?.map((c) => ({ value: c.id, label: `${c.name} (${c.country_code})` })) || []}
            placeholder={t('booking.select_city')}
          />

          <Input
            label={t('booking.enter_address')}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Musterstraße 123, 10115 Berlin"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={englishSpeaker}
              onChange={(e) => setEnglishSpeaker(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-sage focus:ring-sage"
            />
            <span className="font-body text-charcoal dark:text-gray-100">{t('booking.english_label')}</span>
          </label>
        </div>
      </div>

      <aside
        className="rounded-2xl border border-sage/25 bg-sage/5 p-6"
        aria-label={t('booking.support_title')}
      >
        <h3 className="font-display font-bold text-charcoal dark:text-gray-100 text-lg mb-2">{t('booking.support_title')}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-body mb-5 leading-relaxed">{intro}</p>

        <ul className="space-y-4 text-sm font-body">
          <li className="flex gap-3">
            <span className="text-sage-dark font-semibold shrink-0 w-24">{t('support.via_phone')}</span>
            <span className="text-charcoal dark:text-gray-100">
              <a href={telHref(phone)} className="hover:text-sage-dark underline-offset-2 hover:underline">
                {phone}
              </a>
              <span className="block text-gray-500 text-xs mt-0.5">{hoursPhone}</span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-sage-dark font-semibold shrink-0 w-24">{t('support.via_email')}</span>
            <span className="text-charcoal dark:text-gray-100">
              <a href={`mailto:${email}`} className="hover:text-sage-dark underline-offset-2 hover:underline">
                {email}
              </a>
              <span className="block text-gray-500 text-xs mt-0.5">{hoursEmail}</span>
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-sage-dark font-semibold shrink-0 w-24">{t('support.via_chat')}</span>
            <span className="text-charcoal dark:text-gray-100">
              {chatLabel}
              <span className="block text-gray-500 text-xs mt-0.5">{hoursChat}</span>
            </span>
          </li>
        </ul>

        <Link
          to="/contact"
          className="inline-block mt-5 text-sm font-body font-semibold text-sage-dark hover:text-sage underline-offset-2 hover:underline"
        >
          {t('booking.support_contact_cta')} →
        </Link>
      </aside>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={prevStep}>
          {t('booking.back')}
        </Button>
        <Button onClick={nextStep} disabled={!canProceed}>
          {t('booking.next')}
        </Button>
      </div>
    </div>
  );
};

export default Step2Location;
