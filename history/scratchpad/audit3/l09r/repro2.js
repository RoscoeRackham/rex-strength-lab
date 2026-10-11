const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = __dirname;
const PREV = 'file://' + (process.env.PREV || '/home/user/dino-strength-sim/dist/preview.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const base = { logKg: Math.log10(100 * 907.18474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'sprint', obj: 'car', angle: 45 };
  const cases = [];
  for (const w of [320, 360, 390, 430, 768]) for (const mode of ['comic', 'real']) for (const lk of [2.71, 8, 20, 30]) cases.push({ w, st: Object.assign({}, base, { mode, logKg: lk, action: 'sprint' }), tag: `sprint-${mode}-${lk}` });
  for (const w of [320, 360, 390, 768]) for (const lk of [8, 12, 16, 20, 24, 30]) for (const action of ['stomp', 'punch', 'clap', 'jump', 'pull']) cases.push({ w, st: Object.assign({}, base, { logKg: lk, action }), tag: `${action}-${lk}` });
  for (const w of [320, 360, 390, 768]) for (const o of ['pickup','car','titanic','nimitz','baseball']) for (const lk of [3, 8, 12, 16, 20, 24]) cases.push({ w, st: Object.assign({}, base, { logKg: lk, action: 'throw', obj: o }), tag: `throw-${o}-${lk}` });
  let fontInfo = null;
  for (const c of cases) {
    const ctx = await browser.newContext({ viewport: { width: c.w, height: 900 } });
    await ctx.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, c.st);
    const page = await ctx.newPage();
    await page.goto(PREV);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    if (!fontInfo) { fontInfo = await page.evaluate(() => [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight)); console.log('fonts loaded:', JSON.stringify(fontInfo)); }
    const res = await page.evaluate(() => {
      const bay = document.querySelector('#bay');
      const out = { bayW: bay.clientWidth, charts: [], tiles: [] };
      // charts: find text elements at the bottom (axis ticks) of each svg
      bay.querySelectorAll('.viz svg').forEach((svg) => {
        const vb = svg.viewBox.baseVal; const h = vb.height;
        const scale = svg.getBoundingClientRect().width / vb.width;
        const ticks = [...svg.querySelectorAll('text')].filter((t) => Math.abs(+t.getAttribute('y') - (h - 6)) < 0.5 || Math.abs(+t.getAttribute('y') - (h - 16)) < 0.5).map((t) => { const b = t.getBBox(); return { t: t.textContent, x0: +(b.x).toFixed(1), x1: +(b.x + b.width).toFixed(1) }; });
        const overlaps = [];
        for (let i = 1; i < ticks.length; i++) if (ticks[i].x0 < ticks[i - 1].x1) overlaps.push(ticks[i - 1].t + ' [' + ticks[i - 1].x0 + '-' + ticks[i - 1].x1 + '] x ' + ticks[i].t + ' [' + ticks[i].x0 + '-' + ticks[i].x1 + ']');
        const rects = [...svg.querySelectorAll('rect')].map(r => +r.getAttribute('x'));
        const zero = [...svg.querySelectorAll('text')].some(t => /^0 mm$/.test(t.textContent)) && [...svg.querySelectorAll('text')].some(t => / km$/.test(t.textContent)); out.charts.push({ zero, aria: (svg.getAttribute('aria-label') || '').slice(0, 40), vbw: vb.width, scale: +scale.toFixed(3), padL: rects.length ? Math.min(...rects) : null, ticks: ticks.map(t => t.t), overlaps });
      });
      // tiles: detect line breaks inside words in .v and .s
      bay.querySelectorAll('.tile .v, .tile .s').forEach((n) => {
        const txt = n.textContent; if (!txt) return;
        const tn = [...n.childNodes].filter(x => x.nodeType === 3);
        const breaks = [];
        for (const t of tn) {
          const r = document.createRange(); let prevTop = null;
          for (let i = 0; i < t.length; i++) {
            r.setStart(t, i); r.setEnd(t, i + 1);
            const rc = r.getClientRects()[0]; if (!rc) continue;
            if (prevTop !== null && rc.top > prevTop + 2) {
              const before = t.data[i - 1], at = t.data[i];
              if (!/[\s\-]/.test(before) && !/\s/.test(at)) breaks.push(t.data.slice(0, i) + '|' + t.data.slice(i));
            }
            prevTop = rc.top;
          }
        }
        if (breaks.length) out.tiles.push(breaks.join(' ;; '));
      });
      return out;
    });
    const bad = res.charts.filter(c => c.overlaps.length);
    console.log(`${c.w} ${c.tag} bay=${res.bayW} ` + (bad.length ? 'OVERLAP: ' + bad.map(b => b.aria + ' :: ' + b.overlaps.join(' | ') + ` (padL ${b.padL} of ${b.vbw})`).join(' // ') : 'no tick overlap') + (res.charts.some(c=>c.zero) ? '  ZERO-MM-ON-KM-AXIS' : '') + (res.tiles.length ? '  TILE BREAKS: ' + res.tiles.join(' // ') : ''));
    if (process.env.SHOT && c.w === 390 && (c.tag === 'sprint-comic-2.71' || c.tag === 'stomp-20' || c.tag === 'throw-pickup-16')) await page.locator('#bay').screenshot({ path: `${OUT}/P-${c.tag}-${c.w}.png` });
    await ctx.close();
  }
  await browser.close();
})();
