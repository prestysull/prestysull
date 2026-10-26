const toggle=document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav=document.querySelector<HTMLElement>('#main-nav');
if(toggle&&nav){
  document.documentElement.classList.add('has-js');
  const close=()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menú');nav.classList.remove('open');};
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('open',open);});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){close();toggle.focus();}});
  document.addEventListener('click',e=>{if(e.target instanceof HTMLElement&&!e.target.closest('.nav-wrap'))close();});
  matchMedia('(min-width: 901px)').addEventListener('change',close);
}
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const heroGallery=document.querySelector<HTMLElement>('[data-hero-gallery]');
if(heroGallery){
  const slides=Array.from(heroGallery.querySelectorAll<HTMLElement>('[data-hero-slide]'));
  const dots=Array.from(heroGallery.querySelectorAll<HTMLButtonElement>('[data-hero-dot]'));
  const label=heroGallery.querySelector<HTMLElement>('[data-hero-label]')!;
  const toggle=heroGallery.querySelector<HTMLButtonElement>('[data-hero-toggle]')!;
  let active=0;let timer=0;let inView=true;let held=false;let userPaused=false;
  const stop=()=>{if(timer){clearTimeout(timer);timer=0;}};
  const canRotate=()=>!motion.matches&&inView&&!held&&!userPaused&&document.visibilityState==='visible';
  const schedule=()=>{stop();if(canRotate())timer=window.setTimeout(()=>{show((active+1)%slides.length);},5500);};
  const show=(next:number)=>{
    active=next;heroGallery.dataset.activeSlide=String(active);
    slides.forEach((slide,i)=>{const selected=i===active;slide.classList.toggle('is-active',selected);slide.setAttribute('aria-hidden',String(!selected));});
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===active)));
    label.textContent=dots[active].getAttribute('aria-label')!.replace(/^Mostrar /,'').replace(/^./,c=>c.toUpperCase());
    schedule();
  };
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
  toggle.addEventListener('click',()=>{userPaused=!userPaused;toggle.setAttribute('aria-pressed',String(userPaused));toggle.setAttribute('aria-label',userPaused?'Reanudar cambio de imágenes':'Pausar cambio de imágenes');schedule();});
  heroGallery.addEventListener('pointerenter',()=>{held=true;stop();});
  heroGallery.addEventListener('pointerleave',()=>{held=false;schedule();});
  heroGallery.addEventListener('focusin',()=>{held=true;stop();});
  heroGallery.addEventListener('focusout',()=>{held=false;schedule();});
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener('change',schedule);
  new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;schedule();},{threshold:.25}).observe(heroGallery);
  schedule();
}
if(!motion.matches){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll<HTMLElement>('.reveal').forEach(el=>{el.classList.add('will-reveal');revealObserver.observe(el);});
  const parallax=Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  let ticking=false;
  const scroll=()=>{if(ticking||motion.matches)return;ticking=true;requestAnimationFrame(()=>{for(const el of parallax){const bounds=el.getBoundingClientRect();if(bounds.bottom>0&&bounds.top<window.innerHeight)el.style.transform=`translateY(${Math.max(-22,Math.min(22,window.scrollY*Number(el.dataset.parallax)))}px)`;}ticking=false;});};
  window.addEventListener('scroll',scroll,{passive:true});
  motion.addEventListener('change',()=>{if(motion.matches){document.querySelectorAll('.will-reveal').forEach(el=>el.classList.add('is-visible'));parallax.forEach(el=>el.style.transform='none');}});
}
const steps=document.querySelectorAll<HTMLElement>('[data-step]');
if(steps.length){
  const observer=new IntersectionObserver(entries=>{entries.filter(e=>e.isIntersecting).forEach(entry=>{
    steps.forEach(step=>step.classList.toggle('is-active',step===entry.target));
    const i=Number((entry.target as HTMLElement).dataset.step);
    document.querySelector('[data-step-number]')!.textContent=String(i+1).padStart(2,'0');
    document.querySelector('[data-step-title]')!.textContent=entry.target.querySelector('h3')!.textContent;
    (document.querySelector('.step-progress span') as HTMLElement).style.width=`${(i+1)/steps.length*100}%`;
  });},{rootMargin:'-25% 0px -35% 0px'});
  steps.forEach(step=>observer.observe(step));
}
const carousel=document.querySelector<HTMLElement>('.testimonials');
if(carousel){
  const move=(direction:number)=>carousel.scrollBy({left:direction*(carousel.querySelector('article')!.clientWidth+24),behavior:motion.matches?'instant':'smooth'});
  document.querySelector('[data-carousel-prev]')?.addEventListener('click',()=>move(-1));
  document.querySelector('[data-carousel-next]')?.addEventListener('click',()=>move(1));
  carousel.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
}
