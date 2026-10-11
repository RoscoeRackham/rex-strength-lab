const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [logKg, inf, mode] of [[20,false,'cartoon'],[16,false,'cartoon'],[14,false,'cartoon'],[25,false,'cartoon'],[30,false,'cartoon'],[3,true,'cartoon'],[20,false,'real']]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, { logKg, inf, action: 'stomp', ...(mode==='real'?{mode:'real'}:{}) });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(600);
    const res = await page.evaluate(() => {
      const t = [...document.querySelectorAll('.tile')].find(x => x.querySelector('.k') && x.querySelector('.k').textContent.includes('He gets launched'));
      const verdict = document.querySelector('.verdict');
      return { tile: t ? [...t.children].map(c => c.textContent) : null, verdict: verdict ? verdict.textContent : null, tab: document.querySelector('[aria-selected="true"]')?.id };
    });
    console.log(logKg, inf, mode, JSON.stringify(res));
    if (logKg === 20 && mode==='cartoon') await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l18-stomp20.png', fullPage: false });
    await page.close();
  }
  await browser.close();
})();
