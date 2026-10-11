const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const { ctx, p } = await open(browser, { w: 390, h: 844, dpr: 3, scheme, extraHead: '<style>body{margin:0}[hidden]{display:none!important}</style>' });
    await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    for (const id of ['hSame', 'hReal', 'vFront']) {
      await p.focus('#vSide'); // move then come back by keyboard so :focus-visible applies
      await p.evaluate((id) => { document.getElementById(id).focus(); }, id);
      await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Tab');
      const info = await p.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); const seg = a.parentElement.getBoundingClientRect(); return { id: a.id, fv: a.matches(':focus-visible'), outline: getComputedStyle(a).outlineStyle, segOverflow: getComputedStyle(a.parentElement).overflow, b: [r.left, r.top, r.width, r.height], s: [seg.left, seg.top, seg.width, seg.height] }; });
      console.log(scheme, JSON.stringify(info));
      await p.screenshot({ path: path.join(DIR, 'r-segfocus-' + scheme + '-' + id + '.png'), clip: { x: info.s[0] - 10, y: info.s[1] - 10, width: info.s[2] + 20, height: info.s[3] + 20 } });
    }
    await ctx.close();
  }
  await browser.close();
})();
