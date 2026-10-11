// L8: tapping the 924 ring on the glance tape and the locator; records which stop jump() targets.
const { open } = require('./h.js');
(async () => {
  for (const [w, touch] of [[1280, false], [390, true]]) {
    const { browser, p } = await open({ w, h: 844, touch, mobile: touch, fonts: false });
    await p.evaluate(() => { const o = Element.prototype.scrollIntoView; window.__j = []; Element.prototype.scrollIntoView = function (a) { window.__j.push(this.id); }; });
    for (const host of ['glance', 'locTape']) {
      if (host === 'locTape') { await p.evaluate(() => window.scrollTo(0, document.getElementById('under25').getBoundingClientRect().top + scrollY + 50)); await p.waitForTimeout(400); }
      const res = [];
      for (const dx of [-6, -4, -2, -1, 0, 1, 2, 4, 6]) {
        const pt = await p.evaluate(([host, dx]) => {
          const h = document.getElementById(host), c = h.querySelector('circle.m924'); if (!c) return null;
          const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2 + dx, y: r.top + r.height / 2, rw: r.width };
        }, [host, dx]);
        if (!pt) { res.push(dx + ': no ring'); continue; }
        await p.evaluate(() => { window.__j = []; });
        if (touch) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y);
        await p.waitForTimeout(100);
        res.push((dx >= 0 ? '+' : '') + dx + 'px→' + (await p.evaluate(() => window.__j.join(',') || 'none')));
      }
      console.log(w + 'px', host, '(ring diameter ' + (await p.evaluate((h) => document.getElementById(h).querySelector('circle.m924').getBoundingClientRect().width.toFixed(1), host)) + ' px):', res.join('  '));
    }
    await browser.close();
  }
})();
