const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const OUT = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/ylab/';
const cases = [
  ['loco', 18.7, 70], ['titanic', 20.7, 30], ['tank', 15.2, 89], ['car', 10, 45], ['baseball', 6, 45],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [1280, 390]) {
    for (const [obj, logKg, angle] of cases) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit3/ylab/patched.html');
      await page.evaluate(([obj, logKg, angle]) => {
        const s = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}');
        Object.assign(s, { logKg, inf: false, action: 'throw', obj, angle });
        localStorage.setItem('rex-lab-v1', JSON.stringify(s));
      }, [obj, logKg, angle]);
      await page.reload();
      await page.waitForTimeout(1500);
      const res = await page.evaluate(() => {
        const out = [];
        for (const svg of document.querySelectorAll('#bay .viz svg')) {
          const r = svg.getBoundingClientRect();
          const vb = svg.viewBox.baseVal;
          const scale = r.width / vb.width;
          for (const t of svg.querySelectorAll('text')) {
            if (t.getAttribute('text-anchor') !== 'end') continue;
            const bb = t.getBBox();
            out.push({ text: t.textContent, x: +t.getAttribute('x'), left: +bb.x.toFixed(1), width: +bb.width.toFixed(1), clipped: bb.x < 0, vbw: vb.width, scale: +scale.toFixed(3), font: getComputedStyle(t).fontFamily.slice(0,30) });
          }
        }
        return out;
      });
      console.log(w, obj, logKg, angle, JSON.stringify(res.filter(r => r.x < 70)));
      const viz = await page.$$('#bay .viz');
      for (let i = 0; i < viz.length; i++) {
        const has = await viz[i].evaluate(v => !!v.querySelector('path[stroke="var(--accent)"]'));
        if (has) await viz[i].screenshot({ path: OUT + `fixed-${w}-${obj}-${logKg}-${angle}.png` });
      }
      await ctx.close();
    }
  }
  await browser.close();
})();
