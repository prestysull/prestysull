import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
test('la configuración carga SITE_URL y BASE_PATH del archivo .env documentado',()=>{
  const dir=mkdtempSync(join(tmpdir(),'prestysull-config-'));
  const envPath=join(dir,'.env');
  writeFileSync(envPath,'SITE_URL=https://preview.example.test\nBASE_PATH=/revision/\n');
  const env={...process.env};delete env.SITE_URL;delete env.BASE_PATH;
  try{
    const moduleUrl=new URL('../astro.config.mjs',import.meta.url).href;
    const output=execFileSync(process.execPath,['--input-type=module','-e',`const {default:c}=await import(${JSON.stringify(moduleUrl)}); console.log(JSON.stringify({site:c.site,base:c.base}));`],{cwd:dir,env,encoding:'utf8'});
    assert.deepEqual(JSON.parse(output),{site:'https://preview.example.test',base:'/revision/'});
  }finally{unlinkSync(envPath);rmdirSync(dir);}
});
