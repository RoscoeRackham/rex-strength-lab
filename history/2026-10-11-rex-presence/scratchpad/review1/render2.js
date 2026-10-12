const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file://' + __dirname + '/preview.html');
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', obj: 'person', angle: 45 })));
  await p.reload();
  await p.waitForTimeout(6000);
  const txt = await p.evaluate(() => document.body.innerText);
  for (const kw of ['Amusement rides', 'Launch:', 'Courtesy ceiling', 'Effort:']) {
    let i = txt.indexOf(kw); while (i >= 0 && kw) { console.log('['+kw+']', txt.slice(Math.max(0, i - 100), i + 700).replace(/\n+/g, ' / ')); console.log('---'); i = txt.indexOf(kw, i + 1); if (kw !== 'Amusement rides') break; }
  }
  await b.close();
})();
