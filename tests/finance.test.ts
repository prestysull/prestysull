import test from 'node:test';
import assert from 'node:assert/strict';
import { simulate, moneyToCents, buildSchedule } from '../src/lib/finance.ts';

test('caso obligatorio: 500 soles, 18%, seguro 1%, cuatro cuotas', () => {
  const r = simulate('500', 18, 4, 'semanal');
  assert.deepEqual(r, {capital: 50000, interest: 9000, insurance: 500, total: 59500, installments: [14875,14875,14875,14875]});
});
test('redondea la última cuota y conserva el total exacto', () => {
  const r = simulate('500.01', 17, 3, 'semanal');
  assert.equal(r.total, 59001);
  assert.equal(r.installments.reduce((a,b)=>a+b,0),r.total);
  const t = simulate('500',18,3,'semanal');
  assert.deepEqual(t.installments,[19833,19833,19834]);
});
test('analiza dinero decimal sin perder céntimos', () => {
  assert.equal(moneyToCents('500,25'),50025);
  for (const bad of ['', 'NaN', 'Infinity', '-500', '500.001', '5e3', '1,000.00']) assert.throws(()=>moneyToCents(bad));
});
test('rechaza capitales, tasas, modalidades y cuotas inválidas',()=> {
  for (const amount of ['499.99','1000000.01']) assert.throws(()=>simulate(amount,18,4,'semanal'));
  for (const rate of [0,19,NaN,Infinity]) assert.throws(()=>simulate('500',rate,4,'semanal'));
  for (const n of [0,9,1.5,NaN]) assert.throws(()=>simulate('500',18,n,'semanal'));
  assert.throws(()=>simulate('500',18,5,'catorcenal'));
  assert.throws(()=>simulate('500',18,4,'diario' as 'semanal'));
});
test('cada tasa y modalidad conserva céntimos en todas las cuotas',()=> {
  for (const mode of ['semanal','catorcenal'] as const) for (const rate of [15,16,17,18,20]) for (let n=1;n<=(mode==='semanal'?8:4);n++) {
    const r=simulate('999999.99',rate,n,mode);
    assert.equal(r.installments.reduce((a,b)=>a+b,0),r.total);
    assert.ok(r.installments.every(Number.isSafeInteger));
  }
});
test('desplaza domingo y feriado, sin desplazar las fechas base siguientes',()=> {
  const rows=buildSchedule('2026-06-22',2,'semanal',true,[]);
  assert.equal(rows[0].base,'2026-06-29');
  assert.equal(rows[0].saturdayOpen,'2026-06-30');
  assert.equal(rows[1].base,'2026-07-06');
  assert.equal(buildSchedule('2026-10-18',1,'semanal',true,[])[0].saturdayOpen,'2026-10-26');
});
test('sábados sin confirmar muestran dos alternativas',()=> {
  const row=buildSchedule('2026-10-17',1,'semanal',null,[])[0];
  assert.equal(row.saturdayOpen,'2026-10-24');
  assert.equal(row.saturdayClosed,'2026-10-26');
});
test('catorcenal +14 días y feriados locales encadenados',()=> {
  const r=buildSchedule('2026-10-10',1,'catorcenal',false,['2026-10-26']);
  assert.equal(r[0].base,'2026-10-24');
  assert.equal(r[0].saturdayClosed,'2026-10-27');
});
test('Semana Santa 2026 y años sin calendario revisado',()=> {
  assert.equal(buildSchedule('2026-03-26',1,'semanal',false,[])[0].saturdayClosed,'2026-04-06');
  const row=buildSchedule('2026-12-28',1,'semanal',null,[])[0];
  assert.equal(row.base,'2027-01-04');
  assert.equal(row.saturdayOpen,null);
  assert.equal(row.saturdayClosed,null);
});
test('rechaza fechas inexistentes y feriados locales inválidos',()=> {
  for(const date of ['2026-02-30','17/10/2026','','2026-13-01']) assert.throws(()=>buildSchedule(date,4,'semanal',null,[]));
  assert.throws(()=>buildSchedule('2026-10-17',4,'semanal',null,['2026-02-30']));
});
