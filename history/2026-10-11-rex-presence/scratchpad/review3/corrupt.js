// Load the page with corrupt saved settings for every new key; report page errors and what the page saved back.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const url = pathToFileURL(__dirname + '/preview.html').href;
const variants = {
  strings: { effort: 'bogus', effortLogKg: '5', near: 'x', gThrow: -1, gJump: 1e99, gSprint: null, gPull: 0, gentleHold: 'yes', safePassenger: 1, silentStrike: null, softLanding: {}, coolFlight: [], absorb: 'black', growS: 2, growT: -5, halfLife: 0, growWhat: 'moon', walker: 'dog', pace: 'run', stepEffort: 7, walkD: 0, duoEffort: 'ceiling', duoLogKg: 99, oEffortOwn: 'true', oEffortLogKg: -99, action: 'walk', group: 'solo' },
  edges: { near: 0.5, walkD: 10000, gThrow: 1e9, gJump: 0.01, gSprint: 3e8, gPull: 0.01, growT: 1e12, halfLife: 1e-3, effortLogKg: -3, duoLogKg: -3, oEffortLogKg: 34, action: 'throw', obj: 'person', angle: 90 },
  removed: { action: 'walk', oldKey: 5, effortLevel: 3, __proto__x: 1 },
  walkFar: { action: 'walk', walkD: 10000, walker: 'both', pace: 'fast' },
  walkNear: { action: 'walk', walkD: 0.5, walker: 'ollie', surface: 'softclay' },
  duoNear: { group: 'duo', duoAction: 'collide', near: 1000 },
  notJson: '{"effort":',
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, v] of Object.entries(variants)) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    await page.addInitScript((s) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', typeof s === 'string' ? s : JSON.stringify(s)); sessionStorage.setItem('seeded', '1'); } }, v);
    await page.goto(url);
    await page.waitForTimeout(2500);
    // a click to make the page save its state
    await page.evaluate(() => document.querySelector('#mode-comic').click());
    await page.waitForTimeout(500);
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('rex-lab-v1')));
    const keys = typeof v === 'string' ? ['effort'] : Object.keys(v);
    const r = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return { bad: (b.textContent.match(/.{0,50}(NaN|undefined|(?<![∞\w])Infinity).{0,20}/g) || []).slice(0, 3), ov: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    console.log(name, JSON.stringify(Object.fromEntries(keys.map((k) => [k, saved[k]]))), 'errors', JSON.stringify(errs.slice(0, 3)), 'bad', JSON.stringify(r.bad), 'overflow', r.ov);
    await page.close();
  }
  await browser.close();
})();
