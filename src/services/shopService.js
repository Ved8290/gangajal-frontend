import { get, post } from './api';
export const getProducts = (params) => get('/products', params);
export const getProduct = (slug) => get(`/products/${slug}`);
export const getSettings = () => get('/settings');
export const createOrder = (payload) => post('/orders', payload);
export const trackOrder = (payload) => post('/orders/track', payload);
