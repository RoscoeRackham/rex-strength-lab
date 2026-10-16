const { chromium, prep, loadOn, settledOn, W, CHROME } = require('./common.js');
const url = prep();
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const pg = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
    await pg.goto(url); await loadOn(pg, { action: 'weight' });
    await pg.click('#grow-what-krakatoa'); await pg.waitForTimeout(500); await settledOn(pg, 'bay');
    const r = await pg.evaluate(() => {
      const parse = (c) => c.match(/[\d.]+/g).map(Number);
      const lum = (c) => { const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const bgOf = (n) => { while (n) { const p = parse(getComputedStyle(n).backgroundColor); if (p.length < 4 || p[3] > 0) return p; n = n.parentElement; } return [255, 255, 255]; };
      return Array.from(document.querySelector('#bay .growth-whatif .tile.shimmer').children).map((c) => { const fg = parse(getComputedStyle(c).color), bg = bgOf(c); const a = lum(fg), b = lum(bg); return c.className + ' ' + ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2); });
    });
    console.log(scheme, r.join(', '));
    await pg.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
