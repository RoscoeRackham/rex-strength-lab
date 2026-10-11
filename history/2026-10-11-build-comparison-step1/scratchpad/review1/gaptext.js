const fs=require('fs'), path=require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await (await b.newContext({viewport:{width:1280,height:900}})).newPage();
  await p.route(/fonts\.(googleapis|gstatic)/, r=>r.abort());
  await p.goto('file://'+path.join(__dirname,'page.html')); await p.waitForTimeout(2000);
  const t=await p.evaluate(()=>['empty','empty-2','empty-3','under25','top','rex-and-ollie'].map(id=>{const el=document.getElementById(id); return id+' :: '+(el?el.querySelector('.stop-head').innerText.replace(/\n+/g,' | '):'none');}).join('\n')+'\nLIMITS: '+document.getElementById('limitsSub').innerText+'\nNOTES: '+document.getElementById('limitsNotes').innerText);
  console.log(t);
  const seq=await p.evaluate(()=>window.__bc.SEQ.map(s=>s.kind+':'+s.id+':'+(s.lo||0).toFixed(2)+'-'+(s.hi||0).toFixed(2)).join(' '));
  console.log(seq);
  await b.close();
})();
