const { open } = require('./pagelib.js');
(async () => {
  for (const n of ['base', 'fix08']) {
    const P = await open(__dirname + '/pmut/' + n + '.html');
    await P.load({ duoOpen: true, duoAction: 'catch', mode: 'real' }, 'bay'); await P.settle('duo-bay');
    await P.page.evaluate(() => { document.getElementById('powers').open = true; });
    await P.page.focus('#air-absorb');
    for (let i = 0; i < 20; i++) { await P.page.keyboard.press('ArrowLeft'); await P.page.waitForTimeout(60); }
    await P.page.waitForTimeout(400); await P.settle('duo-bay'); await P.settle('bay');
    const r = await P.page.evaluate(() => ({ duo: document.querySelector('#duo-bay .effort-read').textContent.replace(/\s+/g, ' ').slice(0, 120), solo: document.querySelector('#bay .effort-read') && document.querySelector('#bay .effort-read').textContent.replace(/\s+/g, ' ').slice(0, 120), air: document.getElementById('air-absorb').value }));
    console.log(n, JSON.stringify(r));
    await P.close();
  }
})();
