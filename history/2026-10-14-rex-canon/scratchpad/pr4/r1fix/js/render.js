// node render.js <ROOT> <states.json> <outdir>: each state at 390/1280, light/dark; overflow, clipped svg text, bad tokens, page errors
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = process.argv[2], STATES = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')), OUT = process.argv[4];
fs.mkdirSync(OUT, { recursive: true });
const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8'), prev = path.join(OUT, 'page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>body{margin:0;font:14px system-ui}</style></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let problems = 0;
  for (const [w, h, scheme] of [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'light'], [1280, 900, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    for (const [lab, st, eff, oKg] of STATES) {
      errs.length = 0;
      await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({ duoOpen: true }, st));
      await page.reload(); await page.waitForTimeout(500); await settle(page, 'bay'); await page.waitForTimeout(200); await settle(page, 'duo-bay');
      if (oKg != null) { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.evaluate(() => document.getElementById('o-own').click()); await page.waitForTimeout(300);
        await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, oKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); }
      if (eff) { await page.selectOption('#duo-effort', eff); await page.waitForTimeout(300); await settle(page, 'duo-bay'); }
      const r = await page.evaluate(() => {
        const b = document.getElementById('duo-bay');
        const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const clip = Array.from(b.querySelectorAll('svg')).flatMap((s) => { const sr = s.getBoundingClientRect(); return Array.from(s.querySelectorAll('text')).filter((t) => t.getBoundingClientRect().right > sr.right + 0.5 || t.getBoundingClientRect().left < sr.left - 0.5).map((t) => t.textContent); });
        const txt = b.textContent;
        const bad = (txt.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []);
        const wide = Array.from(b.querySelectorAll('*')).filter((n) => n.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map((n) => n.className || n.tagName).slice(0, 3);
        return { over, clip, bad, wide };
      });
      const prob = r.over > 0 || r.clip.length || r.bad.length || errs.length || r.wide.length;
      if (prob) { problems++; console.log('PROBLEM', w, scheme, lab, JSON.stringify(r), errs.join(' | ')); }
      if (w === 390 && scheme === 'dark') await page.locator('#duo-bay').screenshot({ path: path.join(OUT, lab.replace(/\W+/g, '_') + '.png') });
    }
    await page.close();
  }
  console.log(problems + ' problems');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
