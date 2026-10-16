// load a lab's dist page in Chromium at given states and print the two-player bay's texts
// node probe.js <lab dir> <cases.json>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const lab = process.argv[2], cases = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const html = fs.readFileSync(path.join(lab, 'dist/index.html'), 'utf8');
  const file = path.join(__dirname, 'probe-' + path.basename(path.dirname(lab)) + '.html');
  fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
  const actDuo = (code, arg) => page.evaluate(([c, a]) => { for (const n of document.getElementById('duo-bay').children) n.r3old = true; new Function('a', c)(a); }, [code, arg]);
  const redrawn = () => page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r3old), null, { polling: 30, timeout: 60000 });
  const txt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
  for (const c of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state); await page.reload(); await settled('bay'); await settled('duo-bay');
    if (c.ollie != null) { await actDuo("document.getElementById('ollie-setup').open = true; document.getElementById('o-own').click();"); await redrawn();
      await actDuo("const s = document.getElementById('o-strength'); s.value = String(a); s.dispatchEvent(new Event('input', { bubbles: true }));", c.ollie); await redrawn(); await settled('duo-bay'); }
    if (c.pick) { if (await page.$eval('#duo-effort', (x) => x.value) !== c.pick) { await actDuo("const x = document.getElementById('duo-effort'); x.value = a; x.dispatchEvent(new Event('change', { bubbles: true }));", c.pick); await redrawn(); } await settled('duo-bay'); }
    if (c.effort != null) { await actDuo("const s = document.getElementById('duo-effort-use'); s.value = String(a); s.dispatchEvent(new Event('input', { bubbles: true }));", c.effort); await redrawn(); await settled('duo-bay'); }
    const out = {};
    for (const [k, s] of Object.entries(c.read || { verdict: '.verdict', status: '.status-row', effort: '.effort-read', tiles: '.tiles', happens: '.happens', math: 'details.math .eq' })) out[k] = await txt(s);
    console.log('#### ' + c.name); for (const [k, v] of Object.entries(out)) console.log('[' + k + '] ' + v);
  }
  if (errs.length) console.log('ERRORS', errs.slice(0, 5));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
