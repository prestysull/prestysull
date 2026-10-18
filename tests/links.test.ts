import test from 'node:test';
import assert from 'node:assert/strict';
import {whatsapp,pathUrl} from '../src/lib/links.ts';
import {messages} from '../src/data/contacto.ts';
test('enlaces oficiales, con mensajes codificados y sin datos financieros',()=>{
  for(const key of Object.keys(messages) as (keyof typeof messages)[]){const url=new URL(whatsapp(key));assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/51945396704');assert.equal(url.searchParams.get('text'),messages[key]);}
  assert.equal(pathUrl('prestamos/'),'/prestamos/');
});
