const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const S = __dirname;
const wrap = (src, name) => { const f = path.join(S, name + '.wrapped.html'); fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(src, 'utf8') + '</body></html>'); return pathToFileURL(f).href; };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pages = { base: S + '/base/dist/index.html', mutA_nobolt: S + '/mutA_nobolt/dist/index.html', mutB_nowangle: S + '/mutB_nowangle/dist/index.html', main: S + '/main-index.html' };
  for (const [name, f] of Object.entries(pages)) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(e.message));
    await page.goto(wrap(f, name));
    const load = async (st) => { await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st); await page.reload(); await page.waitForTimeout(800); };
    const isMain = name === 'main';
    const bay = isMain ? 'bay' : 'duo-bay';
    if (!isMain) {
      // code-1
      await load({ anchor: 'bolted', oAnchor: 'bolted', duoOpen: true, duoAction: 'collide' });
      await page.waitForTimeout(400); await settle(page, bay);
      const r = await page.evaluate(() => ({ rex: document.getElementById('bolt-rex').checked, ollie: document.getElementById('bolt-ollie').checked, powersSummary: document.querySelector('#powers > summary').textContent.replace(/\s+/g, ' ').trim(), saved: (({ anchor, oAnchor }) => ({ anchor, oAnchor }))(JSON.parse(localStorage.getItem('rex-lab-v1'))) }));
      r.verdict = (await readResult(page, bay)).verdict.slice(0, 110);
      console.log(name, 'code-1 bolted save:', JSON.stringify(r));
    }
    // code-2
    await load(isMain ? { angle: 30, group: 'duo', duoAction: 'wrestle', wrestleMove: 'throw' } : { angle: 30, duoOpen: true, duoAction: 'wrestle', wrestleMove: 'throw' });
    await page.waitForTimeout(400); await settle(page, bay);
    const ang = await page.evaluate((m) => { const e = document.getElementById(m ? 'angle' : 'w-angle'); return e ? e.value : null; }, isMain);
    console.log(name, 'code-2 old save angle 30 wrestle throw: angle box', ang, '| verdict:', (await readResult(page, bay)).verdict);
    if (errs.length) console.log(name, 'errors', errs);
    await ctx.close();
  }
  await browser.close();
})();
