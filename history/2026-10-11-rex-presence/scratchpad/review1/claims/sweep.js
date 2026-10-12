const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const fs = require('fs');
const PREV = __dirname + '/snap2/dist/preview.html';
const strengths = JSON.parse(process.argv[2] || '[["human",2.7084],["default",4.9577],["secretwars",14.1338],["inf",null]]');
const surfaces = JSON.parse(process.argv[3] || '["concrete","sand"]');
const tabs = JSON.parse(process.argv[4] || '["throw","jump","stomp","punch","clap","sprint","pull"]');
const presets = JSON.parse(process.argv[5] || '["least","ceiling","rattle","plaster","windows","ground","houses","block","allout"]');
const extra = JSON.parse(process.argv[6] || '{}');
const outFile = process.argv[7] || 'sweep.txt';
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const jobs = [];
  for (const [sn, lk] of strengths) for (const sf of surfaces) jobs.push([sn, lk, sf]);
  const out = [];
  await Promise.all([0, 1, 2, 3].map(async (w) => {
    for (let j = w; j < jobs.length; j += 4) {
      const [sn, lk, sf] = jobs[j];
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const st = Object.assign({ surface: sf, group: 'solo', action: 'throw' }, lk == null ? { inf: true } : { inf: false, logKg: lk }, extra);
      await ctx.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st);
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
      await page.goto(pathToFileURL(PREV).href);
      await page.waitForTimeout(300);
      for (const tab of tabs) {
        await page.click('#tab-' + tab);
        await page.waitForTimeout(100);
        for (const pr of presets) {
          await page.evaluate((v) => { const e = document.getElementById('effort'); e.value = v; e.dispatchEvent(new Event('change', { bubbles: true })); }, pr);
          for (let i = 0; i < 300; i++) { const t = await page.evaluate(() => document.querySelector('#bay').innerText); if (!/Working out the courtesy ceiling/.test(t)) break; await page.waitForTimeout(100); }
          await page.evaluate(() => document.querySelectorAll('#bay details.haz-list').forEach((d) => { d.open = true; }));
    const text = await page.evaluate(() => [...document.querySelectorAll('#bay > .verdict, #bay > .status-row, #bay .effort-read, #bay > .callout')].map((e) => '[' + e.className.split(' ')[0] + '] ' + e.innerText.replace(/\n+/g, ' | ')).join('\n'));
          out.push({ k: [sn, sf, tab, pr].join(' / '), text, errs: errs.splice(0) });
        }
      }
      await ctx.close();
    }
  }));
  await browser.close();
  out.sort((a, b) => a.k.localeCompare(b.k));
  fs.writeFileSync(outFile, out.map((r) => '##### ' + r.k + (r.errs.length ? ' ERRS ' + JSON.stringify(r.errs) : '') + '\n' + r.text).join('\n'));
  console.log('done', out.length);
})();
