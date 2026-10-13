// Turn the mouse wheel over the sidebar and record page scrollY / sidebar scrollTop after each notch.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const dir = __dirname;
const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['branch.html', 'main.html'];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1280, 900], [1024, 768], [1440, 1300]]) {
    for (const f of pages) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.goto('file://' + path.join(dir, f));
      await page.waitForTimeout(1500);
      const box = await page.$eval('.panel-controls', (a) => { const r = a.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, sh: a.scrollHeight, ch: a.clientHeight, ob: getComputedStyle(a).overscrollBehaviorY, ov: getComputedStyle(a).overflowY }; });
      await page.mouse.move(box.x + 100, 400);
      const out = [];
      for (let i = 0; i < 12; i++) {
        await page.mouse.wheel(0, 400);
        await page.waitForTimeout(250);
        out.push(await page.evaluate(() => Math.round(scrollY) + '/' + Math.round(document.querySelector('.panel-controls').scrollTop)));
      }
      const end = await page.evaluate(() => {
        const r = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top) : null; };
        return { scrollY: Math.round(scrollY), docH: document.documentElement.scrollHeight, asideBottom: Math.round(document.querySelector('.panel-controls').getBoundingClientRect().bottom), surfaceTop: r('#surface'), powersTop: r('#powers > summary') || r('#powers'), vh: innerHeight };
      });
      console.log(`${f} ${w}x${h} box=${JSON.stringify(box)}\n  ${out.join(' ')}\n  end=${JSON.stringify(end)} errs=${errs.length}`);
      if (f === 'branch.html' && w === 1280) await page.screenshot({ path: path.join(dir, 'wheel-1280-' + f.replace('.html', '') + '.png') });
      await ctx.close();
    }
  }
  await browser.close();
})();
