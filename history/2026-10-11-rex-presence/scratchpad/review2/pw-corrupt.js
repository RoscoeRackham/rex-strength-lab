const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const PREV = '/home/user/rex-strength-lab/rex-strength-lab/dist/preview.html';
const STATES = [
  ['wrong types', { near: '5', walkD: -1, growT: 0, halfLife: 'x', growS: 2, stepEffort: 5, gThrow: 0, gJump: -3, gSprint: 'fast', gPull: null, duoLogKg: 99, effortLogKg: null, walker: 'x', pace: 7, absorb: 'runaway', growWhat: 'sun', effort: 'block', duoEffort: 'custom', oEffortOwn: 'yes', oEffortLogKg: -10, gentleHold: 1, coolFlight: 'true', junkKey: 5 }],
  ['edges low', { near: 0.5, walkD: 0.5, gThrow: 0.1, gJump: 0.01, gSprint: 0.1, gPull: 0.01, growT: 1e-3, halfLife: 1e-3, growS: 0, logKg: 1, effortLogKg: -3, duoLogKg: -3, oEffortLogKg: -3, gentleHold: true, safePassenger: true, silentStrike: true, softLanding: true, coolFlight: true }],
  ['edges high', { near: 1000, walkD: 10000, gThrow: 1e9, gJump: 1e9, gSprint: 3e8, gPull: 1e9, growT: 1e12, halfLife: 1e12, growS: 1, inf: true, effortLogKg: 34, duoLogKg: 34, oEffortLogKg: 34 }],
  ['not an object', [1, 2, 3]],
  ['string', '"hello"'],
  ['bad json', '{near: 5'],
];
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st] of STATES) {
    const page = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((s) => localStorage.setItem('rex-lab-v1', typeof s === 'string' ? s : JSON.stringify(s)), st);
    await page.goto(pathToFileURL(PREV).href);
    await page.waitForTimeout(1500);
    const probs = [];
    for (const tab of ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight', 'arm', 'wrestle', 'catch', 'collide']) {
      const duo = ['arm', 'wrestle', 'catch', 'collide'].includes(tab);
      await page.click(duo ? '#grp-duo' : '#grp-solo'); await page.click('#tab-' + tab);
      await page.waitForTimeout(duo ? 1200 : 700);
      const r = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script,style').forEach((x) => x.remove()); return { all: c.textContent, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
      const bb = bad(r.all);
      if (bb.length || r.ov > 0) probs.push(tab + ': ' + bb.slice(0, 3).join(',') + (r.ov > 0 ? ' overflow ' + r.ov : ''));
    }
    const saved = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
    console.log(name, '| problems', JSON.stringify(probs), '| errors', JSON.stringify(errs.slice(0, 3)), '| saved has junkKey:', /junkKey/.test(saved || ''));
    await page.close();
  }
  await b.close();
})();
