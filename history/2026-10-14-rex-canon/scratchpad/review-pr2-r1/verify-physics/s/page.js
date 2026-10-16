const fs=require('fs'), path=require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R=process.env.WT||'/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-physics/repo/rex-strength-lab';
const html=fs.readFileSync(R+'/dist/index.html','utf8');
const file=path.join(__dirname,(process.env.WT?'main':'br')+'-page.html');
fs.writeFileSync(file,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+html+'</body></html>');
module.exports = async function run(state, fn) {
  const b=await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p=await b.newPage({viewport:{width:1280,height:900}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file://'+file);
  await p.evaluate(s=>{localStorage.setItem('rex-lab-v1',JSON.stringify(s));},Object.assign({saveV:2},state));
  await p.reload();
  for (let i=0;i<120;i++){ const t=await p.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(500); }
  const out=await fn(p);
  await b.close();
  if (errs.length) console.log('ERRORS',errs);
  return out;
};
