import client from './client';

export const getCities = () => client.get('/cities');
