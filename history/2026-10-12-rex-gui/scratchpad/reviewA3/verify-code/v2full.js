const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const S = __dirname;
const EDITS = [
  [/^(Pushing straight across: )(rex|ollie)\b/, (m, a, b) => a + b.charAt(0).toUpperCase() + b.slice(1)],
  [/ \(plus a little claw or boot bite if dug in\): /g, ', and none at all if he is bolted (the sim keeps a bolted wrestler planted: he holds but doesn’t walk the other out) or too heavy to walk: '],
  [/A heavier body, or one dug in, wins\./g, 'A heavier body wins.'],
  [/footing = μ m g \(\+ shear × buried area if dug in; unlimited if bolted\)\./g, 'footing = μ m g (unlimited if bolted).'],
  [/Drive = min\(strength, μ m g \+ ¼ shear × buried area if dug in\);/g, 'Drive = min(strength, μ m g);'],
];
const edit = (t) => EDITS.reduce((x, [re, to]) => x.replace(re, to), t);
const editAll = (r) => { const o = {}; for (const [k, v] of Object.entries(r)) o[k] = Array.isArray(v) ? v.map((x) => x && edit(x)) : v && edit(v); return JSON.stringify(o); };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const get = async (name, st, bay) => { const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage();
    await page.goto(pathToFileURL(path.join(S, name + '.wrapped.html')).href);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(1200); await settle(page, bay);
    const r = await readResult(page, bay); await ctx.close(); return r; };
  const was = editAll(await get('main', { angle: 30, wrestleMove: 'throw', group: 'duo', duoAction: 'wrestle' }, 'bay'));
  for (const name of ['base', 'mutB_nowangle']) {
    const r = await get(name, { angle: 30, wrestleMove: 'throw', duoOpen: true, duoAction: 'wrestle' }, 'duo-bay');
    const now = JSON.stringify(Object.fromEntries(Object.keys(JSON.parse(was)).map((k) => [k, r[k]])));
    console.log(name, was === now ? 'SAME as main' : 'DIFFERS from main:\n  main ' + was.slice(0, 300) + '\n  now  ' + now.slice(0, 300));
  }
  await browser.close();
})();
