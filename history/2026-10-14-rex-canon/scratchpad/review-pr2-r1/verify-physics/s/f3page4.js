const run=require('./page.js');
(async()=>{
 for (const anchor of ['friction','bolted']) {
 const st={action:'stomp',logKg:Math.log10(20000),airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false,anchor};
 const t=await run(st,async p=>{ const s=await p.$$('select'); for (const x of s){ const ok=await x.evaluate(e=>[...e.options].some(o=>o.value==='allout')); if(ok){ await x.selectOption('allout'); break; } }
   for (let i=0;i<60;i++){ const t=await p.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(500);} 
   return p.evaluate(()=>document.body.innerText)});
 const k=t.indexOf('Adjust effort'); const seg=t.slice(k, t.indexOf('Show the math',k));
 console.log('=== '+anchor+'\n'+seg.split('\n').filter(l=>/mm\/s|upper bound|Effort:|Newton|ceiling|hazard|shak/i.test(l)).map(l=>l.slice(0,500)).join('\n'));
 }
})();
