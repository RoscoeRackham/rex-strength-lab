const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync(path.join(__dirname, 'lab/dist/index.html'), 'utf8');
const file = path.join(__dirname, 'wrapped.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const cases0 = [
  ['jump-ice-inf', { action: 'jump', surface: 'ice', inf: true }, 'allout'],
  ['jump-steel-inf', { action: 'jump', surface: 'steel', inf: true }, 'allout'],
  ['jump-concrete-inf', { action: 'jump', surface: 'concrete', inf: true }, 'allout'],
  ['thr-pyr-ice', { action: 'throw', obj: 'pyramid', angle: 90, logKg: 18.5, airAbsorb: 0.5, surface: 'ice' }, 'allout'],
  ['thr-pyr-steel', { action: 'throw', obj: 'pyramid', angle: 90, logKg: 18.5, airAbsorb: 0.5, surface: 'steel' }, 'allout'],
  ['thr-pyr-concrete', { action: 'throw', obj: 'pyramid', angle: 90, logKg: 18.5, airAbsorb: 0.5, surface: 'concrete' }, 'allout'],
  ['weight-instant-ice', { action: 'weight', surface: 'ice' }, null, 'grow'],
  ['weight-instant-steel', { action: 'weight', surface: 'steel' }, null, 'grow'],
  ['weight-instant-concrete', { action: 'weight', surface: 'concrete' }, null, 'grow'],
  ['stomp-ice-inf', { action: 'stomp', surface: 'ice', inf: true }, 'allout'],
];
const cases = cases0.filter((c) => !only || only.test(c[0]));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st, eff, grow] of cases) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto('file://' + file);
    await p.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
    await p.reload();
    await p.waitForTimeout(500);
    if (grow) {
      await p.evaluate(() => { const e = document.querySelector('#absorb'); e.value = 'instant'; e.dispatchEvent(new Event('change')); });
      await p.waitForTimeout(300);
      await p.click('#grow-what-chicxulub');
    }
    if (eff) { await p.selectOption('#effort', eff); }
    await p.waitForFunction(() => !/working it out/i.test(document.body.innerText), null, { timeout: 120000 });
    await p.waitForTimeout(300);
    const items = await p.evaluate(() => [...document.querySelectorAll('li, p')].map((e) => e.innerText).filter((t) => /ground-wave model for|Nothing of it reaches|none of that push|takes none of it/.test(t)));
    const chips = await p.evaluate(() => [...document.querySelectorAll('.status, [class*=status]')].map((e) => e.innerText).filter((t) => /Ground shaking|shakes the ground|barely shakes/.test(t)));
    console.log('=== ' + name + (errs.length ? ' ERR ' + errs.join(' | ') : ''));
    for (const t of new Set(items)) console.log('  * ' + t);
    for (const t of new Set(chips)) console.log('  [chip] ' + t);
    await ctx.close();
  }
  await b.close();
})();
