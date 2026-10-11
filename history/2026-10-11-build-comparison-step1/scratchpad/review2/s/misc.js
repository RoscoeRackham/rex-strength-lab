const { open } = require('./h.js');
(async () => {
  const { browser, p, errors } = await open({ w: 1280, fonts: false });
  await p.click('#zHum'); await p.waitForTimeout(200);
  console.log('F16 close-up off-scale rows:', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('#fp .off')].map((o) => o.textContent).filter((t) => /9\d\d|1,/.test(t)))));
  // F1: open a drawer, toggle controls, open another
  await p.click('.fig[data-id="ronnie_coleman"]');
  for (const b of ['#hReal', '#vSide', '#vFront', '#hSame']) await p.click(b);
  const d1 = await p.evaluate(() => ({ exists: !!document.getElementById('drawer'), hidden: document.getElementById('drawer').hidden, sel: document.getElementById('drawerH') && document.getElementById('drawerH').textContent }));
  await p.click('.fig[data-id="phil_heath"]');
  const d2 = await p.evaluate(() => document.getElementById('drawerH').textContent);
  console.log('F1 drawer after toggles:', JSON.stringify(d1), '| then Phil Heath opens:', d2, '| errors', JSON.stringify(errors.filter((e) => !/ERR_FAILED/.test(e))));
  await browser.close();
})();
