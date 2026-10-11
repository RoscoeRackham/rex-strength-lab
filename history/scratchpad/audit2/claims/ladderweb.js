const { open } = require('./harness');
const fs = require('fs');
(async () => {
  const { browser, page, errs } = await open();
  const cfgs = [
    { mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', size: 2 },
    { mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', size: 2 },
    { mode: 'comic', surface: 'sand', groundHolds: false, anchor: 'friction', size: 2 },
    { mode: 'comic', surface: 'granite', groundHolds: false, anchor: 'friction', size: 2 },
    { mode: 'comic', surface: 'concrete', groundHolds: true, anchor: 'friction', size: 2 },
    { mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'bolted', size: 2 },
    { mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', size: 0.4 },
    { mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', size: 50 },
    { mode: 'real', surface: 'sand', groundHolds: false, anchor: 'friction', size: 2 },
    { mode: 'real', surface: 'granite', groundHolds: false, anchor: 'braced', size: 2 },
    { mode: 'real', surface: 'granite', groundHolds: false, anchor: 'friction', size: 0.4 },
    { mode: 'real', surface: 'concrete', groundHolds: true, anchor: 'bolted', size: 50 },
    { mode: 'comic', surface: 'sand', groundHolds: false, anchor: 'friction', size: 50 },
  ];
  const out = [];
  for (const cfg of cfgs) {
    await page.evaluate((c) => window.__set(Object.assign({ tab: 'lift' }, c)), cfg);
    await page.waitForFunction(() => true);
    // wait for ladder timer + compute
    await page.waitForTimeout(400);
    let prev = '';
    for (let i = 0; i < 200; i++) {
      const cur = await page.evaluate(() => document.querySelector('#ladder-viz').innerText + '|' + document.querySelector('#ladder-never').innerText + [...document.querySelectorAll('#ladder-viz .mk')].map((g) => g.getAttribute('aria-label')).join(';'));
      if (cur === prev && i > 2) break; prev = cur; await page.waitForTimeout(300);
    }
    const lad = await page.evaluate(() => ({
      marks: [...document.querySelectorAll('#ladder-viz .mk')].map((g) => g.getAttribute('aria-label')),
      never: document.querySelector('#ladder-never').innerText,
    }));
    out.push({ cfg, lad });
    console.log('\n' + JSON.stringify(cfg));
    for (const m of lad.marks) console.log('  ' + m);
    console.log('  NEVER: ' + lad.never.replace(/\n/g, ' / '));
  }
  fs.writeFileSync('ladder_web.json', JSON.stringify(out));
  console.log(errs);
  await browser.close();
})();
