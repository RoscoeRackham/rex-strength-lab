const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
const url='file://'+R+'dist/index.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const ctx=await browser.newContext({viewport:{width:390,height:900}});
  const page=await ctx.newPage(); const errs=[]; page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await page.addInitScript(s=>{try{localStorage.setItem('rex-lab-v1',s)}catch(e){}}, JSON.stringify({action:'weight'}));
  await page.goto(url); await page.waitForTimeout(1500);
  await page.evaluate(()=>{document.getElementById('powers').open=true});
  await page.selectOption('#absorb','gradual'); await page.waitForTimeout(400);
  for (const g of ['krakatoa','chicxulub']) {
    await page.click('#grow-what-'+g); await page.waitForTimeout(800);
    const t=await page.evaluate(()=>{const b=document.querySelector('#bay .growth-whatif'); return Array.from(b.querySelectorAll('p, tr, li')).map(n=>n.textContent.replace(/\s+/g,' ').trim()).filter(x=>/becomes|Mix|Pure|It becomes/.test(x)).join('\n');});
    console.log('=== '+g+' (Gradual growth, 390 px)\n'+t.replace(/[  ]/g,' '));
    await page.screenshot({path:'grow-'+g+'.png', fullPage:false});
  }
  // sources table SN 1998bw row
  const rows=await page.evaluate(()=>Array.from(document.querySelectorAll('tr')).map(r=>r.textContent.replace(/\s+/g,' ').trim()).filter(x=>/1998bw|massive star’s supernova|Everything a core-collapse|Lifting a 100 g apple|Moon's whole mass/.test(x)));
  rows.forEach(r=>console.log('ROW:',r.slice(0,600)));
  console.log('errors',errs);
  await browser.close();
})();
