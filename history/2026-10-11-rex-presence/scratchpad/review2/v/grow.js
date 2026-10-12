const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file://'+__dirname+'/preview.html'); await p.waitForTimeout(2500);
  await p.click('#grp-solo'); await p.click('#tab-weight'); await p.waitForTimeout(800);
  for (const mode of ['instant','gradual']) {
    await p.evaluate((m)=>{const s=document.querySelector('#absorb'); s.value=m; s.dispatchEvent(new Event('change'));}, mode);
    await p.waitForTimeout(500);
    for (const what of ['krakatoa','chicxulub']) {
      await p.click('#grow-what-'+what); await p.waitForTimeout(1500);
      const t=await p.evaluate(()=>document.querySelector('.growth-whatif').innerText);
      console.log('=== ',mode,what,'\n',t);
    }
  }
  const r=await p.evaluate(()=>{const P=window.DinoPhys; const D=window.DINO_DATA; const out=[];
    const body=P.makeBody? P.makeBody({H:P.DEFAULT_BODIES.rex.H, m:P.DEFAULT_BODIES.rex.m, build:'rex'}):null;
    return {keys:Object.keys(P.DEFAULT_BODIES.rex), mb: P.makeBody.toString().slice(0,200)};});
  console.log(JSON.stringify(r));
  await b.close();
})();
