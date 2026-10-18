import type { APIRoute } from 'astro';
export const GET: APIRoute = ({site}) => {
  const allow=import.meta.env.PUBLIC_INDEXABLE==='true' && Boolean(site);
  return new Response(`User-agent: *\n${allow?'Allow: /':'Disallow: /'}\n${site?`Sitemap: ${new URL(`${import.meta.env.BASE_URL.replace(/\/$/,'')}/sitemap.xml`,site)}\n`:''}`,{headers:{'Content-Type':'text/plain'}});
};
