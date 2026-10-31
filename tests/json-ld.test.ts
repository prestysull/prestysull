import assert from 'node:assert/strict';
import {test} from 'node:test';
import {serializeJsonLd} from '../src/lib/json-ld.ts';

test('serializa JSON-LD sin permitir cerrar el elemento script', () => {
  const value = {name: '</script><script>window.cmsInjected=true</script>'};
  const serialized = serializeJsonLd(value);
  assert.equal(serialized.includes('</script>'), false);
  assert.equal(serialized.includes('<script>'), false);
  assert.deepEqual(JSON.parse(serialized), value);
});
