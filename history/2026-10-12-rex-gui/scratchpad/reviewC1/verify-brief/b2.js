const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const R=process.argv[2]; const ALLOUT=process.argv[3]==='allout';
const { settle } = require(path.join(R,'test','make-page-fixture.js'));
(async()=>{
  const body=fs.readFileSync(path.join(R,'dist','index.html'),'utf8');
  const prev=path.join(process.env.S,'prev2.html');
  fs.writeFileSync(prev,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+body+'</body></html>');
  const b=await chromium.launch({executablePath:CHROME});
  const page=await b.newPage({viewport:{width:1280,height:900}});
  await page.goto(pathToFileURL(prev).href);
  const load = async (st) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); };
  const tiles = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).filter(t=>t.querySelector('.k')).map(t=>[t.querySelector('.k').textContent, t.querySelector('.v').textContent]));
  const seen=new Set();
  for (const action of ['punch','clap','stomp']) for (const logKg of [1,3,6,9,12,15,18,21,24,27,30,34]) {
    await load({action,logKg,mode:'comic'});
    if (ALLOUT) { await page.selectOption('#effort','allout'); await page.waitForTimeout(300); await settle(page,'bay'); }
    const eff = await page.evaluate(()=>document.getElementById('effort').value);
    const ts=await tiles();
    const en=ts.filter(([k])=>/^Energy/.test(k)).map(x=>x.join(': ')).join(' ; ');
    const cw=ts.filter(([k])=>k==='Compared with').map(x=>x[1]);
    cw.forEach(t=>seen.add(t.replace(/[\d.]+/g,'#')));
    console.log(action, logKg, eff, '|', en, '|', cw.join(' ; '));
  }
  console.log('distinct wordings', seen.size);
  await b.close();
})();
