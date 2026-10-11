const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const css = `:root{--good-ink:#0a7a0a;--warn-ink:#8a5c00}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--good-ink:#3fbf4f;--warn-ink:#fab219}}
:root[data-theme="dark"]{--good-ink:#3fbf4f;--warn-ink:#fab219}
.badge.verified{color:var(--good-ink)}.badge.disputed,.badge.claimed{color:var(--warn-ink)}`;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.evaluate(c => { const s = document.createElement("style"); s.textContent = c; document.body.appendChild(s); }, css);
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => {
      const p = c => c.match(/\d+(\.\d+)?/g).map(Number);
      const lum = ([r,g,b]) => { const f = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4) }; return .2126*f(r)+.7152*f(g)+.0722*f(b) };
      const out = {};
      for (const s of ['verified','claimed','disputed']) { const b = document.querySelector('.badge.'+s); const fg = p(getComputedStyle(b).color); const bg = p(getComputedStyle(b.closest('.feat,.table-wrap')).backgroundColor); const A=lum(fg),B=lum(bg); out[s]=[getComputedStyle(b).color, ((Math.max(A,B)+.05)/(Math.min(A,B)+.05)).toFixed(2)]; }
      return out;
    });
    console.log(scheme, JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
})();
