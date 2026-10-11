const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1280, height: 1800 } });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  const base = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 };
  const cases = [ ['1e34', Object.assign({}, base, { logKg: 34 })], ['inf', Object.assign({}, base, { inf: true })], ['inf braced', Object.assign({}, base, { inf: true, anchor:'braced' })], ['inf real', Object.assign({}, base, { inf: true, mode:'real' })] ];
  for (const [label, st] of cases) {
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.goto(url);
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => {
      const q = (s) => Array.from(document.querySelectorAll(s)).map(e => e.innerText.replace(/\s+/g,' ').trim());
      return { verdict: q('.verdict'), chips: q('.status'), tiles: q('.tile').filter(t => /recoil/i.test(t)), happens: q('.happens li').filter(t=>/recoil|backward|third law/i.test(t)) };
    });
    console.log('==', label, JSON.stringify(txt, null, 1));
    await page.screenshot({ path: 'm6-' + label.replace(/ /g,'_') + '.png' });
  }
  // also click the ∞ button from defaults
  await page.goto(url);
  await page.evaluate(() => localStorage.removeItem('rex-lab-v1'));
  await page.goto(url);
  await page.waitForTimeout(500);
  const btns = await page.$$eval('button', bs => bs.map(b => b.innerText.trim()).filter(t => /∞|Infin/i.test(t)));
  console.log('inf buttons', btns);
  const btn = await page.$('button:has-text("∞")');
  if (btn) { await btn.click(); await page.waitForTimeout(500);
    const txt = await page.evaluate(() => {
      const q = (s) => Array.from(document.querySelectorAll(s)).map(e => e.innerText.replace(/\s+/g,' ').trim());
      return { dial: document.querySelector('#dial-big').innerText, verdict: q('.verdict'), chips: q('.status'), tiles: q('.tile').filter(t => /recoil/i.test(t)) };
    });
    console.log('== clicked ∞', JSON.stringify(txt, null, 1));
    await page.screenshot({ path: 'm6-clicked.png' });
  }
  await b.close();
})();
