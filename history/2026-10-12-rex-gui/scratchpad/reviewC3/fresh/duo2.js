const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, settle } = await open(+process.argv[2] || 1280);
  const runs = JSON.parse(process.argv[3]);
  for (const st of runs) {
    await load(Object.assign({ duoOpen: true }, st), false);
    await page.waitForTimeout(500); try { await settle(page, 'duo-bay'); } catch (e) {}
    await page.waitForTimeout(3000);
    const t = await page.evaluate(() => document.getElementById('duo-bay').innerText);
    console.log('=== ' + JSON.stringify(st) + '\n' + t.slice(0, +process.argv[4] || 3000));
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
