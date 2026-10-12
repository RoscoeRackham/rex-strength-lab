const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const setState = async (obj) => {
    await page.evaluate((o) => { const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); Object.assign(s, o); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, obj);
    await page.reload(); await page.waitForTimeout(1500);
  };
  await page.goto('file:///home/user/rex-strength-lab/rex-strength-lab/dist/preview.html');
  await page.waitForTimeout(1500);
  const scenarios = JSON.parse(process.argv[2]);
  for (const sc of scenarios) {
    await setState(sc.state);
    if (sc.effort) { await page.selectOption('#effort', sc.effort); await page.waitForTimeout(sc.wait || 3000); }
    if (sc.open) await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => d.open = true));
    const txt = await page.evaluate(() => document.querySelector('#bay').innerText);
    console.log('==== ', JSON.stringify(sc));
    console.log(sc.grep ? txt.split('\n').filter((l) => new RegExp(sc.grep, 'i').test(l)).join('\n') : txt);
    if (sc.shot) await page.screenshot({ path: sc.shot, fullPage: true });
  }
  console.log('errors', errs);
  await browser.close();
})();
