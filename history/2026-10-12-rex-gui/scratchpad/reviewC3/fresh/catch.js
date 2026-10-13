const open = require('./pw.js');
(async () => {
  const { browser, page, errs, load, settle } = await open(+process.argv[2] || 1280);
  const runs = JSON.parse(process.argv[3]);
  for (const st of runs) {
    await load(Object.assign({ duoOpen: true }, st), false);
    await page.waitForTimeout(800);
    await page.selectOption('#duo-effort', 'allout');
    await page.waitForTimeout(800); try { await settle(page, 'duo-bay'); } catch (e) {}
    await page.waitForTimeout(4000);
    const t = await page.evaluate(() => document.getElementById('duo-bay').innerText);
    console.log('=== ' + JSON.stringify(st));
    console.log(t.split('\n').filter((l) => / J\b|J\)|J,|J\.|ladder|freed|Energy/.test(l)).join('\n'));
  }
  console.log('ERRS', errs.slice(0, 5));
  await browser.close();
})();
