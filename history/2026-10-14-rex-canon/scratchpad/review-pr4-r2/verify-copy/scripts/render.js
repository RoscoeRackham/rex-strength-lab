// usage: node render.js '<json array of {name, state, pick, width, ollieKg, wm}>'
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/verify-copy/repo/rex-strength-lab';
const DIR = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/verify-copy';
const html = fs.readFileSync(process.env.PAGE || (R + '/dist/index.html'), 'utf8');
const file = path.join(DIR, 'page-' + process.pid + '.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
async function settle(page, id) { for (let i = 0; i < 200; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), id); if (!busy) return; await page.waitForTimeout(250); } }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: c.width || 1280, height: 900 } });
    const errs = []; page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(file).href);
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), c.state);
    await page.reload(); await page.waitForTimeout(1200); await settle(page, 'bay'); await settle(page, 'duo-bay');
    if (c.ollieKg != null) { await page.evaluate(() => { document.getElementById('ollie-setup').open = true; }); await page.click('#o-own'); await page.waitForTimeout(300);
      await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, c.ollieKg); await page.waitForTimeout(800); await settle(page, 'duo-bay'); }
    if (c.wm) { await page.click('#wm-' + c.wm); await page.waitForTimeout(600); await settle(page, 'duo-bay'); }
    if (c.pick) { await page.selectOption('#duo-effort', c.pick); await page.waitForTimeout(500); await settle(page, 'duo-bay'); }
    const res = await page.evaluate(() => { const bay = document.getElementById('duo-bay'); const txt = (n) => (n ? n.textContent.replace(/\s+/g, ' ').trim() : null); const all = (sel) => Array.from(bay.querySelectorAll(sel)).map(txt);
      return { verdict: txt(bay.querySelector('.verdict')), status: all('.status-row'), tiles: all('.tiles'), effort: all('.effort-read'), happens: all('.happens'), callouts: all('.callout'), math: all('details.math .eq'), bars: all('.bars, .logbars, figure, .bar-cap, figcaption'), effSel: (document.getElementById('duo-effort') || {}).value, all: bay.textContent.replace(/\s+/g, ' ') }; });
    if (c.shot) await page.screenshot({ path: path.join(DIR, c.shot), fullPage: true });
    console.log('==== ' + c.name);
    for (const k of (c.keys || ['verdict', 'status', 'tiles', 'effort', 'happens', 'math'])) console.log('[' + k + '] ' + JSON.stringify(res[k]));
    if (c.grep) for (const g of c.grep) { const re = new RegExp(g, 'g'); let m; const found = []; while ((m = re.exec(res.all))) found.push(res.all.slice(Math.max(0, m.index - 150), m.index + 250)); console.log('[grep ' + g + '] ' + JSON.stringify(found)); }
    if (errs.length) console.log('[errors] ' + errs.join(' | '));
    await page.close();
  }
  await browser.close(); fs.unlinkSync(file);
})();
