const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = process.env.URL || 'file:///home/user/dino-strength-sim/dist/preview.html';
const W = Number(process.argv[2] || 390);
const useProxy = process.argv[3] !== 'noproxy';
const g = 9.80665;
(async () => {
  const opts = { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' };
  if (useProxy && process.env.HTTPS_PROXY) opts.proxy = { server: process.env.HTTPS_PROXY };
  const browser = await chromium.launch(opts);
  const ctx = await browser.newContext({ viewport: { width: W, height: 844 }, colorScheme: 'dark', ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  const states = [];
  const objs = ['baseball','car','titanic','nimitz','loco','b777','semi'];
  for (const action of ['lift','throw','jump','stomp','punch','clap','sprint','pull'])
    for (const [mode, logKg, inf] of [['comic', 2.708, false], ['comic', 4.958, false], ['comic', 9, false], ['comic', 15, false], ['comic', 20, false], ['comic', 24, false], ['comic', 30, false], ['comic', 30, true], ['real', 4.958, false], ['real', 9, false]])
      for (const obj of (action === 'throw' || action === 'pull' || action === 'lift') ? objs : ['car'])
        states.push({ action, mode, logKg, inf, obj });
  await page.goto(prev);
  await page.waitForTimeout(1500);
  const fontOk = await page.evaluate(() => document.fonts.check('11px "IBM Plex Mono"'));
  console.log('W', W, 'IBM Plex Mono loaded:', fontOk);
  const issues = {};
  const add = (k, v) => { (issues[k] = issues[k] || []).push(v); };
  for (const s of states) {
    await page.evaluate((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, angle: 45 }, st))); }, s);
    await page.reload();
    await page.waitForTimeout(250);
    const res = await page.evaluate(() => {
      const out = [];
      document.querySelectorAll('#bay .viz svg').forEach((svg, si) => {
        const vb = svg.viewBox.baseVal; const title = svg.getAttribute('aria-label');
        const texts = [...svg.querySelectorAll('text')].map((t) => { const b = t.getBBox(); return { s: t.textContent, x0: b.x, x1: b.x + b.width, y0: b.y, y1: b.y + b.height }; });
        for (const t of texts) if (t.x0 < -0.5 || t.x1 > vb.width + 0.5) out.push({ kind: 'clip', chart: title, text: t.s, x0: +t.x0.toFixed(1), x1: +t.x1.toFixed(1), vbw: vb.width });
        for (let i = 0; i < texts.length; i++) for (let j = i + 1; j < texts.length; j++) {
          const a = texts[i], b = texts[j];
          const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
          if (ox > 1 && oy > 2) out.push({ kind: 'overlap', chart: title, a: a.s, b: b.s, ox: +ox.toFixed(1) });
        }
        // bar area width for logBars
        const rects = [...svg.querySelectorAll('rect')];
        if (title && /Blast/.test(title)) {
          const lines = [...svg.querySelectorAll('line.axis')].map((l) => +l.getAttribute('x1'));
          out.push({ kind: 'blastinfo', chart: title, axisFrom: Math.min(...lines), axisTo: Math.max(...lines), bars: rects.map((r) => +(+r.getAttribute('width')).toFixed(1)), ticks: texts.filter(t => t.y0 > vb.height - 20).map(t => t.s), labels: [...svg.querySelectorAll('text.lbl-strong')].map(t=>t.textContent) });
        }
      });
      // tiles mid-word break
      document.querySelectorAll('#bay .tile .v, #bay .tile .s').forEach((v) => {
        const tn = []; const walk = (n) => { if (n.nodeType === 3) tn.push(n); else n.childNodes.forEach(walk); }; walk(v);
        let prevTop = null, prevCh = null;
        for (const n of tn) for (let i = 0; i < n.length; i++) {
          const r = document.createRange(); r.setStart(n, i); r.setEnd(n, i + 1);
          const rc = r.getClientRects()[0]; if (!rc) continue;
          const ch = n.data[i];
          if (prevTop != null && rc.top > prevTop + 4 && !/\s/.test(ch) && prevCh && !/[\s\-–—]/.test(prevCh)) out.push({ kind: 'midbreak', cls: v.className, text: v.textContent, at: i, before: prevCh, after: ch });
          if (!/\s/.test(ch)) { prevTop = rc.top; } prevCh = ch;
        }
      });
      return out;
    });
    const key = JSON.stringify(s);
    for (const r of res) add(r.kind, Object.assign({ state: key }, r));
  }
  for (const [k, arr] of Object.entries(issues)) {
    console.log('\n=== ' + k + ' (' + arr.length + ')');
    const seen = new Set();
    for (const r of arr) { const { state, ...rest } = r; const sig = JSON.stringify(rest) + (process.env.ALL ? state : ""); if (seen.has(sig)) continue; seen.add(sig); console.log(state, JSON.stringify(rest)); }
  }
  console.log('errors', errs.slice(0, 5));
  await browser.close();
})();
