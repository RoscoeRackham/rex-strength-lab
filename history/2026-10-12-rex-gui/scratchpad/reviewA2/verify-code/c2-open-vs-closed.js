const { chromium, EXE, settle, rex, open } = require('./h.js');
(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  for (const name of process.argv.slice(2)) {
    const file = __dirname + '/pages/' + name + '.html';
    const out = [];
    for (const duoOpen of [false, true]) {
      const page = await open(browser, file, { duoOpen, duoAction: 'arm', action: 'throw' });
      const atLoad = await rex(page);
      await page.click('#tab-jump'); await page.waitForTimeout(300); await page.click('#tab-throw'); await page.waitForTimeout(500); await settle(page, 'bay');
      const redrawn = await rex(page);
      out.push('duoOpen=' + duoOpen + ' load: ' + atLoad.verdict + ' | ' + atLoad.effort.slice(0, 40) + '  || after Jump->Throw: ' + redrawn.verdict + ' | ' + redrawn.effort.slice(0, 60));
      await page.close();
    }
    console.log('== ' + name + '\n  ' + out.join('\n  '));
  }
  await browser.close();
})();
