const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await b.newContext({viewport:{width:1280,height:900}});
  const p=await ctx.newPage();
  await p.goto('file://'+__dirname+'/preview.html'); await p.waitForTimeout(1500);
  await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('rex-lab-v1')||'{}'); Object.assign(s,{logKg:19.2, action:'punch', silentStrike:true, inf:false}); localStorage.setItem('rex-lab-v1', JSON.stringify(s));});
  await p.reload(); await p.waitForTimeout(2500);
  await p.evaluate(()=>{const s=document.querySelector('#absorb'); s.value='instant'; s.dispatchEvent(new Event('change'));});
  await p.waitForTimeout(800);
  await p.evaluate(()=>{const s=document.querySelector('#effort'); s.value='allout'; s.dispatchEvent(new Event('change'));});
  await p.waitForTimeout(2500);
  const t=await p.evaluate(()=>document.querySelector('main.panel').innerText);
  const i=t.indexOf('absorbed'); console.log(t.slice(Math.max(0,i-200), i+1500));
  await b.close();
})();
