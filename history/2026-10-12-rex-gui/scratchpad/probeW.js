const path = require('path'); const { pathToFileURL } = require('url');
const pwPath = '/opt/node22/lib/node_modules/playwright';
const { chromium } = require(pwPath || 'playwright');
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const fs = require('fs'); let launch = {}; try { if (fs.statSync(exe).isFile()) launch.executablePath = exe; } catch (e) {}
  const b = await chromium.launch(launch).catch(() => chromium.launch());
  const p = await b.newPage();
  await p.goto(pathToFileURL('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html').href);
  await p.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), JSON.parse(process.argv[2]));
  await p.reload(); await p.waitForTimeout(1500);
  const t = await p.evaluate(() => document.getElementById('bay').textContent.replace(/\s+/g, ' '));
  for (const m of t.matchAll(new RegExp(process.argv[3], 'g'))) console.log('...' + t.slice(Math.max(0, m.index - 250), m.index + 150) + '...\n');
  await b.close();
})();
