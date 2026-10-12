const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  for (const [action,sw,extra] of [['punch','silentStrike',{logKg:34}],['clap','silentStrike',{logKg:34}],['jump','softLanding',{logKg:34}],['throw','coolFlight',{logKg:34}],['punch','silentStrike',{inf:true}],['jump','softLanding',{inf:true}],['throw','coolFlight',{inf:true}]]){
    const page=await browser.newPage({viewport:{width:1280,height:900}});
    await page.addInitScript((st)=>{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify(st));sessionStorage.setItem('x',1);} },Object.assign({action,[sw]:true},extra));
    await page.goto(URL); await page.waitForTimeout(2000);
    await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true)}); await page.selectOption('#absorb','runaway'); await page.waitForTimeout(500);
    await page.selectOption('#effort','allout'); await page.waitForTimeout(1500);
    const bayText=()=>page.evaluate(()=>document.querySelector('#bay').innerText);
    await page.fill('#half-life','1'); await page.dispatchEvent('#half-life','change'); await page.waitForTimeout(800);
    const a=await bayText();
    await page.fill('#half-life','1000'); await page.dispatchEvent('#half-life','change'); await page.waitForTimeout(800);
    const b=await bayText();
    const rl=(a.match(/Runaway loop[^\n]*/)||['(no runaway text)'])[0];
    console.log(action,JSON.stringify(extra),'changes:',a!==b,'|',rl.slice(0,230));
    await page.close();
  }
  await browser.close();
})();
