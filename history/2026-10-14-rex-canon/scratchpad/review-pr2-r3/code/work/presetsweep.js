const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/code/repo/rex-strength-lab/test/make-page-fixture.js');
const bad = (t) => (t.match(/.{0,60}(?:NaN|undefined|(?<![∞\w])Infinity).{0,60}/g) || []);
(async () => {
  const html = process.argv[2];
  const prev = path.join(path.dirname(html), 'preview-ps-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(html, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const DUO = [['arm', {}], ['wrestle', { wrestleMove: 'shove' }], ['wrestle', { wrestleMove: 'shove', oAnchor: 'bolted' }], ['wrestle', { wrestleMove: 'shove', wrestleWho: 'both', anchor: 'bolted', oAnchor: 'bolted' }], ['wrestle', { wrestleMove: 'throw' }],
    ['catch', {}], ['catch', { cObj: 'car', cStyle: 'hard' }], ['catch', { cObj: 'semi' }], ['catch', { cObj: 'partner' }], ['collide', {}]];
  const SOLO = [['pull', {}], ['pull', { anchor: 'bolted' }], ['pull', { obj: 'bar511', anchor: 'bolted' }], ['throw', {}], ['stomp', {}]];
  const PRE = ['rattle', 'plaster', 'windows', 'ground', 'houses', 'block'];
  const dial = JSON.parse(process.env.DIAL || '{"inf":true}');
  const out = [];
  for (const [t, x] of DUO.map((d) => [d[0], d[1], true]).concat(SOLO.map((d) => [d[0], d[1], false])).map((a) => a)) {}
  const all = DUO.map(([t, x]) => [t, x, true]).concat(SOLO.map(([t, x]) => [t, x, false]));
  for (const [t, x, duo] of all) {
    const st = Object.assign(duo ? { duoOpen: true, duoAction: t } : { action: t }, dial, x), bay = duo ? 'duo-bay' : 'bay', sel = duo ? '#duo-effort' : '#effort';
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(700); await settle(page, bay);
    for (const e of PRE) {
      errs.length = 0;
      try { await page.selectOption(sel, e); await page.waitForTimeout(250); await settle(page, bay); } catch (er) { out.push(t + JSON.stringify(x) + ' ' + e + ': ' + er.message); continue; }
      const txt = await page.evaluate((b) => document.getElementById(b).textContent.replace(/\s+/g, ' '), bay);
      const h = bad(txt);
      if (h.length || errs.length) out.push(t + JSON.stringify(x) + ' ' + e + ': ' + h.slice(0, 2).join(' | ') + (errs.length ? ' ERR ' + errs.slice(0, 2).join(' | ') : ''));
      if (process.env.DUMP) console.log('--- ' + t + JSON.stringify(x) + ' ' + e + ': ' + (await page.evaluate((b) => document.querySelector('#' + b + ' .effort-read').textContent.replace(/\s+/g, ' '), bay)).slice(0, 600));
    }
  }
  for (const p of out) console.log('PROBLEM ' + p);
  console.log(out.length ? out.length + ' problems' : 'clean');
  await browser.close(); fs.unlinkSync(prev);
})();
