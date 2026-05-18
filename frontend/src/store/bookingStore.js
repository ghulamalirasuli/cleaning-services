import { create } from 'zustand';

const useBookingStore = create((set) => ({
  step: 1,
  serviceId: null,
  serviceSlug: null,
  serviceName: null,
  cityId: null,
  cityName: null,
  address: '',
  scheduledAt: null,
  frequency: 'once',
  estimatedHours: 2,
  englishSpeaker: false,
  extras: [],
  notes: '',

  setStep: (step) => set({ step }),
  setService: (serviceId, serviceSlug, serviceName) => set({ serviceId, serviceSlug, serviceName }),
  setCity: (cityId, cityName) => set({ cityId, cityName }),
  setAddress: (address) => set({ address }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  setFrequency: (frequency) => set({ frequency }),
  setEstimatedHours: (estimatedHours) => set({ estimatedHours }),
  setEnglishSpeaker: (englishSpeaker) => set({ englishSpeaker }),
  setExtras: (extras) => set({ extras }),
  toggleExtra: (extraId) => set((state) => ({
    extras: state.extras.includes(extraId)
      ? state.extras.filter((id) => id !== extraId)
      : [...state.extras, extraId],
  })),
  setNotes: (notes) => set({ notes }),

  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),

  reset: () => set({
    step: 1,
    serviceId: null,
    serviceSlug: null,
    serviceName: null,
    cityId: null,
    cityName: null,
    address: '',
    scheduledAt: null,
    frequency: 'once',
    estimatedHours: 2,
    englishSpeaker: false,
    extras: [],
    notes: '',
  }),
}));

export default useBookingStore;
