const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = process.argv.slice(2).map(s => s.split(':'));
  for (const [obj, lg] of cases) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript(([obj, lg]) => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: Number(lg), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'lift', obj, angle: 45 })); }, [obj, lg]);
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/prev.html');
    await page.waitForTimeout(1500);
    const t = await page.evaluate(() => {
      const v = document.querySelector('.verdict'); const chips = [...document.querySelectorAll('.status-row .status')].map(s => s.textContent);
      return { verdict: v && v.textContent, chips, slider: document.querySelector('#strength').value, valtext: document.querySelector('#strength').getAttribute('aria-valuetext') };
    });
    console.log(obj, lg, JSON.stringify(t));
    if (obj === 'piano') await (await page.$('main.panel')).screenshot({ path: 'n4-piano.png' });
    await page.close();
  }
  await browser.close();
})();
