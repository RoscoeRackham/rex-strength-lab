const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await p.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await p.goto('file://' + path.join(__dirname, 'page.html')); await p.waitForTimeout(2500);
  const out = await p.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#results tr')).map(tr => tr.innerText.replace(/\t/g, ' | '));
    const card = document.querySelector('#limitCards .limit .plate').innerText;
    return { rows: rows.slice(0, 8), card, status: document.getElementById('toolStatus').innerText, target: document.getElementById('targetStatus').innerText };
  });
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
