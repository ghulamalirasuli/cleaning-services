import client from './client';

export const createBooking = (data) => client.post('/bookings', data);
export const getBookings = (params) => client.get('/bookings', { params });
export const getBooking = (reference) => client.get(`/bookings/${reference}`);
export const cancelBooking = (id) => client.post(`/bookings/${id}/cancel`);
export const requestCorrection = (id) => client.post(`/bookings/${id}/request-correction`);
export const payBalance = (id) => client.post(`/bookings/${id}/pay-balance`);
