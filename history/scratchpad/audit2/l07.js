const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(1500);
    const res = await page.evaluate(() => {
      function parse(c) { const m = c.match(/rgba?\(([^)]+)\)/); const p = m[1].split(',').map(s => parseFloat(s)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
      function lum(c) { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
      function bgOf(el) { let e = el; while (e) { const b = getComputedStyle(e).backgroundColor; const p = parse(b); if (p.a > 0) return p; e = e.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; }
      const out = {};
      document.querySelectorAll('.badge').forEach(b => {
        const cls = [...b.classList].filter(c => c !== 'badge').join(' ');
        const cs = getComputedStyle(b);
        const fg = parse(cs.color), bg = bgOf(b);
        const L1 = lum(fg), L2 = lum(bg);
        const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const inTable = !!b.closest('table');
        const key = cls + (inTable ? ' [table]' : ' [feat]');
        if (!out[key]) out[key] = { n: 0, color: cs.color, bg: `rgb(${bg.r},${bg.g},${bg.b})`, ratio: ratio.toFixed(2), fontSize: cs.fontSize, fontWeight: cs.fontWeight, family: cs.fontFamily.slice(0, 30), text: b.textContent, visible: b.offsetParent !== null };
        out[key].n++;
      });
      return out;
    });
    console.log(scheme, JSON.stringify(res, null, 1));
    await ctx.close();
  }
  await browser.close();
})();
