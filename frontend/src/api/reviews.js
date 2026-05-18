import client from './client';

export const createReview = (data) => client.post('/reviews', data);
