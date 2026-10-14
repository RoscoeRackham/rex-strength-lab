// Compare solo and duo tab results between main's page and the branch's page with the four powers off.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const MAINOLD = { groundHolds: false, gentleHold: false, coolFlight: false };
const which = process.argv[2] || 'solo';
const read = (id) => {
  const bay = document.getElementById(id);
  const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null);
  const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
  return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq') };
};
async function settle(page, id) { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test(document.getElementById(x).textContent), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [];
  if (which === 'solo') {
    const tabs = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
    for (const tab of tabs) for (const extra of [{}, { logKg: 9, surface: 'sand' }, { surface: 'ice', logKg: 5 }, { logKg: 12, anchor: 'bolted' }]) for (const eff of ['least', 'allout', 'plaster'])
      cases.push({ id: tab + JSON.stringify(extra) + eff, st: Object.assign({ action: tab }, extra), eff, bay: 'bay' });
    for (const obj of ['baseball', 'person', 'allstar']) for (const extra of [{}, { logKg: 14, angle: 0 }]) for (const eff of ['least', 'allout'])
      cases.push({ id: 'throw-' + obj + JSON.stringify(extra) + eff, st: Object.assign({ action: 'throw', obj }, extra), eff, bay: 'bay' });
  } else {
    for (const tab of ['arm', 'wrestle', 'catch', 'collide']) for (const extra of [{}, { logKg: 6 }, { logKg: 9, surface: 'sand' }, { mode: 'real', logKg: 7 }]) {
      const subs = tab === 'wrestle' ? [{ wrestleMove: 'push' }, { wrestleMove: 'shove' }, { wrestleMove: 'lift' }, { wrestleMove: 'throw' }] : tab === 'catch' ? [{ cObj: 'baseball', cStyle: 'easy' }, { cObj: 'car', cStyle: 'hard' }, { cObj: 'partner' }, { cObj: 'baseball', cStyle: 'hard', cLogD: 3 }] : tab === 'collide' ? [{ colSrc: 'sprint' }, { colSrc: 'jump' }, { colMode: 'push' }, { colSrc: 'set', colGB: -2 }] : [{}];
      for (const s of subs) for (const eff of ['least', 'allout']) cases.push({ id: tab + JSON.stringify(extra) + JSON.stringify(s) + eff, st: Object.assign({ duoOpen: true, duoAction: tab }, extra, s), eff, bay: 'duo-bay' });
    }
  }
  const out = { main: {}, branch: {} };
  for (const [name, file, add] of [['main', 'pages/main.html', MAINOLD], ['branch', 'pages/branch.html', OFF]]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(pathToFileURL(file).href);
    for (const c of cases) {
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({}, c.st, add));
      await page.reload(); await page.waitForTimeout(300);
      await settle(page, c.bay);
      if (c.eff !== 'least') { const sel = c.bay === 'bay' ? '#effort' : '#duo-effort'; const has = await page.$(sel); if (has) { const opts = await page.$$eval(sel + ' option', (os) => os.map((o) => o.value)); if (opts.includes(c.eff)) { await page.selectOption(sel, c.eff); await page.waitForTimeout(300); await settle(page, c.bay); } else { out[name][c.id] = 'NOOPT'; continue; } } else { out[name][c.id] = 'NOSEL'; continue; } }
      out[name][c.id] = await page.evaluate(read, c.bay);
    }
    if (errs.length) console.log(name, 'errors', errs.slice(0, 3));
    await page.close();
  }
  fs.writeFileSync('pagecmp-' + which + '.json', JSON.stringify(out));
  let diff = 0;
  for (const c of cases) { const a = JSON.stringify(out.main[c.id]), b = JSON.stringify(out.branch[c.id]); if (a !== b) diff++; }
  console.log(cases.length, 'cases', diff, 'differ');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
