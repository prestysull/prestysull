import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {
  cmsContent,
  selectVisibleVideos,
  type CmsContent,
  type CmsSectionName,
  validateCmsSection,
} from '../src/lib/content.ts';
import {company} from '../src/data/empresa.ts';
import {contact, messages} from '../src/data/contacto.ts';
import {faqs} from '../src/data/faq.ts';
import {loans, processSteps} from '../src/data/prestamos.ts';

const sectionNames: CmsSectionName[] = [
  'home',
  'company',
  'contact',
  'loans',
  'faq',
  'media',
  'videos',
];

const clone = <T>(value: T): T => structuredClone(value);

test('los siete archivos editoriales existen y pasan el contrato estricto', () => {
  for (const name of sectionNames) {
    const path = new URL(`../src/content/cms/${name}.json`, import.meta.url);
    const fileValue = JSON.parse(readFileSync(path, 'utf8')) as unknown;
    assert.deepEqual(validateCmsSection(name, fileValue), cmsContent[name]);
  }
});

test('el hero exige tres escenas y el proceso exactamente seis etapas', () => {
  for (const hero of [cmsContent.media.hero.slice(0, 2), [...cmsContent.media.hero, cmsContent.media.hero[0]]]) {
    const media = clone(cmsContent.media);
    media.hero = hero as typeof media.hero;
    assert.throws(() => validateCmsSection('media', media), /media.*hero/i);
  }

  for (const process of [cmsContent.loans.process.slice(0, 5), [...cmsContent.loans.process, cmsContent.loans.process[0]]]) {
    const loans = clone(cmsContent.loans);
    loans.process = process as typeof loans.process;
    assert.throws(() => validateCmsSection('loans', loans), /loans.*process/i);
  }
});

test('rechaza secciones truncadas, texto vacío y campos desconocidos indicando sección y campo', () => {
  assert.throws(() => validateCmsSection('company', {name: 'Prestysull'}), /company.*tagline/i);

  const company = clone(cmsContent.company);
  company.about = '   ';
  assert.throws(() => validateCmsSection('company', company), /company.*about/i);

  assert.throws(
    () => validateCmsSection('home', {...cmsContent.home, unexpected: true}),
    /home.*unexpected/i,
  );
});

test('contacto acepta formatos publicados y bloquea teléfonos o enlaces inseguros', () => {
  assert.equal(validateCmsSection('contact', cmsContent.contact).whatsapp, '51945396704');

  for (const [field, value] of [
    ['whatsapp', '+51 945 396 704'],
    ['phone', '<script>'],
    ['facebook', 'http://facebook.com/prestysull'],
    ['tiktok', 'javascript:alert(1)'],
    ['map', 'https://example.com/mapa'],
  ] as const) {
    const contact = clone(cmsContent.contact);
    contact[field] = value;
    assert.throws(() => validateCmsSection('contact', contact), new RegExp(`contact.*${field}`, 'i'));
  }
});

test('las imágenes solo admiten /uploads/, sin recorridos, y requieren texto alternativo', () => {
  for (const src of ['https://example.com/a.webp', '/images/a.webp', '/uploads/../secret.jpg', '/uploads\\bad.jpg']) {
    const media = clone(cmsContent.media);
    media.hero[0].src = src;
    assert.throws(() => validateCmsSection('media', media), /media.*hero\.0\.src/i);
  }

  const media = clone(cmsContent.media);
  media.about.alt = '';
  assert.throws(() => validateCmsSection('media', media), /media.*about\.alt/i);
});

test('FAQ puede estar vacío pero cada entrada exige pregunta y respuesta', () => {
  assert.deepEqual(validateCmsSection('faq', {items: []}), {items: []});
  assert.throws(() => validateCmsSection('faq', {items: [{q: '¿Pregunta?'}]}), /faq.*items\.0\.a/i);
});

