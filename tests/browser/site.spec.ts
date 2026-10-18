import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const routes=['/','/prestamos/','/prestamos/semanal/','/prestamos/catorcenal/','/simulador/','/nosotros/','/contacto/','/404.html'];

for(const width of [320,390,768,1440]) test(`rutas, imágenes y desbordamiento a ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of routes){
    const response=await page.goto(path);expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
    const broken=await page.locator('img').evaluateAll(imgs=>(imgs as HTMLImageElement[]).filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.src));expect(broken).toEqual([]);
    if(path==='/'||path==='/simulador/') await page.screenshot({path:`docs/qa/${width}-${path==='/'?'inicio':'simulador'}.png`,fullPage:true});
  }
  expect(errors).toEqual([]);
});
test('el caso obligatorio se calcula en navegador y los cambios invalidan el resultado',async({page})=>{
  await page.goto('/simulador/');await expect(page.locator('[data-result="installment"]')).toHaveText('S/ 148.75');
  await page.locator('#date').fill('2026-10-17');await page.getByRole('button',{name:'Calcular mi escenario'}).click();
  await expect(page.locator('[data-result="interest"]')).toHaveText('S/ 90.00');
  await expect(page.locator('[data-result="insurance"]')).toHaveText('S/ 5.00');
  await expect(page.locator('[data-result="total"]')).toHaveText('S/ 595.00');
  await expect(page.locator('#schedule-body tr')).toHaveCount(4);
  await expect(page.locator('#calendar-notice')).toContainText('sábados');
  await page.locator('#capital').fill('499');await expect(page.locator('#calc-result')).toBeHidden();
  await page.getByRole('button',{name:'Calcular mi escenario'}).click();await expect(page.getByRole('alert')).toContainText('mínimo');
  await page.locator('#capital').fill('500');await page.getByLabel('Catorcenal',{exact:false}).check();await expect(page.locator('#count option')).toHaveCount(4);
  await page.locator('#count').selectOption('3');await page.getByRole('button',{name:'Calcular mi escenario'}).click();
  await expect(page.locator('#schedule-body tr')).toHaveCount(3);await expect(page.locator('#schedule-body tr').last()).toContainText('S/ 198.34');
  await page.locator('#date').fill('2026-12-28');await page.getByRole('button',{name:'Calcular mi escenario'}).click();await expect(page.locator('#calendar-notice')).toContainText('fuera del calendario');
});
test('menú móvil por teclado, cierre Escape y FAQ',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  const menu=page.locator('.menu-toggle');await menu.focus();await page.keyboard.press('Enter');await expect(menu).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');await expect(menu).toHaveAttribute('aria-expanded','false');await expect(menu).toBeFocused();
  await menu.click();await page.locator('#main-nav').getByRole('link',{name:'Préstamos',exact:true}).click();await expect(page).toHaveURL(/prestamos/);
  await page.goto('/');await page.locator('summary').first().click();await expect(page.locator('details').first()).toHaveAttribute('open','');
});
test('WhatsApp contextual codificado, navegación interna y contenido de producción',async({page,request})=>{
  const seen=new Set<string>();
  for(const route of routes){await page.goto(route);
    for(const href of await page.locator('a').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter((s):s is string=>!!s))){
      if(href.startsWith('https://wa.me/')){const url=new URL(href);expect(url.pathname).toBe('/51945396704');expect(url.searchParams.get('text')).toMatch(/^Hola,/);expect(href).not.toContain(' ');}
      if(href.startsWith('/'))seen.add(href.split('#')[0].split('?')[0]||'/');
    }
    await expect(page.locator('.demo-section,.institution-demo,.draft-note')).toHaveCount(0);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/.{30}/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
  }
  for(const href of seen){expect((await request.get(href)).status(),href).toBe(200);}
  expect((await request.get('/robots.txt')).status()).toBe(200);expect((await request.get('/sitemap.xml')).status()).toBe(200);
});
test('accesibilidad automática WCAG en las rutas',async({page})=>{
  test.setTimeout(120000);
  for(const route of routes){await page.goto(route);await page.emulateMedia({reducedMotion:'reduce'});const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(report.violations,JSON.stringify(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))).toEqual([]);}
});
test('movimiento reducido y progresión del proceso',async({page})=>{
  await page.goto('/');await page.locator('[data-step="4"]').scrollIntoViewIfNeeded();await expect(page.locator('[data-step-number]')).not.toHaveText('01');
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');expect(await page.locator('h1').evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  expect(await page.locator('.reveal').first().evaluate(el=>getComputedStyle(el).opacity)).toBe('1');
});
test('sin JavaScript conserva navegación y evita envío del formulario',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();
  await page.goto('http://127.0.0.1:4321/');await expect(page.locator('#main-nav')).toBeVisible();await expect(page.locator('.loan-card').first()).toBeVisible();
  await page.goto('http://127.0.0.1:4321/simulador/');await expect(page.locator('#capital')).toBeDisabled();await expect(page.locator('noscript p')).toBeVisible();expect(await page.locator('noscript p').evaluate(el=>el.textContent)).toContain('Activa JavaScript');await context.close();
});
test('una dirección inexistente devuelve la página 404 personalizada',async({page})=>{
  const response=await page.goto('/esta-pagina-no-existe/');expect(response?.status()).toBe(404);await expect(page.locator('h1')).toContainText('Volvamos');
});
