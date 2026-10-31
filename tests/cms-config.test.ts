import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import {parse} from 'yaml';

type Field = {name: string; fields?: Field[]};

const cmsRoot = new URL('../src/content/cms/', import.meta.url);
const adminRoot = new URL('../public/admin/', import.meta.url);
const names = ['home', 'company', 'loans', 'faq', 'contact', 'media', 'videos'] as const;

const treeFromFields = (fields: Field[]): Record<string, unknown> => Object.fromEntries(
  fields.map((field) => [field.name, field.fields ? treeFromFields(field.fields) : true]),
);

const treeFromJson = (value: unknown, path = ''): unknown => {
  if (Array.isArray(value)) {
    if (value.length) return treeFromJson(value[0], path);
    if (path === 'videos.items') return {
      visible: true,
      platform: true,
      title: true,
      description: true,
      url: true,
      thumbnail: true,
    };
    return true;
  }
  if (!value || typeof value !== 'object') return true;
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, treeFromJson(child, path ? `${path}.${key}` : key)]));
};

test('Decap usa Turbo gratuito, medios limitados y los siete archivos editoriales', () => {
  const config = parse(readFileSync(new URL('config.yml', adminRoot), 'utf8'));
  assert.equal(config.locale, 'es');
  assert.deepEqual(config.backend, {
    name: 'turbo-github',
    turbo_site_id: 'REPLACE_WITH_TURBO_SITE_ID',
    branch: 'main',
  });
  assert.equal(config.local_backend, true);
  assert.equal(config.media_folder, 'public/uploads');
  assert.equal(config.public_folder, '/uploads');
  assert.equal(config.media_library.config.max_file_size, 2_097_152);

  assert.equal(config.collections.length, 1);
  const files = config.collections[0].files;
  assert.deepEqual(files.map((file: {name: string}) => file.name), [...names]);

  for (const name of names) {
    const json = JSON.parse(readFileSync(new URL(`${name}.json`, cmsRoot), 'utf8')) as unknown;
    const file = files.find((candidate: {name: string}) => candidate.name === name);
    assert.ok(file, `falta ${name} en config.yml`);
    assert.equal(file.file, `src/content/cms/${name}.json`);
    assert.deepEqual(treeFromFields(file.fields), treeFromJson(json, name), `campos distintos en ${name}`);
  }
});

test('la interfaz no expone reglas financieras, HTML ni CSS', () => {
  const config = parse(readFileSync(new URL('config.yml', adminRoot), 'utf8'));
  const forbidden = new Set([
    'rate', 'rates', 'insurance', 'minimumCapital', 'technicalCapitalLimit', 'days',
    'maxInstallments', 'holidays', 'formula', 'html', 'css',
  ]);
  const visit = (fields: Field[], path: string): void => {
    for (const field of fields) {
      const fieldPath = `${path}.${field.name}`;
      assert.equal(forbidden.has(field.name) && fieldPath !== 'contact.days', false, `campo protegido expuesto: ${fieldPath}`);
      if (field.fields) visit(field.fields, fieldPath);
    }
  };
  for (const collection of config.collections) for (const file of collection.files) visit(file.fields, file.name);
});

test('el administrador fija Decap CMS 3.17.3 y el proxy local está disponible', () => {
  const html = readFileSync(new URL('index.html', adminRoot), 'utf8');
  assert.match(html, /<title>Administración Prestysull<\/title>/);
  assert.match(html, /https:\/\/cdn\.jsdelivr\.net\/npm\/decap-cms@3\.17\.3\/dist\/decap-cms\.js/);
  assert.doesNotMatch(html, /decap-cms@(latest|next)/);

  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.cms, 'decap-server');
  assert.equal(pkg.devDependencies['decap-server'], '3.11.6');
  assert.equal(pkg.devDependencies.yaml, '2.9.1');
});
