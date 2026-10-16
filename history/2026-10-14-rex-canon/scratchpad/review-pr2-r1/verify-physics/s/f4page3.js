const run=require('./page.js');
(async()=>{
 const st={action:'throw',obj:'car',angle:0,surface:'sand',logKg:9};
 const t=await run(st,async p=>{ const s=await p.$$('select'); for (const x of s){ const ok=await x.evaluate(e=>[...e.options].some(o=>o.value==='allout')); if(ok){ await x.selectOption('allout'); break; } }
   await p.waitForTimeout(300);
   for (let i=0;i<120;i++){ const t=await p.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(500);} 
   return p.evaluate(()=>{ const d=[...document.querySelectorAll('details')].find(d=>/Where each hazard starts/.test(d.querySelector('summary')?.textContent||'')); return d? [...d.querySelectorAll('li,tr,p')].map(x=>x.textContent).join('\n'):'none'; })});
 console.log(t.split('\n').filter(l=>/[Pp]laster|[Rr]each|out to/.test(l)).slice(0,8).map(l=>l.slice(0,300)).join('\n'));
})();
