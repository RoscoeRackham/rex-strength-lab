const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const DIR = __dirname;
const html = fs.readFileSync(path.join(DIR, 'lab/dist/index.html'), 'utf8');
const prev = path.join(DIR, 'page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
async function settle(page, id) { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((x) => /working it out|Working out/i.test((document.getElementById(x) || {}).textContent || ''), id); if (!busy) return; await page.waitForTimeout(250); } throw new Error('busy'); }
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(pathToFileURL(prev).href);
  const load = async (st, bay) => { await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st); await page.reload(); await page.waitForTimeout(1000); await settle(page, bay); };
  const pick = async (sel, v, bay) => { await page.selectOption(sel, v); await page.waitForTimeout(400); await settle(page, bay); };
  const text = (id) => page.evaluate((x) => document.getElementById(x).innerText, id);
  const which = process.argv[2];
  const out = [];
  if (!which || which === 'arm') {
    await load({ duoOpen: true, duoAction: 'arm', logKg: 10 }, 'duo-bay');
    await page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
    await page.check('#o-effort-own'); await page.waitForTimeout(500); await settle(page, 'duo-bay');
    await page.evaluate(() => { const s = document.getElementById('o-effort-use'); s.value = '4'; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await page.waitForTimeout(1500); await settle(page, 'duo-bay');
    out.push('=== ARM (dial 1e10, Ollie 10 t) ===\n' + await text('duo-bay'));
    await pick('#duo-effort', 'plaster', 'duo-bay');
    out.push('=== ARM plaster preset ===\n' + await text('duo-bay'));
  }
  if (!which || which === 'pull') {
    await load({ action: 'pull', obj: 'bus', anchor: 'bolted', logKg: 6 }, 'bay');
    await pick('#effort', 'allout', 'bay');
    out.push('=== PULL bus bolted 1e6 all-out ===\n' + await text('bay'));
  }
  if (!which || which === 'partner') {
    await load({ duoOpen: true, duoAction: 'catch', cObj: 'partner', cLogD: 2, cStyle: 'easy', logKg: 7 }, 'duo-bay');
    out.push('=== CATCH partner lob 100 m 1e7 ===\n' + await text('duo-bay'));
    await pick('#duo-effort', 'plaster', 'duo-bay');
    out.push('=== CATCH partner plaster preset ===\n' + await text('duo-bay'));
  }
  if (!which || which === 'jump') {
    await load({ action: 'jump', surface: 'sand', logKg: 5 }, 'bay');
    await pick('#effort', 'allout', 'bay');
    out.push('=== JUMP sand 1e5 all-out ===\n' + await text('bay'));
  }
  if (!which || which === 'stomp') {
    await load({ action: 'stomp', logKg: 7 }, 'bay');
    await pick('#effort', 'plaster', 'bay');
    out.push('=== STOMP 1e7 plaster preset ===\n' + await text('bay'));
  }
  if (!which || which === 'collide') {
    await load({ duoOpen: true, duoAction: 'collide', colSrc: 'jump', surface: 'sand' }, 'duo-bay');
    out.push('=== COLLIDE jump onto Rex, sand, default dial ===\n' + await text('duo-bay'));
  }
  fs.writeFileSync(path.join(DIR, 'page-out-' + (which || 'all') + '.txt'), out.join('\n\n'));
  console.log('errors:', errs);
  await browser.close();
})();
