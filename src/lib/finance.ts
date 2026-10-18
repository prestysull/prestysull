import { simulator } from '../data/simulador.ts';
import { loans, type LoanMode } from '../data/prestamos.ts';
import { calendar } from '../data/feriados.ts';

export function moneyToCents(value: string): number {
  if (!/^\d{1,9}([.,]\d{1,2})?$/.test(value.trim())) throw new Error('Ingresa un monto válido con hasta dos decimales, sin separadores de miles.');
  const [whole, fraction = ''] = value.trim().replace(',', '.').split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
function validateCount(count: number, mode: LoanMode) {
  if (!Object.hasOwn(loans, mode)) throw new Error('Selecciona una modalidad válida.');
  if (!Number.isInteger(count) || count < (simulator.minimumInstallments ?? 1) || count > loans[mode].maxInstallments) throw new Error('Selecciona un número de cuotas dentro del escenario disponible.');
}
export function simulate(value: string, rate: number, count: number, mode: LoanMode) {
  const capital = moneyToCents(value);
  if (capital < simulator.minimumCapitalCents) throw new Error('El capital mínimo es S/ 500.00.');
  if (capital > simulator.technicalCapitalLimitCents) throw new Error('El monto supera el límite técnico de esta calculadora. Consulta con un asesor; este límite no es un máximo de aprobación.');
  if (!simulator.rates.includes(rate)) throw new Error('Selecciona una de las tasas disponibles.');
  validateCount(count, mode);
  const interest = Math.floor((capital * rate + 50) / 100);
  const insurance = Math.floor((capital * simulator.insurancePercent + 50) / 100);
  const total = capital + interest + insurance;
  const base = Math.floor((total + Math.floor(count / 2)) / count);
  const installments = Array.from({length:count}, (_,i)=> i === count-1 ? total-base*(count-1) : base);
  return { capital, interest, insurance, total, installments };
}
function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Selecciona una fecha de desembolso válida.');
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10)!==value) throw new Error('La fecha no existe.');
  return date;
}
function iso(date: Date) { return date.toISOString().slice(0,10); }
function addDays(date: Date, days: number) { const next = new Date(date); next.setUTCDate(next.getUTCDate()+days); return next; }
export function buildSchedule(date: string, count: number, mode: LoanMode, saturday: boolean | null, localHolidays: string[]) {
  validateCount(count,mode);
  const start = parseDate(date);
  localHolidays.forEach(parseDate);
  const holidays = new Set([...calendar.national,...localHolidays]);
  function adjust(base: Date, saturdayOpen: boolean): string | null {
    let day = new Date(base);
    for (let tries=0;tries<370;tries++) {
      if (!calendar.years.includes(day.getUTCFullYear())) return null;
      if (day.getUTCDay()!==0 && (saturdayOpen || day.getUTCDay()!==6) && !holidays.has(iso(day))) return iso(day);
      day = addDays(day,1);
    }
    throw new Error('El calendario configurado no permite encontrar un día hábil.');
  }
  return Array.from({length:count},(_,i)=> {
    const base = addDays(start,loans[mode].days*(i+1));
    return { base: iso(base), saturdayOpen:adjust(base,saturday ?? true), saturdayClosed:adjust(base,saturday ?? false) };
  });
}
export function formatMoney(cents: number) { return `S/ ${(cents / 100).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2})}`; }
export function formatDate(value: string) { return new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(parseDate(value)); }
