const {open,settle,text,chromium}=require('./page.js');
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  let pg=await open(browser,{action:'pull',obj:'bus'});
  await pg.selectOption('#effort','allout'); await settle(pg);
  let t=await pg.evaluate(()=>document.body.innerText);
  console.log(t.split('\n').filter(l=>/all of the strength|His strength|footing sets|drags it 10 m/i.test(l)).join('\n'));
  await pg.close();
  // jump granite dial 1e9 kg
  pg=await open(browser,{action:'jump',surface:'granite',logKg:9});
  await pg.selectOption('#effort','custom'); await settle(pg);
  for (const v of ['8.20','8.22']) {
    await pg.evaluate((v)=>{const s=document.querySelector('#effort-use'); s.value=v; s.dispatchEvent(new Event('input',{bubbles:true}));},v);
    await pg.waitForTimeout(500); await settle(pg);
    t=await pg.evaluate(()=>document.body.innerText);
    console.log('--- effort 10^'+v);
    console.log(t.split('\n').filter(l=>/Ground holds|ground holds|plaster may crack|Effort:/i.test(l)).slice(0,8).map(l=>l.slice(0,300)).join('\n'));
  }
  console.log('ERRORS',pg.errs);
  await browser.close();
})();
