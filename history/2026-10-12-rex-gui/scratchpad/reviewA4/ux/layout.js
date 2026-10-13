// The viewport x theme matrix: overflow, sidebar order, Size and density default, the cue, the element closed and
// open, clipped text; screenshots of the sidebar and the element.
const { open, launch } = require('./h.js');
const fs = require('fs');
fs.mkdirSync(__dirname + '/shots', { recursive: true });
const SIZES = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900], [932, 430]];
const THEMES = [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']];
(async () => {
  const browser = await launch();
  for (const [w, h] of SIZES) for (const [scheme, theme] of THEMES) {
    const tag = w + 'x' + h + '-' + scheme + (theme ? '-dt' + theme : '');
    const { page, errs } = await open(browser, { w, h, scheme, theme });
    const probe = () => page.evaluate(() => {
      const aside = document.querySelector('aside.panel-controls');
      const secs = Array.from(aside.querySelectorAll('details, .side-sec')).map((n) => n.id);
      const order = ['strength', 'setup', 'ground-sec', 'powers'].map((id) => { const n = document.getElementById(id); return n ? Math.round(n.getBoundingClientRect().top + aside.scrollTop) : null; });
      const cue = document.getElementById('more-below');
      const cs = getComputedStyle(cue);
      // text that is cut off: an element whose scrollWidth exceeds its clientWidth with overflow hidden, or that sticks out of the viewport
      const vw = document.documentElement.clientWidth;
      const out = [];
      for (const n of document.querySelectorAll('body *')) {
        if (!n.getClientRects().length) continue;
        const r = n.getBoundingClientRect();
        if (r.width && (r.right > vw + 1 || r.left < -1) && !n.closest('.sr-only') && getComputedStyle(n).position !== 'fixed') out.push((n.id || n.tagName + '.' + n.className).slice(0, 40) + ' ' + Math.round(r.left) + '-' + Math.round(r.right));
      }
      return { overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, secs: secs.join(','), order, setupOpen: document.getElementById('setup').open, powersOpen: document.getElementById('powers').open, duoOpen: document.getElementById('duo').open,
        cue: cue.hidden ? 'hidden' : cs.display === 'none' ? 'display:none' : cue.textContent, sticky: getComputedStyle(aside).position, asideScroll: aside.scrollHeight - aside.clientHeight, outside: out.slice(0, 5), duoSum: document.getElementById('duo-sum').textContent };
    });
    const a = await probe();
    console.log(tag, 'closed', JSON.stringify(a));
    await page.screenshot({ path: __dirname + '/shots/first-' + tag + '.png' });
    // open Their powers and the element and Ollie's sub-panel
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('duo').open = true; document.getElementById('ollie-setup').open = true; });
    await page.waitForTimeout(3000);
    const b = await probe();
    console.log(tag, 'open  ', JSON.stringify({ overflow: b.overflow, cue: b.cue, outside: b.outside }));
    if (/^(390|1280)/.test(tag) && !theme) {
      const duo = await page.evaluate(() => { const r = document.getElementById('duo').getBoundingClientRect(); return { y: r.top + scrollY, h: r.height }; });
      await page.screenshot({ path: __dirname + '/shots/duo-' + tag + '.png', fullPage: true, clip: { x: 0, y: duo.y - 10, width: w, height: Math.min(duo.h + 20, 4000) } });
    }
    if (errs.length) console.log('   errs', errs);
    await page.context().close();
  }
  await browser.close();
})();
