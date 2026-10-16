const run=require('./page.js');
(async()=>{
 const st={action:'throw',obj:'car',angle:0,surface:'sand',logKg:9};
 const t=await run(st,async p=>{ const s=await p.$$('select'); for (const x of s){ const ok=await x.evaluate(e=>[...e.options].some(o=>o.value==='allout')); if(ok){ await x.selectOption('allout'); break; } }
   await p.waitForTimeout(300);
   for (let i=0;i<120;i++){ const t=await p.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(500);} 
   return p.evaluate(()=>document.body.innerText)});
 console.log(t.split('\n').filter(l=>/plaster may crack|Plaster/i.test(l)&&l.length<400).join('\n'));
})();
