// node narrow.js <page> <states.json>: at 390 px light and dark, horizontal overflow and SVG text past the svg's box
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [pg, sp] = process.argv.slice(2);
(async () => {
  const body = fs.readFileSync(pg, 'utf8');
  const tmp = path.join(path.dirname(sp), 'narrow-page.html');
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const states = JSON.parse(fs.readFileSync(sp, 'utf8'));
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(pathToFileURL(tmp).href);
    for (const [id, st] of Object.entries(states)) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ duoOpen: true, saveV: 3 }, st.state));
      await page.reload(); await page.waitForTimeout(400);
      if (st.ollieKg != null) { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(200);
        await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, st.ollieKg); await page.waitForTimeout(500); }
      for (let i = 0; i < 200; i++) { if (!(await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)))) break; await page.waitForTimeout(125); }
      for (const e of (st.efforts || ['least'])) {
        if (e.startsWith('custom:')) { await page.evaluate((v) => { const s = document.getElementById('duo-effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, Number(e.slice(7))); await page.waitForTimeout(600); }
        else { await page.selectOption('#duo-effort', e).catch(() => {}); await page.waitForTimeout(200); }
        for (let i = 0; i < 200; i++) { if (!(await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)))) break; await page.waitForTimeout(125); }
        const r = await page.evaluate(() => {
          const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
          const clipped = [];
          for (const svg of document.querySelectorAll('#duo-bay svg')) { const b = svg.getBoundingClientRect(); for (const t of svg.querySelectorAll('text')) { const r = t.getBoundingClientRect(); if (r.width && (r.left < b.left - 1 || r.right > b.right + 1)) clipped.push(t.textContent.slice(0, 40)); } }
          return { ov, clipped };
        });
        if (r.ov > 0 || r.clipped.length || errs.length) console.log(scheme, id, e, JSON.stringify(r), errs.splice(0).join(' | '));
      }
    }
    await page.close();
  }
  await browser.close(); console.log('done');
})().catch((e) => { console.error(e); process.exit(1); });
