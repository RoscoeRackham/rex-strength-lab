// Real wheel notches over the results column; screenshots of the stuck sidebar; what is at the clip line.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const D = __dirname;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const which of ['branch', 'main']) {
    for (const [w, h] of [[1366, 768], [1280, 900]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(D, which + '.html'));
      await page.waitForTimeout(1500);
      const pSel = which === 'branch' ? '#powers > summary' : '#comic-setup > summary';
      const res = await page.$eval('.panel-controls + *', (e) => { const b = e.getBoundingClientRect(); return { x: b.x, w: b.width }; });
      await page.mouse.move(res.x + res.w / 2, h / 2);
      let log = [];
      let shot = false;
      for (let i = 0; i < 60; i++) {
        await page.mouse.wheel(0, 100);
        await page.waitForTimeout(60);
        const r = await page.evaluate((pSel) => {
          const vis = (el) => { const b = el.getBoundingClientRect(); const cx = b.left + b.width / 2, cy = b.top + b.height / 2; if (cy < 0 || cy >= innerHeight) return false; const e = document.elementFromPoint(cx, cy); return !!e && (e === el || el.contains(e)); };
          const a = document.querySelector('.panel-controls');
          return { y: Math.round(scrollY), g: vis(document.querySelector('#surface')), p: vis(document.querySelector(pSel)), as: a.scrollTop, aTop: Math.round(a.getBoundingClientRect().top), aBot: Math.round(a.getBoundingClientRect().bottom) };
        }, pSel);
        log.push(r.y + (r.g ? 'G' : '') + (r.p ? 'P' : ''));
        if (!shot && r.aTop <= 13 && r.aTop >= 11) {
          await page.screenshot({ path: path.join(D, `stuck-${which}-${w}x${h}.png`) });
          // what is cut by the bottom edge of the aside box?
          const cut = await page.evaluate(() => {
            const a = document.querySelector('.panel-controls');
            const ab = a.getBoundingClientRect();
            const items = [...a.querySelectorAll('label, select, input, summary, p, .chips, h2, h3')].map((e) => ({ e, b: e.getBoundingClientRect() }));
            const cutItems = items.filter(({ b }) => b.top < ab.bottom && b.bottom > ab.bottom).map(({ e, b }) => `${e.tagName}#${e.id}.${e.className} [${Math.round(b.top)}-${Math.round(b.bottom)}] ${(e.textContent || '').trim().slice(0, 40)}`);
            const lastFull = items.filter(({ b }) => b.bottom <= ab.bottom).slice(-1).map(({ e }) => `${e.tagName}#${e.id} ${(e.textContent || '').trim().slice(0, 50)}`);
            return { asideBottom: Math.round(ab.bottom), cutItems, lastFull, sbWidth: a.offsetWidth - a.clientWidth - parseFloat(getComputedStyle(a).borderLeftWidth) - parseFloat(getComputedStyle(a).borderRightWidth) };
          });
          console.log(which, `${w}x${h}`, 'at stick, scrollY', r.y, JSON.stringify(cut));
          shot = true;
        }
      }
      console.log(which, `${w}x${h}`, 'wheel log:', log.join(' '));
      await ctx.close();
    }
  }
  await browser.close();
})();
