const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const prev = process.argv[2] || '/home/user/dino-strength-sim/dist/preview.html';
const widths = (process.argv[3] || '320,340,360,375,390').split(',').map(Number);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', proxy: { server: process.env.HTTPS_PROXY } });
  for (const w of widths) {
    for (const scheme of ['light']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, colorScheme: scheme, ignoreHTTPSErrors: true });
      const page = await ctx.newPage();
      await page.goto('file://' + prev);
      await page.waitForTimeout(3000);
      const r = await page.evaluate(async () => {
        await document.fonts.ready;
        const fontOk = document.fonts.check('800 18px "Big Shoulders Display"');
        const faces = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight);
        const tabs = [...document.querySelectorAll('.tab')].map(b => {
          const cs = getComputedStyle(b);
          const range = document.createRange(); range.selectNodeContents(b);
          const tr = range.getBoundingClientRect(); const br = b.getBoundingClientRect();
          return { id: b.id, text: b.textContent, sw: b.scrollWidth, cw: b.clientWidth, over: b.scrollWidth - b.clientWidth,
            textW: +tr.width.toFixed(1), btnW: +br.width.toFixed(1), padL: cs.paddingLeft, padR: cs.paddingRight,
            textLeftGap: +(tr.left - br.left).toFixed(1), textRightGap: +(br.right - tr.right).toFixed(1), fontFamily: cs.fontFamily.slice(0,40), fs: cs.fontSize, sel: b.getAttribute('aria-selected') };
        });
        return { fontOk, faces: [...new Set(faces)], tabs, docOver: document.documentElement.scrollWidth - document.documentElement.clientWidth };
      });
      console.log(`== ${w}px ${scheme} fontOk=${r.fontOk} docOver=${r.docOver} faces=${JSON.stringify(r.faces)}`);
      for (const t of r.tabs) console.log(`  ${t.text.padEnd(7)} btnW=${t.btnW} textW=${t.textW} sw=${t.sw} cw=${t.cw} over=${t.over} gapL=${t.textLeftGap} gapR=${t.textRightGap} pad=${t.padL}/${t.padR} fs=${t.fs} sel=${t.sel}`);
      if (w === 320) { const el = await page.$('#tabs'); await el.screenshot({ path: path.join(__dirname, `tabs-${w}.png`) }); }
      await ctx.close();
    }
  }
  await browser.close();
})();
