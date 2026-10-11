const { open } = require('./render.js');
(async () => {
  const { browser, p } = await open(1280);
  await p.evaluate(() => document.getElementById('tool').scrollIntoView());
  await p.waitForFunction(() => /measures|No outline|Every width/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 });
  console.log(await p.evaluate(() => document.getElementById('targetStatus').textContent));
  await p.evaluate(() => document.getElementById('targetCopy').click());
  await p.waitForTimeout(500);
  console.log(await p.evaluate(() => document.getElementById('targetOut').value));
  console.log(await p.evaluate(() => document.getElementById('targetStatus').textContent));
  await browser.close();
})();
