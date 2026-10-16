// node scan.js <dist html> : NaN/undefined/bare Infinity in the page text, page errors and slow settles, at unlimited
// strength and a 1e20 kg dial, on every tab (and the two-player sub-tests), with the defaults, both Bolted, and the power off
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const REPO = path.join(__dirname, 'repo/rex-strength-lab');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require(path.join(REPO, 'test/make-page-fixture.js'));
(async () => {
  const file = process.argv[2];
  const prev = path.join(__dirname, 'pages', 'scan-' + path.basename(file) + '.html');
  fs.mkdirSync(path.dirname(prev), { recursive: true });
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(file, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const DUO = [{ duoAction: 'arm' }, { duoAction: 'wrestle', wrestleMove: 'push' }, { duoAction: 'wrestle', wrestleMove: 'shove' }, { duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'both' }, { duoAction: 'wrestle', wrestleMove: 'throw' }, { duoAction: 'wrestle', wrestleMove: 'lift' },
    { duoAction: 'catch', cObj: 'baseball', cStyle: 'hard' }, { duoAction: 'catch', cObj: 'bus', cStyle: 'hard', cLogD: 1 }, { duoAction: 'catch', cObj: 'partner' }, { duoAction: 'catch', cObj: 'car', cStyle: 'easy' }, { duoAction: 'collide' }];
  const SETS = [['defaults', {}], ['bolted', { anchor: 'bolted', oAnchor: 'bolted' }], ['own recoil off', { ownRecoil: false }], ['powers off', { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }]];
  const DIALS = (process.argv[3] || 'inf,20').split(',').map((x) => (x === 'inf' ? { inf: true } : { logKg: Number(x) }));
  const bad = [];
  let n = 0;
  for (const dl of DIALS) for (const [sl, sx] of SETS) for (const t of SOLO.map((a) => ({ action: a })).concat(DUO.map((d) => Object.assign({ duoOpen: true }, d)))) {
    const st = Object.assign({}, t, sx, dl), duo = !!st.duoOpen, bay = duo ? 'duo-bay' : 'bay';
    for (const eff of ['least', 'allout']) {
      const t0 = Date.now(); errs.length = 0;
      try {
        await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
        await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay'); if (duo) await settle(page, 'duo-bay');
        if (eff === 'allout') { const sel = duo ? '#duo-effort' : '#effort'; if (await page.$(sel)) { await page.selectOption(sel, 'allout'); await page.waitForTimeout(200); await settle(page, bay); } else continue; }
      } catch (e) { bad.push(JSON.stringify(st) + ' ' + eff + ': ' + e.message); continue; }
      const txt = await page.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('script, style').forEach((x) => x.remove()); return c.textContent.replace(/\s+/g, ' '); });
      const hits = txt.match(/NaN|undefined|(?<![∞\w])Infinity/g);
      const ms = Date.now() - t0; n++;
      if (hits || errs.length) bad.push(sl + ' ' + JSON.stringify(st) + ' ' + eff + ': ' + (hits ? hits.join(',') + ' near: ' + (txt.match(/.{0,80}(NaN|undefined|(?<![∞\w])Infinity).{0,40}/) || [''])[0] : '') + ' ' + errs.join(';').slice(0, 300));
      if (hits || errs.length) console.log('BAD ' + bad[bad.length - 1]);
      if (n % 20 === 0) console.log('progress ' + n);
      if (ms > 15000) bad.push('SLOW ' + ms + ' ms ' + sl + ' ' + JSON.stringify(st) + ' ' + eff);
    }
  }
  console.log(n + ' states; ' + bad.length + ' problems');
  for (const b of bad) console.log(b);
  await browser.close();
})();
