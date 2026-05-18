import client from './client';

export const getSiteSettings = () => client.get('/settings');
