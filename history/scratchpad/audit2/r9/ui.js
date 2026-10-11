const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const prev = '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r9/preview.html';
  const cases = [
    { logKg: 27, action: 'stomp' }, { logKg: 29, action: 'stomp' }, { logKg: 31, action: 'stomp' }, { logKg: 33, action: 'stomp' }, { logKg: 34, action: 'stomp' },
    { logKg: 31.5, action: 'throw', obj: 'earth', angle: 90 },
    { logKg: 29.5, action: 'throw', obj: 'moon', angle: 90 },
  ];
  for (const cs of cases) {
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    const st = Object.assign({ logKg: 5, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 }, cs);
    await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st);
    await page.goto('file://' + prev);
    await page.waitForTimeout(600);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    const lines = txt.split('\n').filter(l => /crater|Crater|quake|Quake|Earth|planet|binding|wide|blown/i.test(l));
    console.log('=== ', JSON.stringify(cs));
    console.log(lines.slice(0, 14).join('\n'));
    if (cs.logKg === 34 && cs.action === 'stomp') await page.locator('main.panel').screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r9/stomp34.png' });
    await page.close();
  }
  await b.close();
})();
