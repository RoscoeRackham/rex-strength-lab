const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.addInitScript(()=>{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify({action:'weight'}));sessionStorage.setItem('x',1);} });
  await page.goto(URL); await page.waitForTimeout(2500);
  await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true)});
  await page.selectOption('#absorb','runaway'); await page.waitForTimeout(500);
  console.log('half-row hidden?',await page.$eval('#half-row',e=>e.hidden));
  const chips=await page.$$eval('#bay button',bs=>bs.map(b=>b.textContent).filter(t=>/Sun|Krakatoa|impact|Chicx/i.test(t)));
  console.log('growth chips',chips);
  const bayText=()=>page.evaluate(()=>document.querySelector('#bay').innerText);
  for (const dens of ['His build (default)','Neutron star','Black hole']){
    await page.evaluate((d)=>{[...document.querySelectorAll('#density-chips button')].find(b=>b.textContent===d).click()},dens); await page.waitForTimeout(400);
    for (const gw of chips){
      await page.evaluate((t)=>{[...document.querySelectorAll('#bay button')].find(b=>b.textContent===t).click()},gw); await page.waitForTimeout(400);
      await page.fill('#half-life','1'); await page.dispatchEvent('#half-life','change'); await page.waitForTimeout(300);
      const a=await bayText();
      await page.fill('#half-life','1000'); await page.dispatchEvent('#half-life','change'); await page.waitForTimeout(300);
      const b=await bayText();
      const rl=(a.match(/Runaway loop[^\n]*/)||[''])[0];
      console.log(dens,'|',gw,'| changes:',a!==b,'|',rl.slice(0,220));
    }
  }
  await browser.close();
})();
