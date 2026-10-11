'use strict';
const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = process.argv[2], ids = process.argv[3].split(',');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)/, (r) => r.abort());
  const p = await ctx.newPage();
  await p.goto(pathToFileURL(path.resolve(html)).href);
  for (const id of ids) {
    const t = await p.evaluate((id) => { const f = document.querySelector('.fig[data-id="' + id + '"]'); if (!f) return null; f.click(); const d = document.getElementById('drawer'); return d.innerText; }, id);
    console.log('=========== ' + id + '\n' + (t || 'null').split('\n').filter((l) => /SCORE|range covers|Score =|WEIGHT|HEIGHT|BODY FAT|less|tail|Assumed|ignores|Body fat is|Beyond|MEASURED|REPORTED|DERIVED|ESTIMATE|OFFICIAL|lean|Lean|BMC|kg/.test(l)).slice(0, 30).join('\n'));
    await p.keyboard.press('Escape');
  }
  await browser.close();
})();
