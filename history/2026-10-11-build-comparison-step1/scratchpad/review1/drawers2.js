const fs=require('fs'), path=require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const tmp=path.join(__dirname,'page.html');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await b.newContext({viewport:{width:1280,height:900}});
  await ctx.route(/fonts\.(googleapis|gstatic)/, r=>r.abort());
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
  await p.goto('file://'+tmp); await p.waitForTimeout(1500);
  await p.click('.fig[data-id="ronnie_coleman"]'); await p.waitForTimeout(1500);
  console.log(await p.evaluate(()=>{const d=document.getElementById('drawCheck'); return d? JSON.stringify([d.innerHTML, getComputedStyle(d).display]) : 'no #drawCheck';}));
  console.log(errs);
  await b.close();
})();
