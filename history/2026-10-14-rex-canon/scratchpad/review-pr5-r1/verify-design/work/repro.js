// Reproduce the two design findings in the built page
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/verify-design/repo/rex-strength-lab';
const WORK = __dirname;
(async () => {
  const body = fs.readFileSync(path.join(REPO, 'dist', 'index.html'), 'utf8');
  const prev = path.join(WORK, 'page.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const load = async (st, effort) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload();
    await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    if (effort) {
      const sel = st.duoOpen ? '#duo-effort' : '#effort', bay = st.duoOpen ? 'duo-bay' : 'bay';
      await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.old = true; }, bay);
      await page.selectOption(sel, effort);
      await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.old), bay, { polling: 50, timeout: 60000 });
      await settled(bay);
    }
  };
  const tile = (bay) => page.evaluate((b) => { const t = document.querySelector('#' + b + ' .tile.shimmer'); return t ? Array.from(t.children).map((c) => c.textContent.replace(/ /g, ' ')).join(' || ') : null; }, bay);
  const bayText = (bay) => page.evaluate((b) => document.getElementById(b).textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), bay);
  const mode = process.argv[2];
  if (mode === 'collide') {
    for (const [lab, st] of [
      ['Collide default (Ollie charges), dial default', { duoOpen: true, duoAction: 'collide' }],
      ['Collide, dial 1e9', { duoOpen: true, duoAction: 'collide', logKg: 9 }],
      ['Collide, dial 1e14', { duoOpen: true, duoAction: 'collide', logKg: 14 }],
      ['Collide, colWho rex', { duoOpen: true, duoAction: 'collide', colWho: 'rex' }],
    ]) {
      await load(st, 'allout');
      console.log(lab + ':\n  ' + await tile('duo-bay'));
    }
    // the card text about the flicker
    const cardTxt = await page.evaluate(() => document.body.textContent.replace(/ /g, ' ').replace(/\s+/g, ' '));
    const i = cardTxt.indexOf('a flicker at a car crash');
    console.log('CARD: ' + (i >= 0 ? cardTxt.slice(Math.max(0, i - 300), i + 700) : 'not found'));
  } else if (mode === 'unbounded') {
    for (const [lab, st, bay] of [
      ['Throw car, unlimited', { action: 'throw', obj: 'car', inf: true }, 'bay'],
      ['Stomp, unlimited', { action: 'stomp', inf: true }, 'bay'],
      ['Clap, Silent strike, unlimited', { action: 'clap', silentStrike: true, inf: true }, 'bay'],
      ['Wrestle throw, unlimited', { duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', inf: true }, 'duo-bay'],
    ]) {
      await load(st, 'allout');
      const t = await tile(bay), bt = await bayText(bay);
      console.log(lab + ':\n  TILE: ' + t);
      const hits = [];
      for (const re of [/[^.]*light speed[^.]*\./g, /[^.]*nbounded[^.]*\./g, /[^.]*physical answer[^.]*\./g, /[^.]*∞[^.]*/g]) for (const m of bt.match(re) || []) hits.push(m.trim().slice(0, 260));
      console.log('  BAY: ' + [...new Set(hits)].join('\n       '));
    }
  }
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
