const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('file://' + S + '/wrapped.html');
  await p.waitForTimeout(2500);
  const el = await p.$('.fig[data-id="ronnie_coleman"]');
  await el.scrollIntoViewIfNeeded(); await el.click(); await p.waitForTimeout(800);
  await p.screenshot({ path: S + '/coleman_drawer.png' });
  const t = await p.evaluate(() => { const d = document.querySelector('.drawer, #drawer, [role=dialog]'); return d ? d.innerText.slice(0, 1500) : document.activeElement.outerHTML.slice(0,200); });
  console.log(t);
  await b.close();
})();
