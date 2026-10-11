const fs=require('fs'), path=require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const tmp=path.join(__dirname,'page.html');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await b.newContext({viewport:{width:1280,height:900}});
  await ctx.route(/fonts\.(googleapis|gstatic)/, r=>r.abort());
  const p=await ctx.newPage();
  await p.goto('file://'+tmp); await p.waitForTimeout(1500);
  for (const id of ['bruce_banner','ansur2_m_p5','ansur2_m_p50','ansur2_m_p95','kouri1995_nonusers','steve_reeves_1947','ronnie_coleman','big_ramy','wolverine','eddie_hall','thor','hulk_savage','abomination']){
    await p.click('.fig[data-id="'+id+'"]'); await p.waitForTimeout(300);
    const t=await p.evaluate(()=>{const d=document.getElementById('drawCheck'); return d?d.innerText:'none';});
    console.log(id.padEnd(20),'::',t);
    await p.click('.fig[data-id="'+id+'"]'); await p.waitForTimeout(150);
  }
  await b.close();
})();
