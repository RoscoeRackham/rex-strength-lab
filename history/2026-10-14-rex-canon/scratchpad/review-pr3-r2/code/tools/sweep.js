// NaN/undefined/Infinity sweep for a person on Throw and Catch, plus overflow of any element in the bays, and the summary line.
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const lab = path.resolve(process.argv[2]), part = process.argv[3] || 'all';
const { settle } = require(path.join(lab, 'test', 'make-page-fixture.js'));
const bad = (t) => (t.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
(async () => {
  const body = fs.readFileSync(path.join(lab, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 's-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const out = [];
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st, bay) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay'); if (bay === 'duo-bay') await settle(page, 'duo-bay'); };
  const pick = async (sel, v, bay) => { await page.selectOption(sel, v); await page.waitForTimeout(200); await settle(page, bay); };
  const probe = async (label, bay) => {
    const r = await page.evaluate((id) => {
      const b = document.body.cloneNode(true); b.querySelectorAll('script, style').forEach((x) => x.remove());
      const over = Array.from(document.querySelectorAll('#' + id + ' *')).filter((n) => n.clientWidth > 0 && n.scrollWidth > n.clientWidth + 1 && getComputedStyle(n).overflowX !== 'auto' && getComputedStyle(n).overflowX !== 'scroll' && !n.closest('details.math') && n.tagName !== 'INPUT').map((n) => n.tagName + '.' + n.className + ':' + (n.textContent || '').slice(0, 50));
      return { text: b.textContent, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, over: over.slice(0, 3) };
    }, bay);
    const b = bad(r.text);
    if (b.length || r.ov > 0 || r.over.length) out.push(label + ' bad=' + b.join(',') + ' ov=' + r.ov + ' over=' + JSON.stringify(r.over));
    return r;
  };
  let n = 0;
  if (part === 'all' || part === 'throw') {
    const dials = ['inf', 4, 8, 9.15, 12, 16, 18, 20, 25, 34];
    const sets = [{ airAbsorb: 1 }, { airAbsorb: 0 }, { airAbsorb: 0, keepForm: false }, { airAbsorb: 0.5, keepForm: false }, { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, { safePassenger: false, airAbsorb: 0 }];
    for (const d of dials) for (const s of sets) {
      const st = Object.assign({ saveV: 3, action: 'throw', obj: 'person' }, d === 'inf' ? { inf: true } : { logKg: d }, s);
      await load(st, 'bay'); await probe('throw ' + JSON.stringify(st) + ' least', 'bay'); n++;
      await pick('#effort', 'allout', 'bay'); await probe('throw ' + JSON.stringify(st) + ' allout', 'bay'); n++;
    }
    for (const surface of ['sand', 'ice', 'steel', 'granite', 'gravel']) for (const d of [5.5, 9.15]) {
      const st = { saveV: 3, action: 'throw', obj: 'person', logKg: d, surface };
      await load(st, 'bay'); await pick('#effort', 'allout', 'bay'); const r = await probe('throw ' + JSON.stringify(st), 'bay'); n++;
      const m = r.text.replace(/\s+/g, ' ').match(/But past a landing of about[^)]*\)\./); out.push('INFO ' + surface + ' ' + d + ': ' + (m ? m[0] : '(no give-way sentence)'));
    }
  }
  if (part === 'all' || part === 'catch') {
    for (const d of ['inf', 6, 9, 12, 16, 20, 34]) for (const D of [1, 3, 4.5, 7]) for (const s of [{ airAbsorb: 1 }, { airAbsorb: 0, keepForm: false }]) for (const style of ['hard']) {
      const st = Object.assign({ saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: style, cMiss: true, cLogD: D }, d === 'inf' ? { inf: true } : { logKg: d }, s);
      await load(st, 'duo-bay'); await pick('#duo-effort', 'allout', 'duo-bay'); await probe('catch ' + JSON.stringify(st), 'duo-bay'); n++;
    }
  }
  console.log('states', n, 'errors', JSON.stringify(errs.slice(0, 5)));
  for (const l of out) console.log(l.slice(0, 700));
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
