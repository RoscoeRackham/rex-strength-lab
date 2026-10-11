const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = 'file:///home/user/dino-strength-sim/dist/preview.html';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, touch] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    await page.goto(prev);
    await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 1.5, inf: false })); });
    await page.reload();
    await page.waitForTimeout(800);
    // Element-from-point at each dot centre
    const res = await page.evaluate(() => {
      const gs = [...document.querySelectorAll('#ladder-viz svg g.mk')];
      return gs.map((g, i) => {
        const c = g.querySelector('circle.ring');
        const r = c.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        // scroll into view not needed for elementFromPoint? needs to be in viewport
        return { i, label: g.getAttribute('aria-label') };
      });
    });
    const out = [];
    for (const m of res) {
      const info = await page.evaluate((i) => {
        const g = document.querySelectorAll('#ladder-viz svg g.mk')[i];
        const c = g.querySelector('circle.ring');
        c.scrollIntoView({ block: 'center' });
        const r = c.getBoundingClientRect();
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        const hit = document.elementFromPoint(x, y);
        const hg = hit && hit.closest('g.mk');
        // also test points across the 10px dot
        const offs = [-4, -2, 0, 2, 4];
        const own = offs.map(dx => { const e = document.elementFromPoint(x + dx * r.width / 10, y); const gg = e && e.closest('g.mk'); return gg === g ? 'own' : (gg ? gg.getAttribute('aria-label').split(',')[0] : (e ? e.tagName : 'null')); });
        return { x, y, hitTag: hit && hit.tagName, hitLabel: hg ? hg.getAttribute('aria-label') : null, own };
      }, m.i);
      out.push({ ...m, ...info, ok: info.hitLabel === m.label });
    }
    const bad = out.filter(o => !o.ok);
    console.log(`\n=== ${w}px: ${bad.length}/${out.length} dot centres resolve to another marker`);
    for (const o of out) console.log((o.ok ? '  ok  ' : '  BAD ') + o.label.split('.')[0] + (o.ok ? '' : '  -> ' + (o.hitLabel || o.hitTag)) + '  across-dot:' + JSON.stringify(o.own));
    // Actually tap/click each dot and read dial
    for (const m of res) {
      await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 1.5, inf: false })); });
      await page.reload(); await page.waitForTimeout(500);
      const pt = await page.evaluate((i) => {
        const g = document.querySelectorAll('#ladder-viz svg g.mk')[i];
        const c = g.querySelector('circle.ring'); c.scrollIntoView({ block: 'center' });
        const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }, m.i);
      if (touch) await page.touchscreen.tap(pt.x, pt.y); else await page.mouse.click(pt.x, pt.y);
      await page.waitForTimeout(300);
      const dial = await page.evaluate(() => document.querySelector('#dial-big').textContent + ' | ' + document.querySelector('#dial-who').textContent);
      console.log('  tap ' + m.label.split('.')[0].padEnd(70) + ' => ' + dial);
    }
    await ctx.close();
  }
  await browser.close();
})();
