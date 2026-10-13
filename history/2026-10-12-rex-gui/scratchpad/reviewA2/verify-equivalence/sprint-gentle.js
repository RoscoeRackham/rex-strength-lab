// Reproduce: bolted Sprint at an effort below his own weight (engine returns tooGentle)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const S = __dirname;
const pages = { branch: path.join(S, 'branch/dist/index.html'), main: path.join(S, 'main/index.html') };
function wrap(src, out) {
  const html = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return 'file://' + out;
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { anchor: 'bolted', logKg: Math.log10(100 * 907.18474) },
    { anchor: 'bolted', logKg: 9 },
    { anchor: 'friction', logKg: 9 },
  ];
  for (const [name, src] of Object.entries(pages)) {
    const url = wrap(src, path.join(S, 'wrapped-' + name + '.html'));
    for (const cs of cases) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      await page.addInitScript((st) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); } catch (e) {} }, { action: 'sprint', anchor: cs.anchor, logKg: cs.logKg });
      await page.goto(url);
      await page.waitForSelector('#bay .verdict');
      await page.selectOption('#effort', 'custom');
      await page.waitForTimeout(300);
      // open the Adjust effort box and set the slider to its minimum
      await page.evaluate(() => { const d = document.querySelector('#bay details.effort-adjust'); if (d) d.open = true; });
      await page.evaluate(() => { const s = document.querySelector('#effort-use'); s.value = s.min; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); });
      await page.waitForTimeout(800);
      const out = await page.evaluate(() => {
        const b = document.querySelector('#bay');
        const q = (s) => [...b.querySelectorAll(s)].map((e) => e.textContent.trim());
        const s = document.querySelector('#effort-use');
        return {
          slider: s.getAttribute('aria-valuetext'),
          verdict: q('.verdict'),
          chips: q('.status-row .status, .status-row > *').slice(0, 4),
          tiles: q('.tile').slice(0, 2),
          happens: q('ul.happens li'),
          math: q('details.math .eq'),
          effortBox: q('.effort-box, .effort-readout').slice(0, 2),
        };
      });
      console.log('=== ' + name + ' ' + JSON.stringify(cs));
      console.log(JSON.stringify(out, null, 1));
      if (errs.length) console.log('ERRORS', errs);
      await ctx.close();
    }
  }
  // engine check directly
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(S, 'wrapped-branch.html'));
    const r = await page.evaluate(() => {
      const P = window.DinoPhys, D = window.DINO_DATA;
      const body = P.makeBody({ H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m, build: 'rex' });
      const surface = D.surfaces.find((s) => s.id === 'concrete');
      return Object.keys(P).filter((k) => /sprint/i.test(k));
    });
    console.log('engine keys', r);
    await ctx.close();
  }
  await browser.close();
})();
