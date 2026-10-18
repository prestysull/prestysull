import {test,expect} from '@playwright/test';
import {writeFileSync} from 'node:fs';
test('scroll y carga local sin servicios externos',async({page})=>{
  const external:string[]=[];
  page.on('request',request=>{if(new URL(request.url()).hostname!=='127.0.0.1')external.push(request.url());});
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/');await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(async()=>{
    const intervals:number[]=[];let previous=performance.now();
    const longTasks:number[]=[];const observer=new PerformanceObserver(list=>list.getEntries().forEach(e=>longTasks.push(e.duration)));
    observer.observe({type:'longtask'});
    for(let i=0;i<120;i++)await new Promise<void>(resolve=>requestAnimationFrame(now=>{intervals.push(now-previous);previous=now;window.scrollTo(0,i*35);resolve();}));
    observer.disconnect();intervals.sort((a,b)=>a-b);
    const assets=performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const inlineBytes=Array.from(document.querySelectorAll('script[type="module"]:not([src])')).reduce((sum,s)=>sum+new TextEncoder().encode(s.textContent??'').length,0);
    return {viewport:'1440x1000',frames:intervals.length,medianFrameMs:intervals[60],p95FrameMs:intervals[114],longTasksDuringScroll:longTasks,loadedBytes:assets.reduce((n,r)=>n+r.decodedBodySize,0),scriptBytes:inlineBytes+assets.filter(r=>r.name.endsWith('.js')).reduce((n,r)=>n+r.decodedBodySize,0),resources:assets.length};
  });
  expect(external).toEqual([]);expect(metrics.scriptBytes).toBeLessThan(30000);
  await page.screenshot({path:'docs/qa/desktop-bottom.png'});
  writeFileSync('docs/qa/performance.json',JSON.stringify({note:'Medición local en Edge automatizado, sin emular red lenta ni dispositivo físico. No es una puntuación Lighthouse ni garantía de FPS.',...metrics},null,2));
});
