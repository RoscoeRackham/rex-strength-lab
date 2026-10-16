const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const PAGE = process.argv[2], tmp = process.argv[3];
  fs.writeFileSync(tmp, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(PAGE, 'utf8') + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(tmp).href);
  const st = async () => page.evaluate(() => ({ rex: document.getElementById('nkb-rex').checked, ollie: document.getElementById('nkb-ollie').checked, sum: document.getElementById('powers-sum').textContent, saved: localStorage.getItem('rex-lab-v1') }));
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800);
  console.log('fresh', JSON.stringify(await st()).slice(0, 300));
  for (const save of [{ saveV: 2, anchor: 'bolted' }, { saveV: 3, ownRecoil: false }, { anchor: 'bolted' }, { saveV: 3, noKnockback: 'yes', oNoKnockback: null }]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), save); await page.reload(); await page.waitForTimeout(800);
    const s = await st(); console.log('old', JSON.stringify(save), '->', s.rex, s.ollie, '|', s.sum, '| saved keys', JSON.parse(s.saved || '{}').noKnockback, JSON.parse(s.saved || '{}').oNoKnockback);
  }
  await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(800);
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  const rex = page.getByRole('checkbox', { name: 'Never knocked back: Rex', exact: true }), ol = page.getByRole('checkbox', { name: 'Never knocked back: Ollie', exact: true });
  console.log('roles', await rex.count(), await ol.count());
  const desc = await page.evaluate(() => { const e = document.getElementById('nkb-rex'); return [e.getAttribute('aria-describedby'), document.getElementById(e.getAttribute('aria-describedby')).textContent.slice(0, 80)]; });
  console.log('describedby', desc);
  await rex.click(); await page.waitForTimeout(400); let s = await st(); console.log('rex off:', s.rex, s.ollie, s.sum);
  await ol.click(); await page.waitForTimeout(400); s = await st(); console.log('both off:', s.rex, s.ollie, s.sum);
  await rex.click(); await page.waitForTimeout(400); s = await st(); console.log('ollie off:', s.rex, s.ollie, s.sum);
  // keyboard: focus and space
  await ol.focus(); await page.keyboard.press('Space'); await page.waitForTimeout(400); s = await st(); console.log('kbd ollie on:', s.rex, s.ollie, s.sum);
  // the a11y tree around the group
  const snap = await page.accessibility.snapshot({ root: await page.$('#nkb-lbl').then((h) => h.evaluateHandle((n) => n.parentElement)) });
  console.log(JSON.stringify(snap).slice(0, 600));
  const geo = await page.evaluate(() => ['nkb-rex', 'nkb-ollie', 'bolt-rex', 'bolt-ollie'].map((id) => { const r = document.getElementById(id).getBoundingClientRect(); return id + ' ' + Math.round(r.x) + ',' + Math.round(r.y) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height); }));
  console.log(geo.join(' | '), 'scroll', await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth));
  console.log('errs', errs);
  await browser.close(); fs.unlinkSync(tmp);
})();
