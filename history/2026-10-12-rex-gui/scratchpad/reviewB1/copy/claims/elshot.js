const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const S = __dirname;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const jobs = [
    { name: 'col', scheme: 'light', state: { duoOpen: true, duoAction: 'collide', colMode: 'charge', anchor: 'bolted' }, duoEffort: 'plaster', sel: '#duo-bay' },
    { name: 'catch', scheme: 'dark', state: { duoOpen: true, duoAction: 'catch', cObj: 'person', logKg: 6, cStyle: 'hard' }, duoEffort: 'allout', sel: '#duo-bay' },
    { name: 'throw', scheme: 'dark', state: { action: 'throw', obj: 'baseball', angle: 0, logKg: 9 }, effort: 'windows', sel: '#bay' },
  ];
  for (const j of jobs) {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: j.scheme });
    await p.goto(pathToFileURL(path.join(S, 'page-claims.html')).href);
    await p.evaluate((st) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, j.state);
    await p.reload(); await p.waitForTimeout(800);
    if (j.effort) await p.selectOption('#effort', j.effort);
    if (j.duoEffort) await p.selectOption('#duo-effort', j.duoEffort);
    for (let i = 0; i < 120; i++) { const t = await p.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) break; await p.waitForTimeout(500); }
    // clip: the verdict, chips and effort readout
    const box = await p.evaluate((sel) => { const b = document.querySelector(sel); const v = b.querySelector('.verdict'); const e = b.querySelector('.effort-read'); const r1 = v.getBoundingClientRect(), r2 = e.getBoundingClientRect(); const y0 = Math.min(r1.top, r2.top) + scrollY, y1 = Math.max(r1.bottom, r2.bottom) + scrollY; return { y0, y1 }; }, j.sel);
    await p.screenshot({ path: path.join(S, 'out', 'clip-' + j.name + '.png'), clip: { x: 0, y: box.y0 - 10, width: 390, height: Math.min(1400, box.y1 - box.y0 + 20) }, fullPage: true });
    const ov = await p.evaluate(() => { const out = []; for (const n of document.querySelectorAll('.status-row > *, .effort-read *')) { const r = n.getBoundingClientRect(); if (r.right > innerWidth + 0.5) out.push(n.className + ':' + r.right); } return out; });
    console.log(j.name, 'overflowing els', ov.slice(0, 5));
    await p.close();
  }
  await browser.close();
})();
