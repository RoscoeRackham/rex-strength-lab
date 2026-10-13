const L = require('./lib.js');
(async () => {
  const b = await L.chromium.launch({ executablePath: L.CHROME });
  const p = await L.open(b, L.NEW(), { duoOpen: true });
  await p.evaluate(() => { document.querySelector('#ollie-setup').open = true; });
  await p.click('#o-own');
  await p.waitForTimeout(300);
  const g = async () => p.evaluate(() => ({ duo: document.querySelector('#duo-sum').textContent, ollie: document.querySelector('#ollie-sum').textContent }));
  console.log(await g());
  await p.check('#o-inf'); await p.waitForTimeout(300);
  console.log(await g());
  // Ollie panel text
  console.log(await p.evaluate(() => document.querySelector('#ollie-setup').innerText));
  await b.close();
})();
