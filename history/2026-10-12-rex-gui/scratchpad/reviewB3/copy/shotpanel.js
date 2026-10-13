const { open, settle } = require('./h.js');
(async () => {
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const scheme of ['light', 'dark']) {
    const { browser, page, errs } = await open({ w, h, scheme });
    await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    for (const v of [100, 50, 30, 0]) {
      await page.evaluate((v) => { const s = document.getElementById('air-absorb'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, v);
      await settle(page);
      const info = await page.evaluate(() => { const s = document.getElementById('air-absorb'); return { big: document.getElementById('air-absorb-big').textContent, read: document.getElementById('air-absorb-read').textContent, vt: s.getAttribute('aria-valuetext'), sum: document.getElementById('powers-sum').textContent, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
      console.log(w, scheme, v, JSON.stringify(info));
      const el = await page.$('#powers');
      if (v === 30 || v === 100) await el.screenshot({ path: `shots/powers-${w}-${scheme}-${v}.png` });
    }
    console.log('errs', errs);
    await browser.close();
  }
})();
