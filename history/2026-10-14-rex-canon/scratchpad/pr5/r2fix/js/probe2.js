// the game of catch past 1% of light speed: does the page label the shimmer's drag figure (all of its energy) there?
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const prev = path.join(__dirname, 'preview2-' + process.pid + '.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const settled = (id) => page.waitForFunction((i) => { const b = document.getElementById(i); return !!b && b.children.length > 0 && !/working it out|Working out/i.test(b.textContent); }, id, { polling: 30, timeout: 60000 });
  for (const st of [{ cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, ownRecoil: false }, { cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 14, keepForm: false, airAbsorb: 0.5, noKnockback: false, oNoKnockback: false }, { cObj: 'baseball', cStyle: 'hard', cLogD: 1, logKg: 16, ownRecoil: false, airAbsorb: 0.5 }]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), Object.assign({ saveV: 3, duoOpen: true, duoAction: 'catch' }, st)); await page.reload(); await settled('duo-bay');
    await page.evaluate(() => { for (const n of document.getElementById('duo-bay').children) n.r5old = true; }); await page.selectOption('#duo-effort', 'allout');
    await page.waitForFunction(() => Array.from(document.getElementById('duo-bay').children).some((n) => !n.r5old), null, { polling: 30, timeout: 60000 }); await settled('duo-bay');
    const x = await page.evaluate(() => document.getElementById('duo-bay').textContent.replace(/ /g, ' ').replace(/\s+/g, ' '));
    const t = await page.evaluate(() => { const t = document.querySelector('#duo-bay .tile.shimmer'); return t ? Array.from(t.children).map((c) => c.textContent).join(' || ') : null; });
    console.log('==', JSON.stringify(st), '\n TILE:', t, '\n upper bound mentions:', (x.match(/[^.]*upper bound[^.]*\./g) || []).join(' ## ').slice(0, 1200), '\n verdict:', (x.match(/Rex throws[^.]*\.[^.]*\.[^.]*\./) || [''])[0].slice(0, 500));
  }
  await browser.close(); fs.unlinkSync(prev);
})().catch((e) => { console.error(e); process.exit(1); });
