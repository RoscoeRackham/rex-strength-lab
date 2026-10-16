// node ownstr.js <html> : the can't-hold-it catch and the quick pin, with Ollie's own strength
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const [, , htmlFile] = process.argv;
(async () => {
  const body = fs.readFileSync(htmlFile, 'utf8');
  const prev = path.join(__dirname, 'out', 'page-own.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate(() => /working it out|Working out/i.test(document.getElementById('duo-bay').textContent)); if (!busy) return; await page.waitForTimeout(250); } };
  const txt = (s) => page.evaluate((x) => Array.from(document.querySelectorAll('#duo-bay ' + x)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), s);
  const run = async (st, olog, label) => {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); await settle();
    await page.evaluate(() => { document.getElementById('ollie-setup').open = true; });
    await page.click('#o-own'); await page.waitForTimeout(300);
    await page.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, olog);
    await page.waitForTimeout(800); await settle(); await page.selectOption('#duo-effort', 'allout'); await page.waitForTimeout(300); await settle();
    console.log('########', label);
    for (const s of ['.verdict', '.status-row', '.tiles', '.effort-read']) console.log(s, ':', await txt(s));
    const items = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay .happens li')).map((n) => n.textContent));
    items.forEach((i) => console.log('  *', i));
    const m = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-bay details.math .eq')).map((n) => n.textContent).join('\n'));
    console.log('  m:', m.split('\n').filter((l) => /Catch|pin|Pin|slam/.test(l)).join('\n  m: '));
  };
  await run({ duoOpen: true, duoAction: 'catch', cObj: 'car', cLogD: Math.log10(30), cStyle: 'easy', logKg: 5 }, Math.log10(500), 'cant-hold-it');
  await run({ duoOpen: true, duoAction: 'catch', cObj: 'car', cLogD: Math.log10(30), cStyle: 'easy', logKg: 5, ownRecoil: false }, Math.log10(500), 'cant-hold-it, power off');
  await run({ duoOpen: true, duoAction: 'arm' }, 4.5, 'quick pin');
  await run({ duoOpen: true, duoAction: 'arm', ownRecoil: false }, 4.5, 'quick pin, power off');
  await run({ duoOpen: true, duoAction: 'arm', logKg: 9 }, 9.5, 'pin at 10^9');
  await browser.close();
})();
