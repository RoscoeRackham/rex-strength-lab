// Open every figure's details and save its text.
const { open } = require('./h.js');
(async () => {
  const { browser, p, errors } = await open({ w: 1280, fonts: false });
  const ids = await p.evaluate(() => window.__bc.LIST.map((e) => e.id));
  const out = {};
  for (const id of ids) {
    await p.click('.fig[data-id="' + id + '"]');
    await p.waitForSelector('#drawer:not([hidden])');
    out[id] = await p.evaluate(() => document.getElementById('drawer').innerText.replace(/\s+/g, ' '));
  }
  require('fs').writeFileSync(__dirname + '/../drawers.json', JSON.stringify(out, null, 1));
  console.log(Object.keys(out).length, 'drawers; errors', errors);
  await browser.close();
})();
