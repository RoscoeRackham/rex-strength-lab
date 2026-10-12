// Corrupt saved settings for every new key: the page must load cleanly and normalise them
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const URL = pathToFileURL(process.argv[2]).href;
const sets = [
  { action: 'walk', walker: 5, pace: null, stepEffort: 2, walkD: -1, near: 'abc', gThrow: -5, gJump: 1e20, gSprint: 'a', gPull: 0, effortLogKg: 100, duoLogKg: -10, oEffortLogKg: 'a', gentleHold: 'yes', safePassenger: 1, silentStrike: null, softLanding: {}, coolFlight: [], absorb: 'foo', growS: 7, growT: 0, halfLife: 'x', growWhat: 'x', duoEffort: 'ceiling', oEffortOwn: 'true', effort: 'nuke', bogus: 1 },
  { action: 'walk', walkD: 10000, walker: 'both', pace: 'fast' },
  { action: 'walk', walkD: 0.5, walker: 'ollie', pace: 'stroll', surface: 'granite' },
  { action: 'throw', obj: 'person', gThrow: 1e9, near: 1000 },
  { action: 'jump', gJump: 1e9, near: 0.5 },
  { action: 'sprint', gSprint: 3e8 },
  { action: 'pull', gPull: 0.01, obj: 'bus' },
  { action: 'throw', obj: 'liberty', angle: 90, gThrow: 0.1 },
  { group: 'duo', duoAction: 'catch', cObj: 'person' },
  { group: 'duo', duoAction: 'collide', duoLogKg: 34, inf: true },
  { logKg: 1, action: 'throw' },
  { logKg: 1, action: 'jump' },
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of sets) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errs = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    await page.addInitScript((st) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); } }, st);
    await page.goto(URL, { timeout: 120000 });
    await page.waitForTimeout(2500);
    await page.waitForFunction(() => !/Working out the courtesy ceiling/.test(document.body.innerText), null, { timeout: 60000 }).catch(() => errs.push('ceiling never finished'));
    const r = await page.evaluate(() => ({ t: document.body.innerText, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, saved: localStorage.getItem('rex-lab-v1'), verdict: (document.querySelector('.verdict') || {}).innerText }));
    const bad = r.t.match(/.{0,50}(NaN|undefined|(?<![∞\w])Infinity|Calculation failed).{0,40}/g);
    console.log(JSON.stringify(st).slice(0, 90), '=> errors', errs.length ? errs.join(';').slice(0, 200) : 0, '| overflow', r.ov, '| bad', bad ? bad.slice(0, 2).join(' || ') : 0);
    console.log('    verdict:', (r.verdict || '').slice(0, 160));
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
