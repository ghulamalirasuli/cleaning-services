import client from './client';

export const getServices = () => client.get('/services');
export const getService = (slug) => client.get(`/services/${slug}`);
