import client from './client';

export const login = (data) => client.post('/auth/login', data);
export const register = (data) => client.post('/auth/register', data);
export const logout = () => client.post('/auth/logout');
export const getMe = () => client.get('/me');
export const updateMe = (data) => client.put('/me', data);
