const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const body = fs.readFileSync(S + '/repo/rex-strength-lab/dist/index.html', 'utf8');
const prev = S + '/preview.html';
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
const settle = async (page) => { for (let i = 0; i < 240; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) return; await page.waitForTimeout(500); } };
async function run(browser, name, st, actions, sel) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload(); await page.waitForTimeout(1500); await settle(page);
  for (const a of actions || []) { await a(page); await page.waitForTimeout(500); await settle(page); }
  const t = await page.evaluate((sel) => document.querySelector(sel).innerText, sel);
  await page.screenshot({ path: S + '/' + name + '.png', fullPage: true });
  fs.writeFileSync(S + '/' + name + '.txt', t);
  console.log('=== ' + name + (errs.length ? ' ERRORS ' + errs.join('|') : ''));
  await page.close();
  return t;
}
const pick = (re, t) => t.split('\n').filter((l) => re.test(l)).map((l) => '  > ' + l.slice(0, 400)).join('\n');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const which = process.argv[2] || 'all';
  if (which === 'all' || which === '1') {
    const t = await run(browser, 'collide-stomp', { logKg: 5, duoOpen: true, duoAction: 'collide', colSrc: 'stomp', colWho: 'ollie' }, [], '#duo-bay');
    console.log(pick(/Bolted|standing|stomp/i, t));
  }
  if (which === 'all' || which === '3') {
    const t = await run(browser, 'throw-plaster', { logKg: 9, action: 'throw', obj: 'bus', angle: 45, surface: 'concrete' }, [async (p) => { await p.selectOption('#effort', 'plaster'); }], '#bay');
    console.log(pick(/plaster|Effort:|Courtesy/i, t));
  }
  if (which === 'all' || which === '6') {
    const t = await run(browser, 'shove-unb', { logKg: 5, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'shove', wrestleWho: 'rex', ownRecoil: false, unbreakable: true }, [], '#duo-bay');
    console.log(pick(/ground|kg·m\/s/i, t));
  }
  if (which === 'all' || which === '7') {
    const t = await run(browser, 'collide-imm', { logKg: 7, duoOpen: true, duoAction: 'collide', colImm: true, colWho: 'ollie', colSrc: 'sprint' }, [], '#duo-bay');
    console.log(pick(/immovable|Courtesy|slides|quake|moves/i, t));
  }
  if (which === 'all' || which === '8') {
    for (const unb of [true, false]) {
      const t = await run(browser, 'catch-sand-' + unb, { logKg: 5, duoOpen: true, duoAction: 'catch', cObj: 'car', cLogD: Math.log10(30), surface: 'sand', unbreakable: unb }, [], '#duo-bay');
      console.log(pick(/Feet|feet|slide|Slides|ground|their power/i, t));
    }
  }
  await browser.close();
})();
