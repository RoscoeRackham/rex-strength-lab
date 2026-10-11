const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const st = { logKg: 20, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 };
  const ctx = await browser.newContext({ viewport: { width: 390, height: 900 } });
  await ctx.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  const page = await ctx.newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1000);
  const r = await page.evaluate(() => {
    const v = [...document.querySelectorAll('#bay .tile .v')].find(n => /Krakatoa/.test(n.textContent));
    const cs = getComputedStyle(v);
    const tile = v.closest('.tile');
    const range = document.createRange(); range.selectNodeContents(v);
    // width of "Krakatoa" alone
    const sp = document.createElement('span'); sp.textContent = 'Krakatoa'; sp.style.cssText = 'white-space:nowrap'; v.appendChild(sp); const kw = sp.getBoundingClientRect().width; sp.remove();
    const sp2 = document.createElement('span'); sp2.textContent = '1883 Krakatoa'; sp2.style.cssText = 'white-space:nowrap'; v.appendChild(sp2); const kw2 = sp2.getBoundingClientRect().width; sp2.remove();
    return { html: v.outerHTML, vW: v.clientWidth, tileW: tile.clientWidth, ow: cs.overflowWrap, wb: cs.wordBreak, ws: cs.whiteSpace, tw: cs.textWrap || cs.textWrapMode, font: cs.font, kw, kw2, chars: [...v.textContent].map(c => c.charCodeAt(0) > 127 ? c.charCodeAt(0).toString(16) : c).join('') };
  });
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})();
