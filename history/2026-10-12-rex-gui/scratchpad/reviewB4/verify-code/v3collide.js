const fs=require('fs'), path=require('path');
const {open,chromium}=require('./page.js');
async function grab(browser,url,state){
  const ctx=await browser.newContext({viewport:{width:1280,height:900}});
  await ctx.addInitScript((s)=>{ try{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify(s)); sessionStorage.setItem('x','1');} }catch(e){} }, state);
  const page=await ctx.newPage();
  await page.goto(url);
  const wait=async()=>{ for(let i=0;i<600;i++){ const t=await page.evaluate(()=>document.body.innerText); if(!/working it out|Working out/i.test(t)) return; await page.waitForTimeout(250);} };
  await wait(); await page.selectOption('#duo-effort','ground'); await page.waitForTimeout(300); await wait();
  const dg=await page.evaluate(()=>document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g,' '));
  const dgBay=await page.evaluate(()=>document.getElementById('duo-bay').textContent.replace(/\s+/g,' '));
  await ctx.close(); return {dg,dgBay};
}
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const f of ['/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', path.join(__dirname,'p9.html')]) {
    const url=await open(f);
    const a=await grab(browser,url,{duoOpen:true,duoAction:'collide',anchor:'bolted'});
    const pass = !(!/set aside for this test/.test(a.dg) || !/Effort: /.test(a.dg) || !/The least effort that breaks the ground/.test(a.dg) || /Least disruptive already does this/.test(a.dg) || /The ground holds: their power/.test(a.dgBay) || !/On real ground, courtesy ceiling: .*?Past that, the ground breaks under Rex/.test(a.dg));
    console.log(path.basename(f),'shots.js line-498 check passes:',pass);
    console.log('  ', (a.dg.match(/On real ground, courtesy ceiling:[^.]*\.[^.]*\./)||[''])[0]);
    const b=await grab(browser,url,{duoOpen:true,duoAction:'collide',anchor:'friction',colSrc:'jump',logKg:6.25,near:3});
    console.log('  standing Rex, jump, 10^6.25, 3 m:', (b.dg.match(/On real ground, courtesy ceiling:.*?(?=$)/)||[''])[0].slice(0,220));
  }
  await browser.close();
})();
