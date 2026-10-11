const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p, errs } = await open(browser, 1280, 900, 'light');
  const seen = [];
  for (let i = 0; i < 70; i++) {
    await p.keyboard.press('Tab');
    const a = await p.evaluate(() => {
      const e = document.activeElement; const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return { d: e.tagName + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : '') + (e.getAttribute('role') ? '[' + e.getAttribute('role') + ']' : '') + ' "' + (e.innerText || e.value || '').slice(0, 25).replace(/\n/g, ' ') + '"',
        outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor, fv: e.matches(':focus-visible'), inView: r.top >= 0 && r.bottom <= innerHeight };
    });
    seen.push(a);
  }
  seen.forEach((a, i) => console.log(i, a.d, '|', a.outline, a.fv ? 'fv' : '', a.inView ? '' : 'OFFSCREEN'));
  // arrow keys on radiogroup
  await p.focus('#uImp');
  await p.keyboard.press('ArrowRight');
  console.log('after ArrowRight on units:', await p.evaluate(() => [document.activeElement.id, document.getElementById('uMet').getAttribute('aria-checked')]));
  await p.keyboard.press('Space');
  console.log('after Space:', await p.evaluate(() => [document.activeElement.id, document.getElementById('uMet').getAttribute('aria-checked')]));
  // girth li: Enter
  await p.focus('.g[data-site="waist"]');
  console.log('focused li on:', await p.evaluate(() => [...document.querySelectorAll('.on')].map(e => e.tagName + '.' + e.className).join(',')));
  // escape focus: after blur, highlight stays?
  await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
  console.log('after tabbing out of list, active=', await p.evaluate(() => document.activeElement.tagName + '#' + document.activeElement.id + '.' + document.activeElement.className), 'on:', await p.evaluate(() => [...document.querySelectorAll('.on')].map(e => e.tagName + '.' + e.className + ' ' + e.getAttribute('data-site')).join(',')));
  console.log('errs', errs);
  await ctx.close(); await browser.close();
})();
