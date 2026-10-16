const run=require('./page.js');
(async()=>{
 const st={duoOpen:true,duoAction:'catch',cObj:'bus',cLogD:1,cStyle:'hard'};
 const t=await run(st,async p=>{ await p.waitForTimeout(500); for (let i=0;i<120;i++){ const t=await p.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(500);} return p.evaluate(()=>document.body.innerText)});
 console.log(t.split('\n').filter(l=>/slams|own push|5\.69|endless ocean \(/i.test(l)&&l.length<900).slice(0,6).join('\n'));
})();
