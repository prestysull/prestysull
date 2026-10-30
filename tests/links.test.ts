import test from 'node:test';
import assert from 'node:assert/strict';
import {whatsapp,pathUrl} from '../src/lib/links.ts';
import {cmsAssetUrl} from '../src/lib/cms-media.ts';
import {messages} from '../src/data/contacto.ts';
test('enlaces oficiales, con mensajes codificados y sin datos financieros',()=>{
  for(const key of Object.keys(messages) as (keyof typeof messages)[]){const url=new URL(whatsapp(key));assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/51945396704');assert.equal(url.searchParams.get('text'),messages[key]);}
  assert.equal(pathUrl('prestamos/'),'/prestamos/');
});

test('los medios CMS respetan BASE_PATH y bloquean rutas externas o recorridos',()=>{
  const previous=process.env.BASE_PATH;
  delete process.env.BASE_PATH;
  assert.equal(cmsAssetUrl('/uploads/a.webp'),'/uploads/a.webp');
  process.env.BASE_PATH='/revision/';
  assert.equal(cmsAssetUrl('/uploads/a.webp'),'/revision/uploads/a.webp');
  if(previous===undefined) delete process.env.BASE_PATH; else process.env.BASE_PATH=previous;
  for(const path of ['https://example.com/a.webp','/images/a.webp','/uploads/../secret.jpg']) assert.throws(()=>cmsAssetUrl(path),/uploads/);
});
