const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/home/user/dino-strength-sim/src/';
let html = fs.readFileSync(S + 'app.html', 'utf8');
html = html.replace('/*__ENGINE__*/', () => fs.readFileSync(S + 'engine.js', 'utf8')).replace('/*__DATA__*/', () => fs.readFileSync(S + 'data.js', 'utf8')).replace('__DINO_IMG__', '');
const wrapped = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>';
const out = path.join(__dirname, 'f1_page.html');
fs.writeFileSync(out, wrapped);
const cases = [
  { name: 'tank30', st: { logKg: 16.86, mode: 'comic', action: 'throw', obj: 'tank', angle: 30 } },
  { name: 'shot45', st: { logKg: 13.15, mode: 'comic', action: 'throw', obj: 'shot', angle: 45 } },
  { name: 'tank0_ghostcap', st: { logKg: 14.67, mode: 'comic', action: 'throw', obj: 'tank', angle: 0 } },
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }).catch(() => chromium.launch());
  for (const c of cases) {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    await page.addInitScript((st) => { localStorage.setItem('dino-lab-v1', JSON.stringify(Object.assign({ inf: false, surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180 }, st))); }, c.st);
    const t0 = Date.now();
    await page.goto('file://' + out);
    await page.waitForTimeout(500);
    const txt = await page.evaluate(() => {
      const p = document.querySelector('main.panel') || document.body;
      const v = p.querySelector('.verdict');
      const tiles = [...p.querySelectorAll('.tile')].map(t => [...t.children].map(x => x.textContent).join(' | '));
      const li = [...p.querySelectorAll('.happens li')].map(x => x.textContent);
      return { verdict: v && v.textContent, tiles, li };
    });
    // time a re-render via slider input to measure cost
    const ms = await page.evaluate(() => { const s = document.querySelector('#strength'); const t = performance.now(); s.value = String(Number(s.value)); s.dispatchEvent(new Event('input')); return performance.now() - t; });
    console.log('=== ' + c.name, JSON.stringify(c.st));
    console.log('verdict:', txt.verdict);
    txt.tiles.forEach(t => console.log('  tile:', t));
    txt.li.forEach(t => console.log('  item:', t));
    console.log('  rerender ms:', ms.toFixed(0), 'errors:', errs);
    await ctx.close();
  }
  await browser.close();
})();
