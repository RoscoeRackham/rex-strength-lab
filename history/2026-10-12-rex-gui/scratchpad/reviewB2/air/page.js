// usage: node page.js '<json state>' [effort] [bay]  -> prints bay text
const fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require('/opt/node22/lib/node_modules/playwright');
const html=fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html','utf8');
const prev=path.join(__dirname,'preview.html');
if(!fs.existsSync(prev)||fs.statSync(prev).mtimeMs<fs.statSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html').mtimeMs)
 fs.writeFileSync(prev,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>'+html+'</body></html>');
async function settle(page,id){for(let i=0;i<240;i++){const b=await page.evaluate(id=>/working it out|Working out/i.test(document.getElementById(id).textContent),id);if(!b)return;await page.waitForTimeout(250);}}
module.exports=async function run(cases){
 const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
 const page=await browser.newPage({viewport:{width:1280,height:900}});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await page.goto(pathToFileURL(prev).href);
 const res=[];
 for(const c of cases){
  const bay=c.bay||(c.state.duoOpen?'duo-bay':'bay');
  await page.evaluate(s=>{localStorage.clear();localStorage.setItem('rex-lab-v1',JSON.stringify(s))},c.state);
  await page.reload();await page.waitForTimeout(700);await settle(page,bay);
  if(c.effort){await page.selectOption(bay==='duo-bay'?'#duo-effort':'#effort',c.effort);await page.waitForTimeout(300);await settle(page,bay);}
  if(c.eval){await page.evaluate(c.eval);await page.waitForTimeout(400);await settle(page,bay);}
  const t=await page.evaluate(id=>document.getElementById(id).innerText,bay);
  res.push(t);
 }
 await browser.close();
 if(errs.length)console.log('ERRORS',errs);
 return res;
};
if(require.main===module){(async()=>{const st=JSON.parse(process.argv[2]);const r=await module.exports([{state:st,effort:process.argv[3],bay:process.argv[4]}]);console.log(r[0]);})();}
