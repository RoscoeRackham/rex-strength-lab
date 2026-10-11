const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const mode of ['comic', 'real']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file://' + __dirname + '/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', s), JSON.stringify({ logKg: 2.7084, inf: false, mode, surface: 'concrete', action: 'lift' }));
    await page.reload(); await page.waitForTimeout(1000);
    const titles = await page.$$eval('article.feat', (as) => as.filter((a) => a.querySelector('button.run')).map((a) => a.querySelector('.t').textContent));
    for (const t of titles) {
      // reset mode each time
      await page.evaluate((m) => { if (!document.querySelector('#mode-' + m).getAttribute('aria-pressed').includes('true')) document.querySelector('#mode-' + m).click(); }, mode);
      await page.evaluate((t) => { const a = [...document.querySelectorAll('article.feat')].find((x) => x.querySelector('.t').textContent === t); a.querySelector('button.run').click(); }, t);
      await page.waitForTimeout(700);
      await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
      const r = await page.evaluate(() => {
        const txt = document.querySelector('#bay').innerText;
        const head = txt.split('\n').filter((l) => l.trim() && !/ · /.test(l) && l !== 'OBJECT').slice(0, 3).join(' / ');
        const bad = (txt.match(/[^\n]*(NaN|undefined|Infinity|null|\[object)[^\n]*/g) || []);
        return { head, bad, dial: document.querySelector('#dial-big').innerText + ' | ' + document.querySelector('#dial-who').innerText, st: localStorage.getItem('rex-lab-v1') };
      });
      console.log(`[${mode}] ${t}\n   DIAL ${r.dial}\n   HEAD ${r.head}${r.bad.length ? '\n   BAD ' + r.bad.join(' || ') : ''}`);
    }
    if (errs.length) console.log('ERRORS', errs);
    await page.close();
  }
  await browser.close();
})();
