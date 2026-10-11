// Sweep solo and duo tabs over strength, density, ground and anchoring; flag broken text and errors.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const V = 2.547, bad = [], slow = [];
  let n = 0;
  const rhos = [30, 1000, 22587, 2.77e9, 4.12e17, 1e22, 1.4e27];
  const solo = ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const duo = [['arm', {}], ['wrestle', { wrestleMove: 'push' }], ['wrestle', { wrestleMove: 'shove', wrestleWho: 'both' }], ['wrestle', { wrestleMove: 'lift', wrestleWho: 'ollie' }], ['wrestle', { wrestleMove: 'throw' }],
    ['catch', { cObj: 'baseball', cLogD: 1 }], ['catch', { cObj: 'car', cLogD: 2, cStyle: 'hard', cMiss: true }], ['catch', { cObj: 'tank', cLogD: 6 }], ['catch', { cObj: 'partner', cLogD: 2 }], ['catch', { cObj: 'baseball', cLogD: 1, cStyle: 'hard' }], ['catch', { cObj: 'pyramid', cLogD: 7.3 }], ['catch', { cObj: 'shot', cLogD: 2, cStyle: 'hard' }], ['catch', { cObj: 'bus', cLogD: 1 }],
    ['collide', {}], ['collide', { colSrc: 'jump' }], ['collide', { colSrc: 'stomp' }], ['collide', { colSrc: 'set', colGB: 0.5 }], ['collide', { colSrc: 'set', colInf: true, colImm: true }], ['collide', { colMode: 'push' }]];
  for (const mode of ['comic', 'real']) for (const lk of [2, 4.96, 12, 'inf']) for (const rho of rhos) for (const [surface, groundHolds, anchor] of [['concrete', false, 'friction'], ['sand', true, 'bolted'], ['granite', false, 'braced']]) {
    const base = { logKg: lk === 'inf' ? 34 : lk, inf: lk === 'inf', mode, surface, groundHolds, anchor, m: rho * V, oM: (n % 2 ? rho : 1000) * V, oAnchor: ['friction', 'braced', 'bolted'][n % 3] };
    const tabs = (n % 3 === 0) ? solo.map((a) => ['solo', a, {}]) : duo.map(([a, o]) => ['duo', a, o]);
    for (const [group, act, extra] of tabs) {
      const st = Object.assign({}, base, extra, group === 'solo' ? { group, action: act } : { group, duoAction: act });
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
      const t0 = Date.now();
      await page.reload(); await page.waitForTimeout(30);
      const t = await page.evaluate(() => document.querySelector('#bay').innerText + '\n' + [...document.querySelectorAll('#bay svg text')].map((x) => x.textContent).join(' '));
      const dt = Date.now() - t0;
      if (dt > 2500) slow.push(dt + 'ms ' + JSON.stringify(st));
      const m = t.match(/NaN|undefined|\bnull\b|\[object|Infinity|Calculation failed/);
      if (m) bad.push(JSON.stringify(st) + ' -> ' + m[0] + ' … ' + t.slice(Math.max(0, m.index - 100), m.index + 60).replace(/\n/g, ' | '));
      n++;
    }
  }
  console.log('states', n, 'bad', bad.length, 'slow', slow.length);
  bad.slice(0, 25).forEach((b) => console.log('  ' + b));
  slow.slice(0, 5).forEach((b) => console.log('  SLOW ' + b));
  console.log('errors', errs.slice(0, 8));
  await browser.close();
})();
