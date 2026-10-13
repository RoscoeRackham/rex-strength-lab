const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname, prev = path.join(DIR, 'page.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, scheme] of [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    await page.goto(pathToFileURL(prev).href);
    await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', logKg: 9, obj: 'car' })); });
    await page.reload(); await page.waitForTimeout(1500);
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    const el = await page.$('#powers');
    await el.screenshot({ path: path.join(DIR, `powers-${w}-${scheme}.png`) });
    // overflow check of elements inside powers
    const over = await page.evaluate(() => { const out = []; for (const n of document.querySelectorAll('#powers *')) { const r = n.getBoundingClientRect(); if (r.right > document.documentElement.clientWidth + 0.5 && r.width > 0) out.push(n.id || n.tagName + '.' + n.className); } return out.slice(0, 20); });
    console.log(w, scheme, 'overflow in powers:', over, 'docScroll', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    // slider semantics
    const a11y = await page.evaluate(() => { const s = document.getElementById('air-absorb'); return { label: s.labels && Array.from(s.labels).map((l) => l.textContent), vt: s.getAttribute('aria-valuetext'), desc: s.getAttribute('aria-describedby'), tabindex: s.tabIndex }; });
    console.log(JSON.stringify(a11y));
    // bay
    await page.evaluate(() => { document.getElementById('powers').open = false; });
    const bay = await page.$('main');
    await page.evaluate(() => document.getElementById('bay').scrollIntoView());
    await bay.screenshot({ path: path.join(DIR, `throw-bay-${w}-${scheme}.png`) });
    await page.close();
  }
  await browser.close();
})();
