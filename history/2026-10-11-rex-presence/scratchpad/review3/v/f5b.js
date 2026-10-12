const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const {PREV}=require('./lib');
(async()=>{
 for (const [label,ls] of [['throw-inf-real',{inf:true,mode:'real',action:'throw',obj:'car'}],['throw-inf-real-piano',{inf:true,mode:'real',action:'throw',obj:'piano'}]]) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport:{width:1280,height:900} });
  await page.addInitScript((v)=>{ try{localStorage.setItem('rex-lab-v1',v)}catch(e){} }, JSON.stringify(ls));
  await page.goto(PREV); await page.waitForSelector('#bay summary');
  const log=[];
  for (let i=0;i<40;i++){
    const r=await page.evaluate(()=>{const s=[...document.querySelectorAll('#bay summary')].find(x=>/Show the math/.test(x.textContent));
      const w=/working it out|Working out/i.test(document.querySelector('#bay').textContent);
      const a=document.activeElement; const cur=a===document.body?'BODY':a.tagName+':'+a.textContent.slice(0,15);
      if (w && s && a!==s) s.focus();
      return {w,cur};});
    log.push((r.w?'W':'-')+r.cur);
    if(!r.w && i>0) break;
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(500);
  const post=await page.evaluate(()=>{const a=document.activeElement; return a===document.body?'BODY (focus lost)':a.tagName+':'+a.textContent.slice(0,20)});
  console.log(label, log.slice(-4).join(' | '), '=> post', post);
  await browser.close();
 }
})();
