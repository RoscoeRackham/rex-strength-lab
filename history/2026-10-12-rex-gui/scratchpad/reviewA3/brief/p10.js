const { NEW, launch, open } = require('./lib.js');
(async () => {
  const b = await launch();
  const p = await open(b, NEW, null, { wait: 1200 });
  await p.evaluate(() => document.getElementById('powers').open = true);
  console.log(await p.locator('#powers').ariaSnapshot());
  console.log(await p.locator('#duo > summary').ariaSnapshot());
  console.log(await p.locator('#ground-sec').ariaSnapshot());
  await b.close();
})();
