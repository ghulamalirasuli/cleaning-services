import client from './client';

export const getCmsBlocks = (page) =>
  client.get('/cms/blocks', { params: { page } });
