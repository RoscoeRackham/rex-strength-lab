const run=require('./page.js');
(async()=>{
 for (const [lab,extra] of [['off friction',{anchor:'friction'}],['off bolted',{anchor:'bolted'}]]) {
 for (const kg of [20000, 90718.474]) {
 const st=Object.assign({action:'stomp',logKg:Math.log10(kg),effort:'allout',airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false},extra);
 const t=await run(st,p=>p.evaluate(()=>document.body.innerText));
 const lines=t.split('\n').filter(l=>/mm\/s at|upper bound|standing foot|Newton’s third law again|bolts/i.test(l) && l.length<1500);
 console.log('=== '+lab+' '+kg+'\n'+lines.join('\n'));
 }}
})();
