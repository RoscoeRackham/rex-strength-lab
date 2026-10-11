const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of ['/home/user/dino-strength-sim/dist/preview.html', process.cwd() + '/patched.html']) {
    const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
    await p.goto('file://' + f); await p.waitForTimeout(800);
    const m = p.locator('#ladder-viz .mk[aria-label^="Spider-Man"]');
    await m.scrollIntoViewIfNeeded(); await m.locator('text').first().click();
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => { const a = document.activeElement; return [a.tagName, a.getAttribute('aria-label'), a.matches && a.matches(':focus-visible'), JSON.parse(localStorage.getItem('rex-lab-v1')||'{}').logKg]; });
    console.log(f.split('/').pop(), 'mouse click ->', r);
    // ring stroke when keyboard focused in original
    await p.close();
  }
  // contrast of the ring indicator in original: ring stroke ink vs dot
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html'); await p.waitForTimeout(800);
  const geo = await p.$$eval('#ladder-viz .mk', els => els.map(e => { const c = e.querySelector('circle'); return [e.getAttribute('aria-label').split(',')[0], +c.getAttribute('cy')]; }).filter(x => /Captain|Strongest/.test(x[0])));
  console.log('dot centers', geo);
  await b.close();
})();
