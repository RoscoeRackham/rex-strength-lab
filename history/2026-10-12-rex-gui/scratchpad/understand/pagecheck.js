const fs=require('fs'), path=require('path'), {pathToFileURL}=require('url');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const body=fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html','utf8');
const tmp=path.join(__dirname,'page.html');
fs.writeFileSync(tmp,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+body+'</body></html>');
(async()=>{
  const browser=await chromium.launch({executablePath:CHROME});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errs=[]; page.on('console',m=>{ if(m.type()==='error') errs.push(m.text()); });
  await page.goto(pathToFileURL(tmp).href);
  const kg=200e18*907.18474;
  await page.evaluate((lg)=>{ localStorage.setItem('rex-lab-v1', JSON.stringify({logKg:lg, inf:false, mode:'comic', action:'throw', obj:'baseball', angle:0})); }, Math.log10(kg)+1e-12);
  await page.reload();
  await page.waitForTimeout(1500);
  const sel = await page.$('#effort');
  await page.selectOption('#effort','allout');
  await page.waitForTimeout(2500);
  const read = await page.evaluate(()=>{
    const bay=document.getElementById('bay')||document.querySelector('main');
    const txt=(n)=>n?n.textContent.replace(/\s+/g,' ').trim():null;
    const all=(s)=>Array.from(bay.querySelectorAll(s)).map(txt);
    return {verdict:txt(bay.querySelector('.verdict')), status:all('.status-row'), tiles:all('.tiles'), effort:all('.effort-read'), happens:all('.happens'), callouts:all('.callout'), math:all('details.math .eq')};
  });
  console.log(JSON.stringify(read,null,1));
  // also the least-disruptive and the windows preset messages
  for (const e of ['least','windows','houses','block','rattle']) {
    await page.selectOption('#effort',e); await page.waitForTimeout(4000);
    const t=await page.evaluate(()=>{ const b=document.getElementById('bay')||document.querySelector('main'); const n=b.querySelector('.effort-read'); const v=b.querySelector('.verdict'); return (v?v.textContent:'')+' || '+(n?n.textContent.replace(/\s+/g,' ').trim().slice(0,700):''); });
    console.log('\n['+e+']', t);
  }
  console.log('errors',errs);
  await browser.close();
})();
