const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const file of ['/home/user/dino-strength-sim/dist/preview.html', process.argv[2]]) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
    await p.goto('file://' + file);
    await p.waitForTimeout(600);
    const read = () => p.evaluate(() => document.querySelector('.verdict').innerText + ' || ' + document.querySelector('.status-row').innerText.replace(/\n/g, ' | '));
    await p.locator('article.feat', { hasText: 'Atlas holds up the heavens' }).locator('button.run').click();
    await p.waitForTimeout(300);
    console.log(file.split('/').pop(), 'Atlas:', await read());
    // strongest human then slider one step down
    await p.locator('article.feat', { hasText: '511 kg deadlift' }).locator('button.run').click();
    await p.waitForTimeout(200);
    await p.evaluate(() => { const s = document.querySelector('#strength'); s.value = '2.70'; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await p.waitForTimeout(200);
    console.log(file.split('/').pop(), 'bar511 @2.70:', await read());
    await p.evaluate(() => { const s = document.querySelector('#strength'); s.value = '2.5'; s.dispatchEvent(new Event('input', { bubbles: true })); });
    await p.waitForTimeout(200);
    console.log(file.split('/').pop(), 'bar511 @2.5:', await read());
    await p.evaluate(() => { localStorage.clear(); });
    await p.close();
  }
  await b.close();
})();
