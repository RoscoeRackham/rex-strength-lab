const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const D = __dirname;
const body = fs.readFileSync(process.argv[2] || '/home/user/dino-strength-sim/dist/index.html', 'utf8');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>';
const prev = path.join(D, 'preview.html'); fs.writeFileSync(prev, wrapped);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, touch] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    await page.addInitScript(() => { try { if (!sessionStorage.getItem('x')) { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 1.5, inf: false })); sessionStorage.setItem('x', '1'); } } catch (e) {} });
    await page.goto('file://' + prev);
    await page.waitForTimeout(5000);
    const marks = await page.evaluate(() => [...document.querySelectorAll('#ladder-viz g.mk')].map((g) => {
      const c = g.querySelector('circle.ring').getBoundingClientRect();
      return { key: g.dataset.key, label: g.getAttribute('aria-label'), x: c.x + c.width / 2, y: c.y + c.height / 2 };
    }));
    console.log(`\n== ${w}x${h} touch=${touch}  markers=${marks.length}`);
    let efpMiss = 0, wrong = 0, nochange = 0, ok = 0;
    for (const m of marks) {
      // reset
      await page.evaluate(() => { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 1.5, inf: false })); });
      await page.reload(); await page.waitForTimeout(touch ? 5000 : 5000);
      const pos0 = await page.evaluate((key) => { const g = document.querySelector(`#ladder-viz g.mk[data-key="${key}"]`); g.scrollIntoView({ block: 'center' }); const c = g.querySelector('circle.ring').getBoundingClientRect(); return { x: c.x + c.width / 2, y: c.y + c.height / 2 }; }, m.key); const pos = { x: pos0.x + (+process.env.DX || 0) * (m.key[0] === "L" ? -1 : 1), y: pos0.y };
      const hit = await page.evaluate(({ x, y }) => { const e = document.elementFromPoint(x, y); const g = e && e.closest('g.mk'); return (e ? e.tagName : 'null') + (g ? ' in ' + g.dataset.key : ' (no marker)'); }, pos);
      if (!hit.includes(m.key)) efpMiss++;
      const before = await page.$eval('#dial-big', (e) => e.textContent);
      if (touch) await page.touchscreen.tap(pos.x, pos.y); else await page.mouse.click(pos.x, pos.y);
      await page.waitForTimeout(300);
      const after = await page.$eval('#dial-big', (e) => e.textContent);
      const want = m.label.split(', ').slice(1).join(', ').replace('. Set strength here.', '');
      let status;
      if (after === before) { status = 'NO CHANGE'; nochange++; }
      else if (after.includes(want.split(' · ')[0])) { status = 'ok'; ok++; }
      else { status = 'WRONG'; wrong++; }
      console.log(`${m.key.padEnd(18)} efp=${hit.padEnd(28)} ${status.padEnd(9)} dial: ${before} -> ${after}   [${m.label.slice(0, 70)}]`);
    }
    console.log(`summary ${w}: efp miss ${efpMiss}/${marks.length}; ok ${ok}, wrong ${wrong}, nochange ${nochange}`);
    await ctx.close();
  }
  await browser.close();
})();
