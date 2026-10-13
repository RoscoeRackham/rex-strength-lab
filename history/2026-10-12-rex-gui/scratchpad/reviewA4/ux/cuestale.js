// Does the cue follow content changes inside the sidebar that are not a scroll, a details toggle or a resize?
const { open, launch } = require('./h.js');
(async () => {
  const browser = await launch();
  const st = (page) => page.evaluate(() => { const a = document.querySelector('.panel-controls'), cue = document.getElementById('more-below');
    const below = a.scrollHeight - a.clientHeight - a.scrollTop;
    // real content below the box's bottom edge, the cue's own space left out
    const box = a.getBoundingClientRect(); const kids = Array.from(a.querySelectorAll('input, select, button:not(#more-below), .hint, summary')).filter((n) => n.getClientRects().length && n.getBoundingClientRect().top > box.bottom - 2);
    return { cueHidden: cue.hidden, cueText: cue.textContent, scrollTop: Math.round(a.scrollTop), below: Math.round(below), realBelow: kids.map((n) => n.id || n.tagName).slice(0, 6) }; });
  for (const [w, h] of [[1280, 900], [1366, 768]]) {
    const { page, errs } = await open(browser, { w, h });
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(300);
    // scroll the sidebar to its end: the cue hides
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; });
    await page.waitForTimeout(300);
    console.log(w + 'x' + h + ' at the end:', JSON.stringify(await st(page)));
    // pick a growth mode from the keyboard (no scroll, no toggle): the growth controls appear below the menu
    await page.focus('#absorb');
    await page.selectOption('#absorb', 'gradual');
    await page.waitForTimeout(500);
    console.log(w + 'x' + h + ' after Absorbed -> Gradual growth:', JSON.stringify(await st(page)));
    // back to the ocean
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; });
    await page.waitForTimeout(300);
    await page.selectOption('#absorb', 'ocean');
    await page.waitForTimeout(500);
    console.log(w + 'x' + h + ' after back to ocean:', JSON.stringify(await st(page)));
    // a long powers summary: turn on every switch from the top
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = 0; });
    await page.waitForTimeout(300);
    console.log(w + 'x' + h + ' top:', JSON.stringify(await st(page)));
    if (errs.length) console.log(errs);
    await page.context().close();
  }
  // Size and density closed at 1280x900: does everything fit, and is the cue hidden?
  {
    const { page } = await open(browser, { w: 1280, h: 900 });
    await page.click('#setup > summary');
    await page.waitForTimeout(400);
    console.log('1280x900 Size and density closed:', JSON.stringify(await st(page)));
    // now open Their powers by keyboard (toggle event)
    await page.focus('#powers > summary'); await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    console.log('1280x900 then Their powers opened:', JSON.stringify(await st(page)));
    // turning on real muscle changes the mode hint length (no toggle, no scroll)
    await page.evaluate(() => { const a = document.querySelector('.panel-controls'); a.scrollTop = a.scrollHeight; });
    await page.waitForTimeout(300);
    console.log('1280x900 at end:', JSON.stringify(await st(page)));
    await page.click('#mode-real'); await page.waitForTimeout(600);
    console.log('1280x900 after Real muscle:', JSON.stringify(await st(page)));
    await page.context().close();
  }
  await browser.close();
})();
