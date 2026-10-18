import type { APIRoute } from 'astro';
import {pathUrl} from '../lib/links';
export const GET: APIRoute = ({site}) => {
  const routes=['','prestamos/','prestamos/semanal/','prestamos/catorcenal/','simulador/','nosotros/','contacto/','privacidad/'];
  const entries=site?routes.map(p=>`<url><loc>${new URL(pathUrl(p),site).href}</loc></url>`).join(''):'';
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`,{headers:{'Content-Type':'application/xml'}});
};
