// 1280x700 and 1280x720: close Size and density, then click the middle of the 'Their powers' summary text
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const file of [process.argv[2] || 'branch.html']) for (const h of [700, 720]) {
    const { page } = await open(browser, { w: 1280, h, file });
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(300);
    await page.click('#setup > summary'); await page.waitForTimeout(400);
    const p = await page.evaluate(() => { const s = document.querySelector('#powers > summary span').getBoundingClientRect(); const x = s.left + s.width / 2, y = s.top + s.height / 2; const hit = document.elementFromPoint(x, y); return { x, y, hit: hit.id || hit.tagName + ':' + hit.textContent.slice(0, 20) }; });
    await page.mouse.click(p.x, p.y); await page.waitForTimeout(600);
    const after = await page.evaluate(() => ({ powersOpen: document.getElementById('powers').open, cue: document.getElementById('more-below').hidden ? 'hidden' : 'shown' }));
    console.log(file, '1280x' + h, 'click on the middle of "Their powers":', JSON.stringify(p), '->', JSON.stringify(after));
    await page.context().close();
  }
  await browser.close();
})();
