const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 320, height: 800 } });
  await p.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/prev_orig.html');
  await p.waitForTimeout(2000);
  console.log('old build 320:', await p.evaluate(() => [...document.querySelectorAll('[role=tab]')].map(t => t.textContent + ':' + (t.scrollWidth > t.clientWidth ? 'OVERFLOW ' + (t.scrollWidth - t.clientWidth) : 'ok')).join(' ')));
  await b.close();
})();
