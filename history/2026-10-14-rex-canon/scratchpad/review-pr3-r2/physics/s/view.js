// usage: node view.js '<state json>' [effort] [bay|duo-bay] [htmlpath]
const fs=require('fs'), path=require('path'), {pathToFileURL}=require('url');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/physics/repo/rex-strength-lab';
const {settle}=require(R+'/test/make-page-fixture.js');
(async()=>{
  const st=JSON.parse(process.argv[2]); const eff=process.argv[3]||''; const bay=process.argv[4]||'bay';
  const src=process.argv[5]||(R+'/dist/index.html');
  const html=fs.readFileSync(src,'utf8');
  const wrap=path.join(__dirname,'wrap-'+path.basename(path.dirname(path.dirname(src)))+'.html');
  fs.writeFileSync(wrap,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+html+'</body></html>');
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto(pathToFileURL(wrap).href);
  await p.evaluate(s=>localStorage.setItem('rex-lab-v1',JSON.stringify(s)),st);
  await p.reload(); await p.waitForTimeout(900); await settle(p,bay);
  if (eff){ await p.selectOption(bay==='duo-bay'?'#duo-effort':'#effort',eff); await p.waitForTimeout(400); await settle(p,bay); }
  const t=await p.evaluate(id=>{const B=document.getElementById(id); const q=s=>Array.from(B.querySelectorAll(s)).map(n=>n.textContent.replace(/\s+/g,' ').trim()); return {verdict:q('.verdict'),status:q('.status-row'),tiles:q('.tile'),effort:q('.effort-read'),happens:q('.happens li, .happens'),callouts:q('.callout')};},bay);
  console.log(JSON.stringify(t,null,1)); if(errs.length) console.log('ERRS',errs);
  await b.close();
})();
