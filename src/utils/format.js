export const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const dateTime = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
export const STATUS_KEY = { 'Pending WhatsApp Confirmation': 'pending', Confirmed: 'confirmed', Processing: 'processing', Packed: 'packed', Shipped: 'shipped', Delivered: 'delivered', Cancelled: 'cancelled' };
export const PAY_KEY = { 'Cash on Delivery': 'cod', 'UPI on Delivery': 'upi', 'Bank Transfer': 'bank', 'Manual Payment': 'manual' };
export const ORDER_STATUSES = Object.keys(STATUS_KEY);
export const calcTotals = (items, settings) => {
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const free = settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold;
  const shipping = items.length === 0 || free ? 0 : settings.shippingCharges;
  return { subtotal, shipping, total: subtotal + shipping, toFree: settings.freeShippingThreshold > 0 && !free ? settings.freeShippingThreshold - subtotal : 0 };
};
