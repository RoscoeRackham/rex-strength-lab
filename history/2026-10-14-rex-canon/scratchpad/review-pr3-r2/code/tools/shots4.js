const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const lab = path.resolve(process.argv[2]), out = process.argv[3];
const { settle } = require(path.join(lab, 'test', 'make-page-fixture.js'));
const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
(async () => {
  const body = fs.readFileSync(path.join(lab, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'v-' + process.pid + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const STATES = [
    ['throw-fast', { saveV: 3, action: 'throw', obj: 'person', logKg: 9.15 }, 'bay', '#effort'],
    ['throw-hot', { saveV: 3, action: 'throw', obj: 'person', logKg: 8, keepForm: false, airAbsorb: 0 }, 'bay', '#effort'],
    ['catch-bear', { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 2, logKg: 8, airAbsorb: 0 }, 'duo-bay', '#duo-effort'],
    ['catch-hot', { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 1, logKg: 8, airAbsorb: 0, keepForm: false }, 'duo-bay', '#duo-effort'],
    ['catch-hg', { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, cLogD: 4.5, logKg: 16 }, 'duo-bay', '#duo-effort'],
  ];
  for (const [w, h] of [[390, 844], [1280, 900]]) for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(pathToFileURL(prev).href);
    for (const [id, st, bay, sel] of STATES) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay'); if (bay === 'duo-bay') await settle(page, 'duo-bay');
      await page.selectOption(sel, 'allout'); await page.waitForTimeout(300); await settle(page, bay);
      const r = await page.evaluate((b) => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, clipped: Array.from(document.querySelectorAll('#' + b + ' li, #' + b + ' .callout, #' + b + ' .tile, #' + b + ' .status, #' + b + ' .verdict, #' + b + ' p')).filter((n) => { const r = n.getBoundingClientRect(), p = document.getElementById(b).getBoundingClientRect(); return r.right > p.right + 1 || r.left < p.left - 1 || n.scrollWidth > n.clientWidth + 1; }).map((n) => n.className + ':' + n.textContent.slice(0, 40)) }), bay);
      if (r.ov || r.clipped.length) console.log(w, scheme, id, JSON.stringify(r));
      await (await page.$('#' + bay)).screenshot({ path: path.join(out, `${id}-${w}-${scheme}.png`) });
    }
    // contrast of the new eyebrow and the muted effort-box paragraph, and the switch label
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { saveV: 3, action: 'throw', obj: 'person' }); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    const cols = await page.evaluate(() => {
      const bgOf = (n) => { while (n) { const c = getComputedStyle(n).backgroundColor; if (c && !/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; n = n.parentElement; } return 'rgb(255,255,255)'; };
      const eb = document.getElementById('sw-passenger').closest('label').previousElementSibling;
      const mp = Array.from(document.querySelectorAll('#bay .effort-read p.muted, #bay p.muted')).find((p) => /For a person, Safe passenger/.test(p.textContent));
      return [['eyebrow', getComputedStyle(eb).color, bgOf(eb)], ['muted', mp ? getComputedStyle(mp).color : null, mp ? bgOf(mp) : null], ['label', getComputedStyle(document.getElementById('sw-passenger').closest('label')).color, bgOf(document.getElementById('sw-passenger').closest('label'))]];
    });
    for (const [k, fg, bg] of cols) { if (!fg) { console.log(w, scheme, k, 'not found'); continue; } const a = lum(fg), b = lum(bg); console.log(w, scheme, k, fg, 'on', bg, 'contrast', ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2)); }
    await (await page.$('#powers')).screenshot({ path: path.join(out, `powers-${w}-${scheme}.png`) });
    if (errs.length) console.log('errors', errs);
    await page.close();
  }
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
