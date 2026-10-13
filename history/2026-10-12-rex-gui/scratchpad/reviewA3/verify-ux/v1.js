// Independent check of ux-1: does page scrolling (pointer over results) ever bring Ground / Their powers on screen?
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const D = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const sizes = [[1280, 900], [1024, 768], [1366, 768], [1440, 900], [1920, 1080], [1280, 720]];
  for (const which of ['branch', 'main']) {
    for (const [w, h] of sizes) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.goto('file://' + path.join(D, which + '.html'));
      await page.waitForTimeout(1500);
      const sel = which === 'branch'
        ? { ground: '#surface', powers: '#powers > summary' }
        : { ground: '#surface', powers: '#comic-setup > summary' };
      const info = await page.evaluate(() => {
        const a = document.querySelector('.panel-controls');
        return { asideH: a.clientHeight, asideScrollH: a.scrollHeight, overflowY: getComputedStyle(a).overflowY, maxH: getComputedStyle(a).maxHeight, docH: document.documentElement.scrollHeight, setupOpen: (document.querySelector('#setup') || {}).open };
      });
      const maxY = info.docH - h;
      const firstSeen = { ground: null, powers: null };
      let maxAsideScroll = 0;
      for (let y = 0; y <= maxY + 20; y += 20) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        const r = await page.evaluate((sel) => {
          const out = {};
          const a = document.querySelector('.panel-controls');
          for (const k of Object.keys(sel)) {
            const el = document.querySelector(sel[k]);
            const b = el.getBoundingClientRect();
            const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
            let hit = false;
            if (cy >= 0 && cy < innerHeight) {
              const e = document.elementFromPoint(cx, cy);
              hit = !!e && (e === el || el.contains(e));
            }
            out[k] = hit;
          }
          out.asideScroll = a.scrollTop;
          return out;
        }, sel);
        maxAsideScroll = Math.max(maxAsideScroll, r.asideScroll);
        for (const k of ['ground', 'powers']) if (r[k] && firstSeen[k] === null) firstSeen[k] = y;
      }
      console.log(which, `${w}x${h}`, JSON.stringify(info), 'firstSeen', JSON.stringify(firstSeen), 'maxAsideScrollTop', maxAsideScroll, errs.length ? 'ERR ' + errs : '');
      await ctx.close();
    }
  }
  await browser.close();
})();
