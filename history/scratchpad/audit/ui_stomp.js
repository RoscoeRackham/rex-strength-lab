const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = 'file://' + __dirname + '/app_built.html';
  for (const st of [{ logKg: 15 }, { logKg: 20 }, { logKg: 25 }, { logKg: 34 }, { inf: true }]) {
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('dino-lab-v1', JSON.stringify(Object.assign({ action: 'stomp', mode: 'comic', surface: 'concrete', inf: false }, s))), st);
    await page.reload();
    const txt = await page.$eval('#bay', (e) => e.innerText);
    const lines = txt.split('\n').filter((l) => /stomp lands|Energy into|crater|Hole|Compared|J\b|quake|magnitude/i.test(l)).slice(0, 14);
    console.log('===', JSON.stringify(st)); console.log(lines.join('\n'));
  }
  await browser.close();
})();
