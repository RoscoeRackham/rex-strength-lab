const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/rex-strength-lab/rex-strength-lab/dist/preview.html');
  await p.waitForTimeout(1000);
  await p.click('#tab-weight');
  for (const mode of ['gradual', 'instant', 'runaway']) {
    await p.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
    await p.selectOption('#absorb', mode);
    for (const w of ['krakatoa', 'chicxulub', 'sun']) {
      await p.click('#grow-what-' + w);
      await p.waitForTimeout(300);
      const t = await p.evaluate(() => document.querySelector('.growth-whatif').innerText);
      console.log('=====', mode, w, '\n' + t.split('\n').slice(6).join('\n'));
    }
  }
  await b.close();
})();
