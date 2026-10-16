const run=require('./page.js');
(async()=>{
 const st={action:'stomp',logKg:Math.log10(20000),airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false};
 const t=await run(st,p=>p.evaluate(()=>document.body.innerText));
 const lines=t.split('\n').filter(l=>/mm\/s|upper bound|standing foot|Newton|shak/i.test(l));
 console.log(lines.join('\n'));
})();
