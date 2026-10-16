// screenshots of round 2's changed views at 390 and 1280 px, light and dark: the Arm tab's tile and sentence, the Wrestle
// throw's and the toss's upper-bound label, the Throw tab's share sentence. node views.js <out dir>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab', OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const prev = path.join(OUT, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1280, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
    const redraw = async (id, act) => { await page.evaluate((b) => { for (const n of document.getElementById(b).children) n.r5old = true; }, id); await act(); await page.waitForFunction((b) => Array.from(document.getElementById(b).children).some((n) => !n.r5old), id, { polling: 30, timeout: 60000 }); await settled(id); };
    const load = async (st, effort) => { await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3 }, st)); await page.reload(); await settled('bay'); if (st.duoOpen) await settled('duo-bay'); if (effort) await redraw(st.duoOpen ? 'duo-bay' : 'bay', () => page.selectOption(st.duoOpen ? '#duo-effort' : '#effort', effort)); };
    const shot = async (nm, id) => { const sx = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); await (await page.$('#' + id)).screenshot({ path: path.join(OUT, nm + '-' + w + '-' + scheme + '.png') }); console.log(nm, w, scheme, 'sideways scroll', sx); };
    await load({ duoOpen: true, duoAction: 'arm', logKg: 9 }, 'allout');
    await redraw('duo-bay', () => page.evaluate(() => document.getElementById('o-own').click()));
    await redraw('duo-bay', () => page.evaluate(() => { const s = document.getElementById('o-strength'); s.value = '8'; s.dispatchEvent(new Event('input', { bubbles: true })); }));
    await shot('arm', 'duo-bay');
    await load({ duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw', wAngle: 45, oM: 1e6, logKg: Math.log10(3e18) }, 'allout'); await shot('wrestle-fast', 'duo-bay');
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cStyle: 'hard', logKg: 16 }, 'allout'); await shot('toss-fast', 'duo-bay');
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 20, ownRecoil: false }, 'allout'); await shot('catch-fast', 'duo-bay');
    await load({ action: 'throw', obj: 'baseball', angle: 45, logKg: 6, airAbsorb: 0.5 }, 'allout'); await shot('throw-share', 'bay');
    console.log('errors', w, scheme, errs.length ? errs.join(' | ') : 'none');
    await page.close();
  }
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
