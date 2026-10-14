const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/code';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(S + '/pagecmp/branch.html').href);
  for (const air of [0, 0.5]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 3, logKg: 20, airAbsorb: air });
    await page.reload(); await page.waitForTimeout(800);
    await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(500);
    for (let i = 0; i < 200; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!busy) break; await page.waitForTimeout(250); }
    const t = await page.evaluate(() => { const d = document.getElementById('duo-bay'); const v = d.querySelector('.verdict').textContent; const all = d.textContent.replace(/\s+/g, ' '); const m1 = all.match(/by about .{0,20}half its energy has turned to heat/); const m2 = all.match(/half its energy is heat at x = .{0,40}/); return { v, m1: m1 && m1[0], m2: m2 && m2[0] }; });
    const eng = await page.evaluate((air) => { const P = window.DinoPhys, D = window.DINO_DATA, g = 9.80665; const surf = D.surfaces.find((s) => s.id === 'concrete'); const b = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), bo = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 }); const c = { F: 1e20 * g, mode: 'comic', body: b, surface: surf, anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true }; const L = P.catchLeg(c, Object.assign({}, c, { body: bo }), D.objects.find((o) => o.id === 'baseball'), 1000, 'hard'); return { result: L.result, sweep: L.fireball && L.fireball.sweep, sweepK: L.fireball && L.fireball.sweepK, kind: L.fireball && L.fireball.kind }; }, air);
    console.log('air', air, JSON.stringify(t), JSON.stringify(eng));
  }
  await browser.close();
})();
