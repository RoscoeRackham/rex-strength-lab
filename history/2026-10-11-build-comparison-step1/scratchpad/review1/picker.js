'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 1280, h: 900, fonts: false });
  let choosers = 0;
  p.on('filechooser', () => { choosers++; });
  // keyboard: focus the select and press ArrowDown, as a keyboard user browsing options would
  await p.focus('#tExample');
  await p.keyboard.press('ArrowDown');
  await p.waitForTimeout(300);
  const s1 = await p.evaluate(() => ({ value: document.getElementById('tExample').value, sheet: document.getElementById('sheetName').textContent, status: document.getElementById('toolStatus').textContent.slice(0, 50) }));
  console.log('after ArrowDown on the select: file choosers opened =', choosers, JSON.stringify(s1));
  // cancelled dialog; now try to pick a file again via the select
  await p.selectOption('#tExample', 'file');
  await p.waitForTimeout(300);
  console.log('selecting "Choose a sheet…" again: file choosers opened =', choosers);
  await ctx.close(); await browser.close();
})();
