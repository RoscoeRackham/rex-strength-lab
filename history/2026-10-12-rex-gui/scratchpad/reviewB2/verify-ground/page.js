const fs=require('fs'), path=require('path'), {pathToFileURL}=require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html=fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html','utf8');
const file=path.join(__dirname,'page.html');
fs.writeFileSync(file,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+html+'</body></html>');
async function open(browser, st){
  const pg=await browser.newPage({viewport:{width:1280,height:900}});
  const errs=[]; pg.on('console',m=>{if(m.type()==='error')errs.push(m.text());}); pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto(pathToFileURL(file).href);
  await pg.evaluate((s)=>{localStorage.setItem('rex-lab-v1',JSON.stringify(s));},st);
  await pg.reload(); await settle(pg); pg.errs=errs; return pg;
}
async function settle(pg){ for(let i=0;i<240;i++){ await pg.waitForTimeout(250); const t=await pg.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) return; } }
async function text(pg,sel){ return pg.evaluate((s)=>{const e=document.querySelector(s); return e?e.innerText:'(none)';},sel||'main'); }
module.exports={open,settle,text,chromium};
