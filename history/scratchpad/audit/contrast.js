const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const cases = JSON.parse(process.argv[2]);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, w, st, scheme] of cases) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 }, colorScheme: scheme || 'light' });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await page.reload(); await page.waitForTimeout(600);
    await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => (d.open = true)));
    const res = await page.evaluate(() => {
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
      const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
      const bgOf = (el) => { let stack = []; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); const b = parse(s.backgroundColor); if (b && b.a > 0) { stack.push(b); if (b.a >= 1) break; } } let base = { r: 255, g: 255, b: 255 }; for (let i = stack.length - 1; i >= 0; i--) { const b = stack[i]; base = { r: b.r * b.a + base.r * (1 - b.a), g: b.g * b.a + base.g * (1 - b.a), b: b.b * b.a + base.b * (1 - b.a) }; } return base; };
      const out = [];
      const all = document.querySelectorAll('#bay *');
      for (const el of all) {
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
        if (!hasText) continue;
        if (el.closest('svg')) continue;
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || s.display === 'none' || el.getClientRects().length === 0) continue;
        const fg = parse(s.color); const bg = bgOf(el);
        const L1 = lum(fg), L2 = lum(bg); const cr = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const fs = parseFloat(s.fontSize); const bold = Number(s.fontWeight) >= 700;
        const need = fs >= 24 || (fs >= 18.66 && bold) ? 3 : 4.5;
        if (cr < need) out.push(cr.toFixed(2) + ' fs=' + fs + ' ' + el.tagName + '.' + el.className + ' "' + el.textContent.trim().slice(0, 50) + '" fg=' + s.color);
      }
      // svg text
      for (const t of document.querySelectorAll('#bay svg text')) {
        const s = getComputedStyle(t); out.push('SVG fill=' + s.fill + ' "' + t.textContent.slice(0, 30) + '"');
      }
      return out;
    });
    console.log('==== ' + name + '\n' + [...new Set(res)].slice(0, 40).join('\n'));
    await page.close();
  }
  await browser.close();
})();
