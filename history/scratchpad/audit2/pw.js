const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/shots/';
const ST=907.18474;
const cases = {
  b777: { logKg: Math.log10(100*ST), inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'lift', obj:'b777', angle:45 },
  allstar: { logKg: Math.log10(200e18*ST), inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'lift', obj:'allstar', angle:45 },
  human: { logKg: Math.log10(511), inf:false, mode:'comic', surface:'concrete', groundHolds:false, anchor:'friction', H:2, m:180, action:'stomp', obj:'car', angle:45 },
  stompbig: { logKg: 12, inf:false, mode:'comic', surface:'granite', groundHolds:false, anchor:'friction', H:2, m:180, action:'stomp', obj:'car', angle:45 },
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st] of Object.entries(cases)) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(700);
    const dial = await page.$eval('#dial-who', e => e.textContent).catch(()=>null);
    const bay = await page.$eval('#bay', e => e.innerText);
    console.log('=== ' + name + ' | dial: ' + dial + '\n' + bay.slice(0, 2500));
    await page.screenshot({ path: OUT + name + '.png', fullPage: false });
    await page.close();
  }
  await browser.close();
})();
