const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const URL='file://'+__dirname+'/preview.html';
(async()=>{
  const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.addInitScript(()=>{ if(!sessionStorage.getItem('x')){localStorage.setItem('rex-lab-v1',JSON.stringify({action:'weight'}));sessionStorage.setItem('x',1);} });
  await page.goto(URL); await page.waitForTimeout(2500);
  await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true)});
  await page.selectOption('#absorb','instant'); await page.waitForTimeout(500);
  await page.evaluate(()=>{[...document.querySelectorAll('#bay button')].find(b=>b.textContent==='Dinosaur-killer impact').click()}); await page.waitForTimeout(500);
  const t=await page.evaluate(()=>document.querySelector('#bay').innerText);
  console.log((t.match(/The air at his surface[^\n]*/)||[''])[0]);
  // duo arm readout
  await page.evaluate(()=>{document.querySelector('#grp-duo').click()}); await page.waitForTimeout(500); await page.click('#tab-arm'); await page.waitForTimeout(4000);
  console.log((await page.evaluate(()=>document.querySelector('#bay .effort-read p').innerText)));
  await browser.close();
})();
