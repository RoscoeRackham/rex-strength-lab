const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/l14/';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const width of [390, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const wrap = document.querySelector('#ladder-viz');
      const cs = getComputedStyle(wrap);
      return { ox: cs.overflowX, oy: cs.overflowY, h: wrap.getBoundingClientRect().height, sh: wrap.scrollHeight, ch: wrap.clientHeight };
    });
    console.log(width, 'wrap', JSON.stringify(info));
    const n = await page.$$eval("#ladder-viz .mk", (a) => a.length);
    const results = [];
    for (let i = 0; i < n; i++) { const mks = await page.$$("#ladder-viz .mk");
      const label = await mks[i].getAttribute('aria-label');
      await mks[i].focus();
      await page.waitForTimeout(50);
      const r = await page.evaluate(() => {
        const wrap = document.querySelector('#ladder-viz');
        const tip = wrap.querySelector('.tip');
        const wr = wrap.getBoundingClientRect(); const tr = tip.getBoundingClientRect();
        return { hidden: tip.hidden, tipBottom: tr.bottom, wrapBottom: wr.bottom, over: Math.round(tr.bottom - wr.bottom), top: Math.round(tr.top - wr.top), th: Math.round(tr.height), sh: wrap.scrollHeight, ch: wrap.clientHeight, st: wrap.scrollTop, text: tip.textContent.slice(0, 80) };
      });
      results.push({ label, ...r });
      if (r.over > 0) {
        await mks[i].scrollIntoViewIfNeeded();
        const box = await page.$('#ladder');
        await box.screenshot({ path: OUT + `clip-${width}-${i}.png` });
      }
    }
    for (const r of results) if (r.over > -40) console.log(width, r.over, r.top, r.th, r.sh, r.ch, r.st, '|', r.label);
    // Also check hover path
    await page.close();
  }
  await browser.close();
})();
