import client from './client';

export const getTestimonials = () => client.get('/testimonials');
