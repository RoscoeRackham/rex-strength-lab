const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1200);
  const cards = await p.$$('#feat-groups article, #feat-groups .feat, #feat-groups li, #feat-groups > * > *');
  let clicked = false;
  for (const c of await p.$$('#feat-groups button')) {
    const ok = await c.evaluate(n => { let a = n; for (let i=0;i<4;i++){ a=a.parentElement; if (a && /Captain America presses/.test(a.textContent) && a.textContent.length < 400) return /Simulate/.test(n.textContent); } return false; });
    if (ok) { await c.click(); clicked = true; break; }
  }
  console.log('clicked', clicked);
  await p.waitForTimeout(800);
  console.log('dial:', await p.$eval('#dial-big', n => n.textContent), '|', await p.$eval('#dial-force', n => n.textContent), '|', await p.$eval('#dial-who', n => n.textContent));
  console.log('bay:', (await p.$eval('#bay', n => n.innerText)).slice(0, 1500));
  await b.close();
})();
