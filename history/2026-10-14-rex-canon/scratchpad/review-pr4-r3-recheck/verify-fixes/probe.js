// usage: node probe.js <rex-strength-lab dir> <json list of cases>
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir = process.argv[2], cases = JSON.parse(process.argv[3]);
(async () => {
  const body = fs.readFileSync(path.join(dir, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'probe-' + path.basename(path.dirname(dir)) + '.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 50, timeout: 60000 });
  const actDuo = (code, arg) => page.evaluate(([c, a]) => { for (const n of document.getElementById('duo-bay').children) n.r3old = true; new Function('a', c)(a); }, [code, arg]);
  const redrawn = () => page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r3old), null, { polling: 50, timeout: 60000 });
  for (const c of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state); await page.reload(); await settled('bay'); await settled('duo-bay');
    if (c.ollie != null) {
      await actDuo("document.getElementById('ollie-setup').open = true; document.getElementById('o-own').click();"); await redrawn();
      await actDuo("const s = document.getElementById('o-strength'); s.value = String(a); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true }));", c.ollie); await redrawn(); await settled('duo-bay');
    }
    if (c.pick) {
      const cur = await page.$eval('#duo-effort', (x) => x.value);
      if (cur !== c.pick) { await actDuo("const x = document.getElementById('duo-effort'); x.value = a; x.dispatchEvent(new Event('input', { bubbles: true })); x.dispatchEvent(new Event('change', { bubbles: true }));", c.pick); await redrawn(); }
      await settled('duo-bay');
    }
    const out = {};
    for (const sel of c.sel || ['.verdict']) out[sel] = await page.evaluate((s) => Array.from(document.querySelectorAll('#duo-bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
    console.log('### ' + c.name); for (const k in out) console.log('[' + k + '] ' + out[k]);
  }
  console.log('page errors: ' + errs.length);
  await browser.close();
})();
