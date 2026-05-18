import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays, addHours } from 'date-fns';
import useBookingStore from '../../store/bookingStore';
import Button from '../ui/Button';
import Select from '../ui/Select';
import { FREQUENCIES, MIN_HOURS, MAX_HOURS, HOURS_STEP } from '../../lib/constants';

const Step3DateTime = () => {
  const { t } = useTranslation();
  const { scheduledAt, setScheduledAt, frequency, setFrequency, estimatedHours, setEstimatedHours, nextStep, prevStep } = useBookingStore();

  const minDate = addHours(new Date(), 48);

  const frequencyOptions = FREQUENCIES.map(f => ({ value: f.value, label: t(f.labelKey) }));

  const hourOptions = [];
  for (let h = MIN_HOURS; h <= MAX_HOURS; h += HOURS_STEP) {
    hourOptions.push({ value: h, label: `${h} ${t('services.hours')}` });
  }

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-charcoal dark:text-gray-100 mb-6">{t('booking.select_date')}</h2>
      <div className="space-y-5">
        <div>
          <label className="form-label">{t('booking.select_date')}</label>
          <DatePicker
            selected={scheduledAt ? new Date(scheduledAt) : null}
            onChange={(date) => setScheduledAt(date?.toISOString() || null)}
            showTimeSelect
            minDate={minDate}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
            placeholderText={t('booking.select_date')}
          />
        </div>

        <Select
          label={t('booking.frequency_label')}
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          options={frequencyOptions}
        />

        <div>
          <label className="form-label">{t('booking.hours_label')}</label>
          <input
            type="range"
            min={MIN_HOURS}
            max={MAX_HOURS}
            step={HOURS_STEP}
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(Number(e.target.value))}
            className="w-full accent-sage"
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 font-body mt-1">
            <span>{MIN_HOURS}h</span>
            <span className="font-bold text-charcoal dark:text-gray-100">{estimatedHours} {t('services.hours')}</span>
            <span>{MAX_HOURS}h</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" onClick={prevStep}>{t('booking.back')}</Button>
        <Button onClick={nextStep} disabled={!scheduledAt}>{t('booking.next')}</Button>
      </div>
    </div>
  );
};

export default Step3DateTime;
