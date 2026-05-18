export const FREQUENCIES = [
  { value: 'once', labelKey: 'booking.frequency_once' },
  { value: 'weekly', labelKey: 'booking.frequency_weekly' },
  { value: 'biweekly', labelKey: 'booking.frequency_biweekly' },
  { value: 'monthly', labelKey: 'booking.frequency_monthly' },
];

export const BOOKING_STATUSES = {
  pending: { color: 'bg-gold-light text-gold-dark', labelKey: 'account.status_pending' },
  confirmed: { color: 'bg-sage-light text-sage-dark', labelKey: 'account.status_confirmed' },
  in_progress: { color: 'bg-blue-100 text-blue-800', labelKey: 'account.status_in_progress' },
  completed: { color: 'bg-green-100 text-green-800', labelKey: 'account.status_completed' },
  cancelled: { color: 'bg-red-100 text-red-800', labelKey: 'account.status_cancelled' },
};

export const MIN_HOURS = 2;
export const MAX_HOURS = 12;
export const HOURS_STEP = 0.5;
export const MIN_ADVANCE_HOURS = 48;
