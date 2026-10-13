// With the Rex + Ollie element open and scrolled into view, wheel over the sidebar until Their powers / Bolted is on screen.
// Report whether the two-player verdict is still on screen at that point.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const dir = __dirname;
const pages = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1280, 900], [1024, 768]]) {
    for (const f of pages) {
      for (const act of ['arm', 'catch', 'collide']) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h } });
        await ctx.addInitScript((a) => { try { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: a })); sessionStorage.setItem('x', '1'); } } catch (e) {} }, act);
        const page = await ctx.newPage();
        await page.goto('file://' + path.join(dir, f));
        await page.waitForFunction(() => { const v = document.querySelector('#duo-bay .verdict'); return v && v.textContent.length > 10; }, null, { timeout: 60000 });
        await page.evaluate(() => { document.getElementById('powers').open = true; });
        await page.waitForTimeout(300);
        await page.evaluate(() => window.scrollTo(0, document.getElementById('duo-bay').getBoundingClientRect().top + window.scrollY - 20));
        await page.waitForTimeout(300);
        const box = await page.$eval('.panel-controls', (a) => { const r = a.getBoundingClientRect(); return { x: r.x, y: r.y }; });
        await page.mouse.move(box.x + 100, Math.max(box.y + 50, 300));
        const vis = () => page.evaluate(() => {
          const r = (s) => { const n = document.querySelector(s).getBoundingClientRect(); return n.top >= 0 && n.bottom <= innerHeight; };
          return { bolt: r('#bolt-rex'), verdict: r('#duo-bay .verdict'), sy: Math.round(scrollY), st: Math.round(document.querySelector('.panel-controls').scrollTop) };
        });
        let v = await vis(), n = 0;
        while (!v.bolt && n < 20) { await page.mouse.wheel(0, 100); await page.waitForTimeout(120); v = await vis(); n++; }
        console.log(`${f} ${w}x${h} ${act}: after ${n} wheel notches of 100px ->`, JSON.stringify(v));
        await ctx.close();
      }
    }
  }
  await browser.close();
})();
