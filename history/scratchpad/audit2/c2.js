const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage();
  await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await p.waitForTimeout(1000);
  const ends = await p.$$eval('.scale-ends span', els => els.map(e => [e.textContent, e.getBoundingClientRect().width>0]));
  console.log('ends', JSON.stringify(ends));
  // set slider to max
  await p.$eval('#strength', el => { el.value = '34'; el.dispatchEvent(new Event('input', {bubbles:true})); });
  await p.waitForTimeout(500);
  const txt = await p.evaluate(() => document.body.innerText);
  const lines = txt.split('\n').filter(l => /Sun|10³⁴|10\^34|e\+34/.test(l));
  console.log(lines.slice(0,20).join('\n'));
  await b.close();
})();
