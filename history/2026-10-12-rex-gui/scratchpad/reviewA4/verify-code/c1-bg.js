// code-1: the effort a background two-player search settles on, branch vs mutant A, with and without slowed calls
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const V = __dirname;
const DUO_FNS = ['armWrestle', 'pushMatch', 'shove', 'shoveBoth', 'liftPartner', 'throwPartner', 'catchGame', 'catchLeg', 'tossPartner', 'catchIt', 'collide', 'headOn', 'standoff'];
const countDuoCalls = ({ names, delay }) => {
  window.__duoCalls = 0; let v;
  Object.defineProperty(window, 'DinoPhys', { configurable: true, get: () => v, set: (x) => {
    for (const k of names) { const f = x[k]; if (typeof f === 'function') x[k] = function () { window.__duoCalls++; if (delay) { const t = performance.now(); while (performance.now() - t < delay) {} } return f.apply(this, arguments); }; }
    v = x; } });
};
const ALL = {
  arm: { duoOpen: true, duoAction: 'arm' },
  collide: { duoOpen: true, duoAction: 'collide', colMode: 'charge' },
  shoveBoth: { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' },
};
const STATES = process.env.ONLY ? { [process.env.ONLY]: ALL[process.env.ONLY] } : ALL;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pages = process.argv.slice(2).length ? process.argv.slice(2) : ['base', 'A'];
  for (const [sname, st] of Object.entries(STATES)) {
    for (const name of pages) {
      for (const delay of (process.env.DELAYS || '0,40').split(',').map(Number)) {
        const pg = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        const errs = []; pg.on('pageerror', (e) => errs.push(e.message));
        await pg.addInitScript(countDuoCalls, { names: DUO_FNS, delay });
        await pg.addInitScript(() => { window.__sawWorking = false; const iv = setInterval(() => { const b = document.getElementById('duo-bay'); if (b && /working it out/i.test(b.textContent)) { window.__sawWorking = true; clearInterval(iv); } }, 5); });
        await pg.goto(pathToFileURL(V + '/pages/' + name + '.html').href);
        await pg.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
        await pg.reload();
        const t0 = Date.now();
        await pg.waitForFunction(() => { const b = document.getElementById('duo-bay'); return b && /Effort: [\d.]+%|All-out|Effort:/.test(b.textContent) && !/working it out/i.test(b.textContent); }, null, { timeout: 60000 }).catch(() => {});
        await pg.waitForTimeout(500);
        const r = await pg.evaluate(() => { const b = document.getElementById('duo-bay'); const e = b.querySelector('.effort-read'), v = b.querySelector('.verdict'); return { saw: window.__sawWorking, effort: e ? e.textContent.slice(0, 90) : null, verdict: v ? v.textContent.slice(0, 110) : null }; });
        console.log(sname.padEnd(10), name.padEnd(5), 'delay', String(delay).padEnd(3), 'bg=' + r.saw, '|', r.effort, '|', r.verdict, errs.length ? 'ERRS ' + errs : '', '(' + (Date.now() - t0) + ' ms)');
        await pg.close();
      }
    }
  }
  await browser.close();
})();
