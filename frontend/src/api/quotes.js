import client from './client';

export const createQuote = (data) => client.post('/quotes', data);