test('videos empieza desactivado y vacío, y bloquea enlaces o miniaturas inseguros', () => {
  assert.deepEqual(cmsContent.videos, {
    enabled: false,
    title: 'Historias que avanzan',
    intro: 'Conoce experiencias y novedades de Prestysull.',
    items: [],
  });

  const validItem = {
    visible: true,
    platform: 'YouTube',
    title: 'Conoce Prestysull',
    description: 'Información para comerciantes y trabajadores de Sullana.',
    url: 'https://www.youtube.com/watch?v=abc123',
    thumbnail: '/uploads/video.webp',
  };

  assert.equal(validateCmsSection('videos', {...cmsContent.videos, items: [validItem]}).items.length, 1);
  for (const thumbnail of ['', null]) {
    const parsed: CmsContent['videos'] = validateCmsSection('videos', {...cmsContent.videos, items: [{...validItem, thumbnail}]});
    assert.equal(parsed.items[0].thumbnail, undefined);
  }

  for (const [field, value] of [
    ['url', 'http://youtube.com/watch?v=abc123'],
    ['url', 'javascript:alert(1)'],
    ['thumbnail', '../video.webp'],
  ] as const) {
    const item = {...validItem, [field]: value};
    assert.throws(
      () => validateCmsSection('videos', {...cmsContent.videos, enabled: true, items: [item]}),
      new RegExp(String.raw`videos.*items\.0\.${field}`, 'i'),
    );
  }
});

test('los adaptadores públicos leen el contenido validado sin duplicar textos', () => {
  assert.strictEqual(company, cmsContent.company);
  assert.strictEqual(contact, cmsContent.contact);
  assert.strictEqual(messages, cmsContent.contact.messages);
  assert.strictEqual(faqs, cmsContent.faq.items);
  assert.strictEqual(loans.semanal.requirements, cmsContent.loans.semanal.requirements);
  assert.strictEqual(loans.catorcenal.requirements, cmsContent.loans.catorcenal.requirements);
  assert.deepEqual(
    processSteps.map(({title, text}) => ({title, text})),
    cmsContent.loans.process,
  );
});

test('días, máximos, iconos y configuración financiera no se vuelven editables', () => {
  assert.deepEqual(
    {
      semanal: {days: loans.semanal.days, maxInstallments: loans.semanal.maxInstallments, icon: loans.semanal.icon},
      catorcenal: {days: loans.catorcenal.days, maxInstallments: loans.catorcenal.maxInstallments, icon: loans.catorcenal.icon},
    },
    {
      semanal: {days: 7, maxInstallments: 8, icon: 'store'},
      catorcenal: {days: 14, maxInstallments: 4, icon: 'briefcase'},
    },
  );

  const forbidden = new Set([
    'rate', 'rates', 'insurance', 'insurancePercent', 'minimumCapital', 'technicalCapitalLimit',
    'days', 'maxInstallments', 'holidays', 'formula', 'defaultRate', 'defaultCapital', 'defaultCount',
  ]);
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      assert.equal(forbidden.has(key), false, `el CMS no debe incluir ${key}`);
      visit(child);
    }
  };
  visit(cmsContent.loans);
  for (const section of ['home', 'company', 'faq', 'media', 'videos'] as const) visit(cmsContent[section]);
});

test('la sección de videos solo entrega elementos visibles cuando está activada', () => {
  const item = {
    visible: true,
    platform: 'YouTube',
    title: 'Conoce Prestysull',
    description: 'Una historia local.',
    url: 'https://www.youtube.com/watch?v=abc123',
    thumbnail: '/uploads/comerciante.webp',
  };
  assert.deepEqual(selectVisibleVideos({...cmsContent.videos, enabled: false, items: [item]}), []);
  assert.deepEqual(selectVisibleVideos({...cmsContent.videos, enabled: true, items: []}), []);
  assert.deepEqual(selectVisibleVideos({...cmsContent.videos, enabled: true, items: [{...item, visible: false}]}), []);
  assert.deepEqual(selectVisibleVideos({...cmsContent.videos, enabled: true, items: [item]}), [item]);
});
