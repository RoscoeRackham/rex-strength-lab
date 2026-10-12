const { open, launch } = require('./lib.js');
(async () => {
  const b = await launch();
  const { page } = await open(b, { action: 'throw', obj: 'pickup', surface: 'sand', mode: 'real', inf: true });
  await page.click('#tab-' + process.argv[2]);
  await page.evaluate(() => { window.__long = []; });
  const t0 = Date.now();
  // probe input latency: time a trivial evaluate round trip every 250 ms
  const lat = [];
  while (Date.now() - t0 < 20000) { const a = Date.now(); await page.evaluate(() => 1); lat.push(Date.now() - a); await page.waitForTimeout(250); }
  const long = await page.evaluate(() => window.__long);
  console.log('after switching to', process.argv[2], ': long tasks in 20 s n=', long.length, 'sum', long.reduce((a, c) => a + c, 0), 'ms, max', Math.max(0, ...long), '; evaluate round-trip max', Math.max(...lat), 'ms');
  await b.close();
})();
