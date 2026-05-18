import client from './client';

export const adminGetBookings = (params) => client.get('/admin/bookings', { params });
export const adminGetBooking = (id) => client.get(`/admin/bookings/${id}`);
export const adminUpdateBooking = (id, data) => client.put(`/admin/bookings/${id}`, data);
export const adminDeleteBooking = (id) => client.delete(`/admin/bookings/${id}`);
export const adminRestoreBooking = (id) => client.post(`/admin/bookings/${id}/restore`);
export const adminForceDeleteBooking = (id) => client.delete(`/admin/bookings/${id}/force`);
export const adminAssignCleaner = (id, cleanerId) => client.post(`/admin/bookings/${id}/assign-cleaner`, { cleaner_id: cleanerId });
export const adminCompleteBooking = (id, actualHours) => client.post(`/admin/bookings/${id}/complete`, { actual_hours: actualHours });

export const adminGetCleaners = (params) => client.get('/admin/cleaners', { params });
export const adminGetCleaner = (id) => client.get(`/admin/cleaners/${id}`);
export const adminCreateCleaner = (data) => client.post('/admin/cleaners', data);
export const adminUpdateCleaner = (id, data) => client.put(`/admin/cleaners/${id}`, data);
export const adminDeleteCleaner = (id) => client.delete(`/admin/cleaners/${id}`);
export const adminRestoreCleaner = (id) => client.post(`/admin/cleaners/${id}/restore`);
export const adminForceDeleteCleaner = (id) => client.delete(`/admin/cleaners/${id}/force`);

export const adminGetQuotes = (params) => client.get('/admin/quotes', { params });
export const adminGetQuote = (id) => client.get(`/admin/quotes/${id}`);
export const adminUpdateQuote = (id, data) => client.put(`/admin/quotes/${id}`, data);
export const adminDeleteQuote = (id) => client.delete(`/admin/quotes/${id}`);
export const adminRestoreQuote = (id) => client.post(`/admin/quotes/${id}/restore`);
export const adminForceDeleteQuote = (id) => client.delete(`/admin/quotes/${id}/force`);

export const adminGetCities = (params) => client.get('/admin/cities', { params });
export const adminCreateCity = (data) => client.post('/admin/cities', data);
export const adminUpdateCity = (id, data) => client.put(`/admin/cities/${id}`, data);
export const adminDeleteCity = (id) => client.delete(`/admin/cities/${id}`);
export const adminRestoreCity = (id) => client.post(`/admin/cities/${id}/restore`);
export const adminForceDeleteCity = (id) => client.delete(`/admin/cities/${id}/force`);

export const adminGetSiteSettings = () => client.get('/admin/settings');
export const adminUpdateSiteSettings = (data) => client.put('/admin/settings', data);

/** Database backup file download (blob). On error, response may be JSON as blob. */
export const adminDownloadDatabaseBackup = () =>
  client.get('/admin/backup/download', {
    responseType: 'blob',
    timeout: 600_000,
  });

export const adminListServices = (params) => client.get('/admin/services', { params });
export const adminCreateService = (data) => client.post('/admin/services', data);
export const adminUpdateService = (id, data) => client.put(`/admin/services/${id}`, data);
export const adminDeleteService = (id) => client.delete(`/admin/services/${id}`);
export const adminRestoreService = (id) => client.post(`/admin/services/${id}/restore`);
export const adminForceDeleteService = (id) => client.delete(`/admin/services/${id}/force`);

export const adminGetServiceExtras = (params) => client.get('/admin/service-extras', { params });
export const adminCreateServiceExtra = (data) => client.post('/admin/service-extras', data);
export const adminUpdateServiceExtra = (id, data) => client.put(`/admin/service-extras/${id}`, data);
export const adminDeleteServiceExtra = (id) => client.delete(`/admin/service-extras/${id}`);
export const adminRestoreServiceExtra = (id) => client.post(`/admin/service-extras/${id}/restore`);
export const adminForceDeleteServiceExtra = (id) => client.delete(`/admin/service-extras/${id}/force`);

export const adminListTestimonials = (params) => client.get('/admin/testimonials', { params });
export const adminCreateTestimonial = (data) => client.post('/admin/testimonials', data);
export const adminUpdateTestimonial = (id, data) => client.put(`/admin/testimonials/${id}`, data);
export const adminDeleteTestimonial = (id) => client.delete(`/admin/testimonials/${id}`);
export const adminRestoreTestimonial = (id) => client.post(`/admin/testimonials/${id}/restore`);
export const adminForceDeleteTestimonial = (id) => client.delete(`/admin/testimonials/${id}/force`);

export const adminListCmsBlocks = (params) => client.get('/admin/cms-blocks', { params });
export const adminCreateCmsBlock = (data) => client.post('/admin/cms-blocks', data);
export const adminUpdateCmsBlock = (id, data) => client.put(`/admin/cms-blocks/${id}`, data);
export const adminDeleteCmsBlock = (id) => client.delete(`/admin/cms-blocks/${id}`);
export const adminRestoreCmsBlock = (id) => client.post(`/admin/cms-blocks/${id}/restore`);
export const adminForceDeleteCmsBlock = (id) => client.delete(`/admin/cms-blocks/${id}/force`);
