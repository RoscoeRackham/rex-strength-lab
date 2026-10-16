// probe the built page for review round 2's states: node probe.js [repo rex-strength-lab dir]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const prev = path.join(__dirname, 'preview-' + process.pid + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
  const redraw = async (id, act) => { await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, id); await act(); await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), id, { polling: 30, timeout: 60000 }); await settled(id); };
  const load = async (st, effort) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload(); await settled('bay'); if (st.duoOpen) await settled('duo-bay');
    if (effort) await redraw(st.duoOpen ? 'duo-bay' : 'bay', () => page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', effort)); };
  const txt = (id) => page.evaluate((b) => document.getElementById(b).textContent.replace(/ /g, ' ').replace(/\s+/g, ' '), id);
  const tile = (id) => page.evaluate((b) => { const t = document.querySelector('#' + b + ' .tile.shimmer'); return t ? Array.from(t.children).map((c) => c.textContent.replace(/ /g, ' ')).join(' || ') : null; }, id);
  const show = async (lab, id, re) => { const x = await txt(id); console.log('== ' + lab + '\n  TILE: ' + (await tile(id)) + (re ? '\n  ' + ((x.match(re) || ['(no match)'])[0]) : '')); };
  const which = process.argv[3] || 'all';
  if (which === 'all' || which === 'arm') {
    await load({ duoOpen: true, duoAction: 'arm', logKg: 9 }, 'allout');
    await redraw('duo-bay', () => page.evaluate(() => document.getElementById('o-own').click()));
    await redraw('duo-bay', () => page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = '8'; s.dispatchEvent(new Event('input', { bubbles: true })); }));
    await show('arm 1e9 vs 1e8, all-out', 'duo-bay', /Unbreakable footing: on real ground[^]*?counts it\)\./);
    console.log('  items:', ((await txt('duo-bay')).match(/What happens[^]*?Show the math/) || [''])[0].slice(0, 1500));
    await redraw('duo-bay', () => page.evaluate(() => document.getElementById('sw-unbreakable').click()));
    await show('arm, Unbreakable footing off', 'duo-bay', /The pin’s slam drives[^.]*\./);
  }
  if (which === 'all' || which === 'duo') {
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wrestleWho: 'ollie', wAngle: 30, logKg: 9 });
    console.log('  slider', await page.$eval('#duo-effort-use', (x) => x.getAttribute('value')), await page.$eval('#duo-effort', (x) => x.value));
    await show('wrestle throw, Ollie throws, 1e9, 30, least', 'duo-bay');
    await load({ duoOpen: true, duoAction: 'collide', colWho: 'rex' }, 'allout');
    await show('collide, Rex charges, all-out', 'duo-bay');
  }
  if (which === 'all' || which === 'fast') {
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45, oM: 1e6, logKg: Math.log10(3e18) }, 'allout');
    await show('wrestle dense Ollie 3e18', 'duo-bay', /The shimmer \(the Shimmer tile\)[^]*?upper bound\./);
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 16 }, 'allout');
    await show('toss hard 1e16', 'duo-bay', /The shimmer \(the Shimmer tile\)[^]*?upper bound\./);
  }
  if (which === 'all' || which === 'share') {
    await load({ action: 'throw', obj: 'baseball', angle: 45, logKg: 6, airAbsorb: 0.5 }, 'allout');
    await show('baseball 45 1e6 50%', 'bay', /Air resistance absorbed: their power takes back[^]*?flight it actually flies, which slows less than in real air\./);
    await load({ action: 'throw', obj: 'car', angle: 20, airAbsorb: 0.5 }, 'allout');
    await show('car 20 50%', 'bay', /Air resistance absorbed: their power takes back[^]*?flight it actually flies, which slows less than in real air\./);
  }
  console.log('page errors:', errs.length ? errs.join(' | ') : 'none');
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
