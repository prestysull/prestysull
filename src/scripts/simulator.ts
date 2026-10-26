import {simulate,buildSchedule,formatMoney,formatDate} from '../lib/finance';
import {simulator} from '../data/simulador';
import {loans,type LoanMode} from '../data/prestamos';

const form=document.querySelector<HTMLFormElement>('.calculator-form');
if(form){
  const capital=document.querySelector<HTMLInputElement>('#capital')!;
  const rate=document.querySelector<HTMLSelectElement>('#rate')!;
  const count=document.querySelector<HTMLSelectElement>('#count')!;
  const date=document.querySelector<HTMLInputElement>('#date')!;
  const error=document.querySelector<HTMLElement>('#calc-error')!;
  const result=document.querySelector<HTMLElement>('#calc-result')!;
  const status=document.querySelector<HTMLElement>('#calc-status')!;
  const scheduleSection=document.querySelector<HTMLElement>('#schedule-section')!;
  const tbody=document.querySelector<HTMLTableSectionElement>('#schedule-body')!;
  const installmentTrack=document.querySelector<HTMLElement>('[data-installment-track]')!;
  const mode=()=>form.querySelector<HTMLInputElement>('input[name="mode"]:checked')!.value as LoanMode;
  const set=(key:string,text:string)=>document.querySelectorAll<HTMLElement>(`[data-result="${key}"]`).forEach(el=>el.textContent=text);
  date.value=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const requestedMode=new URL(window.location.href).searchParams.get('modalidad');
  if(requestedMode==='semanal'||requestedMode==='catorcenal') form.querySelector<HTMLInputElement>(`input[value="${requestedMode}"]`)!.checked=true;
  function syncCount(){
    const selected=Number(count.value);
    count.replaceChildren(...Array.from({length:loans[mode()].maxInstallments-(simulator.minimumInstallments??1)+1},(_,i)=>{
      const n=i+(simulator.minimumInstallments??1);const option=document.createElement('option');option.value=String(n);option.textContent=`${n} cuotas`;return option;
    }));
    count.value=String(Math.min(Math.max(selected,simulator.minimumInstallments??1),loans[mode()].maxInstallments));
  }
  function calculate(){
    error.hidden=true;capital.removeAttribute('aria-invalid');
    try{
      const r=simulate(capital.value,Number(rate.value),Number(count.value),mode());
      const rows=buildSchedule(date.value,r.installments.length,mode(),simulator.saturdayIsBusinessDay,simulator.localHolidays);
      document.querySelector<HTMLElement>('#schedule-disbursement')!.textContent=formatDate(date.value);
      set('installment',formatMoney(r.installments[0]));
      set('frequency',`${count.value} cuotas · cada ${loans[mode()].days} días`);
      for(const key of ['capital','interest','insurance','total'] as const) set(key,formatMoney(r[key]));
      set('schedule-total',formatMoney(r.total));
      installmentTrack.replaceChildren(...r.installments.map((_,i)=>{const marker=document.createElement('i');marker.dataset.installmentMarker='';marker.style.setProperty('--i',String(i));return marker;}));
      tbody.replaceChildren(...rows.map((row,i)=>{
        const tr=document.createElement('tr');
        const cells=[String(i+1).padStart(2,'0'),formatDate(row.base),formatMoney(r.installments[i])];
        cells.forEach((text,j)=>{const cell=document.createElement(j===0?'th':'td');if(j===0)cell.setAttribute('scope','row');cell.textContent=text;tr.append(cell);});return tr;
      }));
      result.hidden=false;scheduleSection.hidden=false;
      if(!matchMedia('(prefers-reduced-motion: reduce)').matches)result.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.2,0,0,1)'});
      status.textContent=`Cálculo actualizado: ${count.value} cuotas. Cuota base ${formatMoney(r.installments[0])}.`;
      status.classList.add('sr-only');
    }catch(e){
      result.hidden=true;scheduleSection.hidden=true;installmentTrack.replaceChildren();
      error.textContent=e instanceof Error?e.message:'No se pudo calcular. Revisa los datos e inténtalo otra vez.';
      error.hidden=false;status.textContent='Revisa los datos para continuar.';status.classList.remove('sr-only');
    }
  }
  form.addEventListener('input',()=>{result.hidden=true;scheduleSection.hidden=true;installmentTrack.replaceChildren();error.hidden=true;status.classList.remove('sr-only');status.textContent='Modificaste los datos. Pulsa «Calcular mi escenario» para actualizar el resultado.';});
  form.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',syncCount));
  form.addEventListener('submit',event=>{event.preventDefault();calculate();});
  syncCount();document.querySelector<HTMLFieldSetElement>('#calculator-fields')!.disabled=false;calculate();
}
