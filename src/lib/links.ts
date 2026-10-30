import { contact, messages } from '../data/contacto.ts';
export function whatsapp(context: keyof typeof messages = 'general') {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(messages[context])}`;
}
export function pathUrl(path = '') {
  const base = import.meta.env?.BASE_URL ?? (typeof process !== 'undefined' ? process.env.BASE_PATH : undefined) ?? '/';
  return `${base.replace(/\/$/,'')}/${path.replace(/^\//,'')}`;
}
