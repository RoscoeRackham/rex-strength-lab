// helper: load page with a saved state, optionally choose duo effort, return #duo-bay text
const fs=require('fs'), path=require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR=__dirname;
async function open(htmlFile){
  const html=fs.readFileSync(htmlFile,'utf8');
  const f=path.join(DIR,'wrap-'+path.basename(htmlFile));
  fs.writeFileSync(f,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+html+'</body></html>');
  return 'file://'+f;
}
async function run(browser,url,state,effort,sel='#duo-bay'){
  const ctx=await browser.newContext({viewport:{width:1280,height:900}});
  await ctx.addInitScript((s)=>{ try{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify(s)); sessionStorage.setItem('x','1');} }catch(e){} }, state);
  const page=await ctx.newPage(); const errs=[]; page.on('pageerror',e=>errs.push(String(e))); page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await page.goto(url);
  const wait=async()=>{ for(let i=0;i<600;i++){ const t=await page.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) return; await page.waitForTimeout(250);} };
  await wait();
  if (effort){ const id=sel==='#duo-bay'?'#duo-effort':'#effort'; await page.selectOption(id,effort); await page.waitForTimeout(300); await wait(); }
  const out=await page.evaluate((s)=>{ const d=document.querySelector('#duo'); const b=document.querySelector(s); return b?b.innerText:''; },sel);
  await ctx.close();
  return {text:out,errs};
}
module.exports={open,run,chromium};
