// NaN/undefined/Infinity sweep at unlimited strength and the dial's top
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const [html, fixturePath] = process.argv.slice(2);
const { settle } = require(fixturePath);
const bad = (t) => (t.match(/.{0,60}(?:NaN|undefined|(?<![∞\w])Infinity).{0,60}/g) || []);
(async () => {
  const body = fs.readFileSync(html, 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const prev = path.join(path.dirname(html), 'preview-nan-' + process.pid + '.html');
  fs.writeFileSync(prev, wrapped);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const SOLO = ['walk', 'lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull', 'weight'];
  const DUO = [['arm', {}], ['wrestle', { wrestleMove: 'push' }], ['wrestle', { wrestleMove: 'shove' }], ['wrestle', { wrestleMove: 'shove', wrestleWho: 'both' }], ['wrestle', { wrestleMove: 'lift' }], ['wrestle', { wrestleMove: 'throw' }],
    ['catch', {}], ['catch', { cObj: 'car', cStyle: 'hard' }], ['catch', { cObj: 'partner' }], ['collide', {}], ['collide', { colMode: 'push' }]];
  const SETS = (process.env.SETS || 'def,bolted,off,boltoff').split(',');
  const SET = { def: {}, bolted: { anchor: 'bolted', oAnchor: 'bolted' }, off: { ownRecoil: false }, boltoff: { anchor: 'bolted', oAnchor: 'bolted', ownRecoil: false } };
  const DIALS = { inf: { inf: true }, top: { logKg: 34 } };
  const problems = [];
  const t0 = Date.now();
  for (const sn of SETS) for (const [dn, dial] of Object.entries(DIALS)) {
    const cases = SOLO.map((t) => [t, { action: t }, false]).concat(DUO.map(([t, x]) => [t + JSON.stringify(x), Object.assign({ duoOpen: true, duoAction: t }, x), true]));
    for (const [name, st, duo] of cases) {
      const s = Object.assign({}, SET[sn], dial, st);
      errs.length = 0;
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), s);
      await page.reload(); await page.waitForTimeout(600);
      try { await settle(page, duo ? 'duo-bay' : 'bay'); } catch (e) { problems.push(sn + ' ' + dn + ' ' + name + ' least: ' + e.message); }
      for (const eff of ['least', 'allout']) {
        if (eff === 'allout') {
          const sel = duo ? '#duo-effort' : '#effort';
          if (!(await page.$(sel))) continue;
          await page.selectOption(sel, 'allout'); await page.waitForTimeout(300);
          try { await settle(page, duo ? 'duo-bay' : 'bay'); } catch (e) { problems.push(sn + ' ' + dn + ' ' + name + ' allout: ' + e.message); }
        }
        const txt = await page.evaluate(() => { const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove()); return b.textContent.replace(/\s+/g, ' '); });
        const hits = bad(txt);
        if (hits.length || errs.length) problems.push(sn + ' ' + dn + ' ' + name + ' ' + eff + ': ' + hits.slice(0, 3).join(' | ') + (errs.length ? ' ERR ' + errs.slice(0, 2).join(' | ') : ''));
      }
    }
    console.log('done', sn, dn, ((Date.now() - t0) / 1000).toFixed(0) + ' s', problems.length + ' problems so far');
  }
  for (const p of problems) console.log('PROBLEM ' + p);
  await browser.close(); fs.unlinkSync(prev);
  console.log(problems.length ? problems.length + ' problems' : 'clean');
})();
