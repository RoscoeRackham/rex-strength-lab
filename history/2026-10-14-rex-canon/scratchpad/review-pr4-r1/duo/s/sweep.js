const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const D = __dirname;
const pg = process.argv[2] || 'pr35';
const TESTS = [['arm', { duoAction: 'arm' }], ['armK', { duoAction: 'arm', keepForm: false }], ['push', { duoAction: 'wrestle', wrestleMove: 'push' }], ['shove', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex' }],
  ['both', { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }], ['throw', { duoAction: 'wrestle', wrestleMove: 'throw' }], ['lift', { duoAction: 'wrestle', wrestleMove: 'lift' }],
  ['catch', { duoAction: 'catch' }], ['toss', { duoAction: 'catch', cObj: 'partner' }], ['charge', { duoAction: 'collide' }], ['bounce', { duoAction: 'collide', colBounce: 'bounce' }], ['jump', { duoAction: 'collide', colSrc: 'jump' }], ['cpush', { duoAction: 'collide', colMode: 'push' }]];
const PW = [['on', {}], ['off', { ownRecoil: false }]];
const ANC = [['ff', {}], ['bf', { anchor: 'bolted' }], ['fb', { oAnchor: 'bolted' }], ['bb', { anchor: 'bolted', oAnchor: 'bolted' }]];
const STR = [['least', {}], ['allout', { duoEffort: 'allout' }], ['1e9', { logKg: 9, duoEffort: 'allout' }], ['inf', { inf: true, duoEffort: 'allout' }]];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  let errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(D + '/' + pg + '.html').href);
  const out = {};
  const only = process.argv[3] ? process.argv[3].split(',') : null;
  for (const [tn, ts] of TESTS) { if (only && !only.includes(tn)) continue; for (const [pn, ps] of PW) for (const [an, as] of ANC) for (const [sn, ss] of STR) {
    const st = Object.assign({ duoOpen: true }, ts, ps, as, ss);
    errs = [];
    await page.evaluate((x) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(x)); }, st);
    await page.reload();
    const settleP = () => page.evaluate(() => new Promise((resolve) => { const t0 = performance.now(); const poll = () => { const b = document.getElementById('duo-bay'); const busy = !b || !b.querySelector('.verdict, .callout') || /working it out|Working out/i.test(b.textContent); if (!busy || performance.now() - t0 > 30000) resolve(); else setTimeout(poll, 30); }; poll(); }));
    await settleP();
    if (st.duoEffort && st.duoEffort !== 'least') { if (await page.$('#duo-effort')) { await page.selectOption('#duo-effort', st.duoEffort); await page.waitForTimeout(200); await settleP(); } }
    const r = await page.evaluate(() => { const bay = document.getElementById('duo-bay'); const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null); const all = (s) => Array.from(bay.querySelectorAll(s)).map(txt);
      return { verdict: txt(bay.querySelector('.verdict')), callout: all('.callout'), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), whole: bay.textContent }; });
    const bad = (r.whole.match(/NaN|undefined|(?<![∞\w])Infinity|null/g) || []);
    const key = [tn, pn, an, sn].join('|');
    out[key] = { verdict: r.verdict, callout: r.callout, status: r.status, tiles: r.tiles, effort: r.effort, happens: r.happens, bad, errs };
    if (bad.length || errs.length) console.log('BAD', key, bad.slice(0, 5), errs.slice(0, 2));
  } }
  fs.writeFileSync(D + '/sweep-' + pg + (only ? '-' + only.join('_') : '') + '.json', JSON.stringify(out, null, 1));
  console.log('done', Object.keys(out).length);
  await browser.close();
})();
