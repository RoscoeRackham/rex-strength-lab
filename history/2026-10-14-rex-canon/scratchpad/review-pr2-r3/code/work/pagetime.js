// time to a settled result, main vs branch, interleaved
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code';
const pages = { main: BASE + '/mainbuild/rex-strength-lab/dist/index.html', branch: BASE + '/repo/rex-strength-lab/dist/index.html' };
const CASES = [
  ['catch default (baseball lob 10 m)', { duoOpen: true, duoAction: 'catch' }],
  ['catch car fastball 1e9 kg', { duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'hard', logKg: 9 }],
  ['catch bus fastball 10 m', { duoOpen: true, duoAction: 'catch', cObj: 'bus', cStyle: 'hard', cLogD: 1 }],
  ['catch semi lob', { duoOpen: true, duoAction: 'catch', cObj: 'semi' }],
  ['partner toss default', { duoOpen: true, duoAction: 'catch', cObj: 'partner' }],
  ['partner toss 1e15 kg', { duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 15 }],
  ['shove default', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove' }],
  ['arm default', { duoOpen: true, duoAction: 'arm' }],
  ['throw default', { action: 'throw' }],
  ['pull default', { action: 'pull' }],
  ['pull bolted', { action: 'pull', anchor: 'bolted' }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const P = {};
  for (const [k, f] of Object.entries(pages)) {
    const prev = path.join(BASE, 'work', 'time-' + k + '.html');
    fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(f, 'utf8') + '</body></html>');
    P[k] = await browser.newPage({ viewport: { width: 1280, height: 900 } }); await P[k].goto(pathToFileURL(prev).href);
  }
  const res = {};
  const REP = Number(process.env.REP || 3);
  for (let rep = 0; rep < REP; rep++) for (const [label, st] of CASES) for (const k of (rep % 2 ? ['branch', 'main'] : ['main', 'branch'])) {
    const pg = P[k], bay = st.duoOpen ? 'duo-bay' : 'bay';
    await pg.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    const t0 = Date.now();
    await pg.reload();
    for (;;) { const busy = await pg.evaluate((id) => { const b = document.getElementById(id); return !b || !b.textContent || /working it out|Working out/i.test(b.textContent); }, bay); if (!busy) break; await pg.waitForTimeout(50); }
    const ms = Date.now() - t0;
    (res[label] = res[label] || { main: [], branch: [] })[k].push(ms);
  }
  const med = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  for (const [label, r] of Object.entries(res)) console.log(label.padEnd(36), 'main', med(r.main), 'ms  branch', med(r.branch), 'ms  (all main ' + r.main.join(',') + ' / branch ' + r.branch.join(',') + ')');
  await browser.close();
})();
