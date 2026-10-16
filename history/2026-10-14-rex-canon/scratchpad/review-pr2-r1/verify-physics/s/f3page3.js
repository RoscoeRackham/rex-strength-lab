const run=require('./page.js');
(async()=>{
 const st={action:'stomp',logKg:Math.log10(20000),effort:'allout',airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false,anchor:'friction'};
 const t=await run(st,p=>p.evaluate(()=>document.body.innerText));
 const i=t.indexOf('Stomp'); 
 const lines=t.split('\n').filter(l=>/mm\/s/.test(l)).map(l=>l.slice(0,400));
 console.log(lines.join('\n---\n'));
 const k=t.indexOf('Effort:'); console.log('\n#### EFFORT BOX\n'+t.slice(k-200,k+3000));
})();
