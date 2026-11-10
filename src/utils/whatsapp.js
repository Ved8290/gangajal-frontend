import { money } from './format';

export const waDigits = (n = '') => {
  const d = String(n).replace(/\D/g, '');
  return d.length === 10 ? `91${d}` : d;
};
export const waLink = (number, text = '') => `https://wa.me/${waDigits(number)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

const T = {
  en: { hi: 'Namaskar,', intro: 'I would like to place an order.', id: 'Order ID', products: 'Products', total: 'Total Amount', name: 'Customer Name', mobile: 'Mobile', addr: 'Delivery Address', pay: 'Payment', confirm: 'Please confirm my order.', thanks: 'Thank you.', inquiry: 'Namaskar, I would like to know more about' },
  hi: { hi: 'नमस्कार,', intro: 'मैं ऑर्डर देना चाहता/चाहती हूं।', id: 'ऑर्डर आईडी', products: 'उत्पाद', total: 'कुल राशि', name: 'ग्राहक का नाम', mobile: 'मोबाइल', addr: 'डिलीवरी पता', pay: 'भुगतान', confirm: 'कृपया मेरा ऑर्डर कन्फर्म करें।', thanks: 'धन्यवाद।', inquiry: 'नमस्कार, मुझे इसके बारे में जानकारी चाहिए:' },
  mr: { hi: 'नमस्कार,', intro: 'मला ऑर्डर द्यायची आहे.', id: 'ऑर्डर आयडी', products: 'उत्पादने', total: 'एकूण रक्कम', name: 'ग्राहकाचे नाव', mobile: 'मोबाइल', addr: 'डिलिव्हरी पत्ता', pay: 'पेमेंट', confirm: 'कृपया माझी ऑर्डर निश्चित करा.', thanks: 'धन्यवाद.', inquiry: 'नमस्कार, मला याबद्दल माहिती हवी आहे:' },
};
const pick = (o, lang) => o?.[lang] || o?.en || o?.mr || '';

export function buildOrderMessage(order, lang = 'mr') {
  const t = T[lang] || T.mr;
  const c = order.customer;
  const lines = order.items.map((i, n) => `${n + 1}. ${pick(i.name, lang)}${i.size ? ` (${i.size})` : ''} - ${i.quantity} x ${money(i.price)} = ${money(i.price * i.quantity)}`);
  const addr = [c.address, c.landmark, c.city, c.district, `${c.state} - ${c.pincode}`].filter(Boolean).join(', ');
  return [t.hi, '', t.intro, '', `${t.id}: ${order.orderId}`, '', `${t.products}:`, ...lines, '', `${t.total}: ${money(order.totalAmount)}`, `${t.pay}: ${order.paymentMethod}`, '', `${t.name}: ${c.fullName}`, `${t.mobile}: ${c.mobile}`, '', `${t.addr}:`, addr, '', t.confirm, t.thanks].join('\n');
}
export const buildInquiryMessage = (productName, lang = 'mr') => `${(T[lang] || T.mr).inquiry} ${productName}`;

// Admin -> customer messages, written in the customer's preferred language
const S = {
  en: { Confirmed: 'Your order {id} is confirmed. Thank you!', Processing: 'Your order {id} is being prepared.', Packed: 'Your order {id} has been packed.', Shipped: 'Your order {id} has been shipped.{track}', Delivered: 'Your order {id} has been delivered. Thank you for choosing us!', Cancelled: 'Your order {id} has been cancelled.', track: ' Tracking number: {n}.' },
  hi: { Confirmed: 'आपका ऑर्डर {id} कन्फर्म हो गया है। धन्यवाद!', Processing: 'आपका ऑर्डर {id} तैयार किया जा रहा है।', Packed: 'आपका ऑर्डर {id} पैक हो गया है।', Shipped: 'आपका ऑर्डर {id} भेज दिया गया है।{track}', Delivered: 'आपका ऑर्डर {id} डिलीवर हो गया है। हमें चुनने के लिए धन्यवाद!', Cancelled: 'आपका ऑर्डर {id} रद्द कर दिया गया है।', track: ' ट्रैकिंग नंबर: {n}।' },
  mr: { Confirmed: 'तुमची ऑर्डर {id} निश्चित झाली आहे. धन्यवाद!', Processing: 'तुमची ऑर्डर {id} तयार केली जात आहे.', Packed: 'तुमची ऑर्डर {id} पॅक झाली आहे.', Shipped: 'तुमची ऑर्डर {id} पाठवली आहे.{track}', Delivered: 'तुमची ऑर्डर {id} पोहोचली आहे. आम्हाला निवडल्याबद्दल धन्यवाद!', Cancelled: 'तुमची ऑर्डर {id} रद्द करण्यात आली आहे.', track: ' ट्रॅकिंग नंबर: {n}.' },
};
export function buildStatusMessage(order) {
  const lang = order.customer.preferredLanguage || 'mr';
  const s = S[lang] || S.mr;
  const tmpl = s[order.orderStatus];
  if (!tmpl) return '';
  const track = order.trackingNumber ? s.track.replace('{n}', order.trackingNumber) : '';
  return tmpl.replace('{id}', order.orderId).replace('{track}', track);
}
