const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const dir = __dirname;
const html = fs.readFileSync(dir + '/lab/dist/index.html', 'utf8');
fs.writeFileSync(dir + '/page.html', '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
const base = { logKg: 17, duoAction: 'catch', duoOpen: true, cObj: 'baseball', cLogD: Math.log10(15000), cStyle: 'hard', anchor: 'bolted', oAnchor: 'bolted' };
const cases = [
  ['dense-50-kept', { oM: 1e20, airAbsorb: 0.5, keepForm: true }],
  ['dense-50-nokeep', { oM: 1e20, airAbsorb: 0.5, keepForm: false }],
  ['dense-100-nokeep', { oM: 1e20, airAbsorb: 1, keepForm: false }],
  ['normal-50-kept', { airAbsorb: 0.5, keepForm: true }],
  ['normal-50-nokeep', { airAbsorb: 0.5, keepForm: false }],
];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [name, st] of cases) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
    await page.goto('file://' + dir + '/page.html');
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), Object.assign({}, base, st));
    await page.reload();
    await page.waitForTimeout(500);
    if (await page.$('#duo-effort')) await page.selectOption('#duo-effort', 'allout').catch(() => {});
    for (let i = 0; i < 240; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out/i.test(t)) break; await page.waitForTimeout(500); }
    const txt = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(dir + '/out-' + name + '.txt', txt);
    const lines = txt.split('\n').filter(l => /hits the ground about|what hits him|fireball|no air: their power|underground/.test(l));
    console.log('=== ' + name + (errs.length ? ' ERR ' + errs.join(' | ') : ''));
    for (const l of lines) console.log('  ' + l.slice(0, 900));
    await ctx.close();
  }
  await browser.close();
})();
