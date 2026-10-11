const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1500);
  const txt = await p.evaluate(() => document.body.innerText);
  const lines = txt.split('\n').filter(l => /474|492|suit/i.test(l));
  console.log('innerText hits:', lines);
  const html = await p.evaluate(() => document.documentElement.outerHTML);
  const m = html.match(/.{0,200}474\.5.{0,100}/g);
  console.log('html hits:', m);
  // tooltip attributes
  const tips = await p.evaluate(() => [...document.querySelectorAll('[title],[data-tip],[aria-label]')].map(e => (e.getAttribute('title')||'')+'|'+(e.getAttribute('data-tip')||'')+'|'+(e.getAttribute('aria-label')||'')).filter(s=>/474|suit/i.test(s)));
  console.log('tips:', tips);
  console.log('mentions 492.5 anywhere:', html.includes('492.5'), 'Engelbrecht:', html.includes('Engelbrecht'));
  await b.close();
})();
