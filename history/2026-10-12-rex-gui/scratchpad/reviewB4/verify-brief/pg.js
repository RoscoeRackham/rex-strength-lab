const fs=require('fs'), path=require('path'), {pathToFileURL}=require('url');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const R='/home/user/rex-strength-lab/rex-strength-lab/';
const {settle}=require(R+'test/make-page-fixture.js');
async function open(){
  const body=fs.readFileSync(R+'dist/index.html','utf8');
  const prev=path.join(__dirname,'page.html');
  fs.writeFileSync(prev,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+body+'</body></html>');
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errs=[]; page.on('pageerror',e=>errs.push(e.message)); page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await page.goto(pathToFileURL(prev).href);
  const load=async(st,bay)=>{await page.evaluate(x=>localStorage.setItem('rex-lab-v1',JSON.stringify(x)),st); await page.reload(); await page.waitForTimeout(800); await settle(page,bay||'bay'); if(st.duoOpen) await settle(page,'duo-bay');};
  const pick=async(sel,v)=>{await page.selectOption(sel,v); await page.waitForTimeout(300); await settle(page, sel==='#duo-effort'?'duo-bay':'bay');};
  const text=(id)=>page.evaluate(i=>document.getElementById(i).textContent.replace(/\s+/g,' '),id);
  return {browser,page,load,pick,text,errs};
}
module.exports={open};
