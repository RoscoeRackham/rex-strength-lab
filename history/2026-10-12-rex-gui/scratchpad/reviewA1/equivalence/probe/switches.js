// Interaction equivalence: on main pick the footing menus (#anchor, #o-anchor); on the branch click the Bolted
// switches. Same sequence, same tabs; compare the verdict/status/tiles/effort/happens after each step.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const mapMain = require('../intended.js');
const GRAB = (sel) => { const b = document.querySelector(sel); const n = (t) => t.replace(/\s+/g, ' ').trim(); const q = (s) => Array.from(b.querySelectorAll(s)).map((e) => n(e.textContent)); return JSON.stringify({ v: q('.verdict'), s: q('.status-row'), t: q('.tiles'), e: q('.effort-read'), h: q('.happens') }); };
async function settle(page, sel) { let last = null, same = 0; for (let i = 0; i < 400; i++) { const t = await page.evaluate((s) => document.querySelector(s).textContent, sel); if (t && !/working it out|working out/i.test(t) && t === last) { if (++same >= 3) return; } else same = 0; last = t; await page.waitForTimeout(150); } throw new Error('no settle'); }
const STEPS = [['friction', 'friction'], ['bolted', 'friction'], ['bolted', 'bolted'], ['friction', 'bolted'], ['friction', 'friction']];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const res = {};
  for (const v of ['main', 'branch']) {
    res[v] = [];
    for (const [solo, duo, extra] of [['throw', 'wrestle', { logKg: 6, surface: 'ice', obj: 'bus' }], ['pull', 'collide', { logKg: 8, surface: 'sand' }], ['sprint', 'catch', { logKg: 9, cObj: 'car', cStyle: 'hard' }], ['lift', 'arm', { logKg: 5 }]]) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const st = Object.assign({ action: solo, duoAction: duo }, extra, v === 'branch' ? { duoOpen: true } : { group: 'solo' });
      await ctx.addInitScript((s) => { if (!sessionStorage.getItem('s')) { localStorage.setItem('rex-lab-v1', s); sessionStorage.setItem('s', '1'); } }, JSON.stringify(st));
      const page = await ctx.newPage();
      await page.goto('file://' + path.join(__dirname, '..', v + '.html'));
      for (const [a, b] of STEPS) {
        if (v === 'main') {
          await page.evaluate(([a, b]) => { for (const [id, val] of [['#anchor', a], ['#o-anchor', b]]) { const s = document.querySelector(id); if (s.value !== val) { s.value = val; s.dispatchEvent(new Event('change', { bubbles: true })); } } }, [a, b]);
          if (await page.evaluate(() => document.querySelector('#grp-duo').getAttribute('aria-pressed') === 'true')) await page.click('#grp-solo');
          await settle(page, '#bay'); const r1 = await page.evaluate(GRAB, '#bay');
          await page.click('#grp-duo'); await settle(page, '#bay'); const r2 = await page.evaluate(GRAB, '#bay');
          await page.click('#grp-solo');
          res[v].push([solo + ' ' + a + '/' + b, r1], [duo + ' ' + a + '/' + b, r2]);
        } else {
          await page.evaluate(() => { document.getElementById('powers').open = true; });
          await page.setChecked('#bolt-rex', a === 'bolted'); await page.setChecked('#bolt-ollie', b === 'bolted');
          await page.waitForTimeout(400);
          await settle(page, '#bay'); const r1 = await page.evaluate(GRAB, '#bay');
          await settle(page, '#duo-bay'); const r2 = await page.evaluate(GRAB, '#duo-bay');
          res[v].push([solo + ' ' + a + '/' + b, r1], [duo + ' ' + a + '/' + b, r2]);
        }
      }
      await ctx.close();
    }
  }
  let bad = 0;
  res.main.forEach(([k, m], i) => { const [k2, b] = res.branch[i]; const mm = JSON.stringify(JSON.parse(m), (key, val) => (typeof val === 'string' ? mapMain(val) : val)); const same = mm === b; if (!same) bad++; console.log(k, k === k2 ? '' : 'KEY MISMATCH ' + k2, same ? 'same' : 'DIFFERENT\n  M ' + mm.slice(0, 500) + '\n  B ' + b.slice(0, 500)); });
  console.log('steps compared', res.main.length, 'different', bad);
  await browser.close();
})();
