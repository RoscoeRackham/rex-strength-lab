// (a) classic scrollbars: is there a scrollbar cue when not hidden? (b) a candidate fix injected into a copy.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const D = __dirname;

const FIX_CSS = `
.more-below { display: none; }
@media (min-width: 920px) {
  .panel-controls.has-more .more-below { display: block; position: sticky; bottom: -16px; margin: 12px -16px -16px; width: calc(100% + 32px); padding: 22px 16px 10px; border: 0; border-radius: 0 0 var(--r) var(--r); background: linear-gradient(to bottom, transparent, var(--surface) 40%); font: inherit; font-size: .85rem; font-weight: 700; color: var(--ink); text-align: center; cursor: pointer; }
}`;
const FIX_JS = `
(function () {
  const aside = document.querySelector('.panel-controls');
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'more-below'; btn.tabIndex = -1; btn.setAttribute('aria-hidden', 'true');
  aside.append(btn);
  const parts = [['Ground', '#ground-sec'], ['Their powers', '#powers']];
  const check = () => {
    const more = aside.scrollHeight - aside.clientHeight - aside.scrollTop > 4;
    aside.classList.toggle('has-more', more);
    if (more) {
      const bottom = aside.getBoundingClientRect().bottom;
      const hidden = parts.filter(([, s]) => document.querySelector(s).getBoundingClientRect().top > bottom - 40).map(([n]) => n);
      btn.textContent = 'More below' + (hidden.length ? ': ' + hidden.join(', ') : '') + ' \\u2193';
    }
  };
  btn.addEventListener('click', () => aside.scrollTo({ top: aside.scrollHeight }));
  aside.addEventListener('scroll', check, { passive: true });
  addEventListener('resize', check);
  new ResizeObserver(check).observe(aside);
  for (const c of aside.children) new ResizeObserver(check).observe(c);
  check();
})();`;

(async () => {
  // (a) classic scrollbars
  {
    const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', ignoreDefaultArgs: ['--hide-scrollbars'] });
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto('file://' + path.join(D, 'branch.html'));
    await page.waitForTimeout(1500);
    await page.evaluate(() => scrollTo(0, 600));
    await page.waitForTimeout(200);
    const sb = await page.$eval('.panel-controls', (a) => a.offsetWidth - a.clientWidth - 2);
    console.log('classic scrollbars: aside scrollbar width', sb);
    await page.screenshot({ path: path.join(D, 'classic-branch-1366x768.png') });
    await browser.close();
  }
  // (b) fix
  const raw = fs.readFileSync(path.join(D, 'branch.html'), 'utf8');
  const fixed = raw.replace('</body></html>', '<style>' + FIX_CSS + '</style><script>' + FIX_JS + '</script></body></html>');
  fs.writeFileSync(path.join(D, 'branch-fix.html'), fixed);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h] of [[1366, 768], [1280, 900], [1920, 1080], [390, 844], [1280, 1400]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('file://' + path.join(D, 'branch-fix.html'));
    await page.waitForTimeout(1500);
    await page.evaluate(() => scrollTo(0, 600));
    await page.waitForTimeout(200);
    const st = () => page.evaluate(() => { const b = document.querySelector('.more-below'); const r = b.getBoundingClientRect(); const a = document.querySelector('.panel-controls'); return { shown: getComputedStyle(b).display !== 'none' && r.height > 0, text: b.textContent, btnBottom: Math.round(r.bottom), asideBottom: Math.round(a.getBoundingClientRect().bottom), hscroll: document.documentElement.scrollWidth > innerWidth }; });
    const before = await st();
    if (w === 1366) await page.screenshot({ path: path.join(D, `fix-${w}x${h}-before.png`) });
    let after = null;
    if (before.shown) {
      await page.click('.more-below');
      await page.waitForTimeout(300);
      after = await st();
      const powersVis = await page.evaluate(() => { const el = document.querySelector('#powers > summary'); const b = el.getBoundingClientRect(); const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!e && el.contains(e); });
      after.powersVisible = powersVis;
      if (w === 1366) await page.screenshot({ path: path.join(D, `fix-${w}x${h}-after.png`) });
      // open Their powers then scroll back up: cue returns
      await page.evaluate(() => { document.querySelector('.panel-controls').scrollTop = 0; });
      await page.waitForTimeout(200);
      after.backAtTop = await st();
    }
    console.log(`fix ${w}x${h}`, JSON.stringify({ before, after }), errs.length ? 'ERR ' + errs.join(' | ') : '');
    await page.close();
  }
  await browser.close();
})();
