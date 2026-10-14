// Every Rex tab reads the same with the Rex + Ollie element closed, open, and open with its search running in the
// background (two-player calls slowed so the search outlasts the render budget), plus the strength ladder.
const { chromium, CHROME, wrap, settle, readResult, S } = require('./h.js');
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const slow = ({ names, delay }) => {
  let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { const t = performance.now(); while (performance.now() - t < delay) {} return f.apply(this, arguments); }; }
    v = x;
  } });
};
const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const url = wrap(S + '/work/rex-strength-lab/dist/index.html', 'solo-open.html');
  const out = {};
  for (const [label, delay, extra] of [['closed', 0, {}], ['open', 0, { duoOpen: true, duoAction: 'collide' }], ['open-busy', 50, { duoOpen: true, duoAction: 'arm' }]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    if (delay) await page.addInitScript(slow, { names: DUO_FNS, delay });
    await page.goto(url);
    out[label] = {};
    for (const st of [{}, { anchor: 'bolted', surface: 'sand' }, { walker: 'both', oH: 6 }]) {
      for (const tab of SOLO) {
        await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ action: tab }, st, extra));
        await page.reload(); await page.waitForTimeout(300);
        // while the two-player search is busy, redraw Rex's bay by clicking away and back
        await page.click('#tab-weight'); await page.click('#tab-' + tab); await page.waitForTimeout(200);
        await settle(page, 'bay');
        const busy = extra.duoOpen ? await page.evaluate(() => /working it out/i.test(document.getElementById('duo-bay').textContent)) : null;
        const r = await readResult(page, 'bay');
        r.ladder = await page.evaluate(() => document.getElementById('ladder-viz').textContent.replace(/\s+/g, ' ').slice(0, 4000));
        out[label][JSON.stringify(st) + tab] = { r, busy };
      }
    }
    await page.close();
  }
  await browser.close();
  let diffs = 0, busyN = 0;
  for (const k of Object.keys(out.closed)) for (const l of ['open', 'open-busy']) {
    if (out[l][k].busy) busyN++;
    if (JSON.stringify(out[l][k].r) !== JSON.stringify(out.closed[k].r)) { diffs++; console.log('DIFF ' + l + ' ' + k + '\n closed ' + JSON.stringify(out.closed[k].r).slice(0, 600) + '\n ' + l + ' ' + JSON.stringify(out[l][k].r).slice(0, 600)); }
  }
  console.log('cases ' + Object.keys(out.closed).length + ', diffs ' + diffs + ', read while the two-player search was busy: ' + busyN);
})().catch((e) => { console.error(e); process.exit(1); });
