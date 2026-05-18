import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../api/services';
import useBookingStore from '../../store/bookingStore';
import Button from '../ui/Button';
import Card from '../ui/Card';

const Step1Service = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { serviceId, setService, nextStep } = useBookingStore();

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: () => getServices().then(r => r.data),
  });

  const bookableServices = services?.filter(s => !s.is_quote_based) || [];

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-charcoal mb-6">{t('booking.select_service')}</h2>
      <div className="space-y-4">
        {bookableServices.map((service) => (
          <Card
            key={service.id}
            hover
            className={`flex items-center justify-between cursor-pointer ${
              serviceId === service.id ? 'border-sage border-2 bg-sage/5' : ''
            }`}
            onClick={() => setService(service.id, service.slug, lang === 'de' && service.name_de ? service.name_de : service.name)}
          >
            <div className="flex-1">
              <h3 className="font-display font-bold text-charcoal">
                {lang === 'de' && service.name_de ? service.name_de : service.name}
              </h3>
              <p className="text-sm text-gray-500 font-body mt-1">
                {lang === 'de' && service.description_de ? service.description_de.substring(0, 100) : service.description?.substring(0, 100)}...
              </p>
            </div>
            <div className="text-right ml-4">
              <span className="text-2xl font-display font-bold text-charcoal">€{service.hourly_rate}</span>
              <span className="text-sm text-gray-400 font-body">{t('common.per_hour')}</span>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Button onClick={nextStep} disabled={!serviceId}>{t('booking.next')}</Button>
      </div>
    </div>
  );
};

export default Step1Service;
