// usage: node pg.js '<json state>' [effort] [ollieLogKg]
const fs=require('fs'), path=require('path'), {pathToFileURL}=require('url');
const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/physics/repo/rex-strength-lab';
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const {settle}=require(R+'/test/make-page-fixture.js');
const OUT='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/physics/page.html';
(async()=>{
  if(!fs.existsSync(OUT)){const body=fs.readFileSync(R+'/dist/index.html','utf8');fs.writeFileSync(OUT,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+body+'</body></html>');}
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.goto(pathToFileURL(OUT).href);
  const runs=JSON.parse(process.argv[2]);
  for (const run of runs){
    const st=run.st, eff=run.eff, okg=run.okg;
    await page.evaluate(x=>localStorage.setItem('rex-lab-v1',JSON.stringify(x)),Object.assign({duoOpen:true},st)); await page.reload(); await page.waitForTimeout(800); await settle(page,'bay'); await page.waitForTimeout(300); await settle(page,'duo-bay');
    if(okg!=null){ await page.evaluate(()=>{document.getElementById('ollie-setup').open=true;}); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate(v=>{const s=document.getElementById('o-strength'); s.value=String(v); s.dispatchEvent(new Event('input',{bubbles:true})); s.dispatchEvent(new Event('change',{bubbles:true}));},okg); await page.waitForTimeout(800); await settle(page,'duo-bay'); }
    if(eff){ await page.selectOption('#duo-effort',eff); await page.waitForTimeout(300); await settle(page,'duo-bay'); }
    for(let i=0;i<60;i++){ const t=await page.evaluate(()=>document.getElementById('duo-bay').textContent); if(!/working it out|Working out/i.test(t)) break; await page.waitForTimeout(500);}
    const parts=await page.evaluate(()=>{const b=document.getElementById('duo-bay'); const q=s=>Array.from(b.querySelectorAll(s)).map(n=>n.innerText.replace(/\s+/g,' ').trim()).join(' || ');
      return {verdict:q('.verdict'),chips:q('.status-row'),tiles:q('.tiles'),effort:q('.effort-read'),happens:q('.happens'),callout:q('.callout')};});
    console.log('=== '+(run.label||JSON.stringify(st))+' eff='+eff);
    for(const k of (run.show||['verdict','chips','tiles','effort','happens','callout'])) console.log('['+k+'] '+parts[k]);
  }
  if(errs.length) console.log('ERRORS',errs);
  await b.close();
})();
