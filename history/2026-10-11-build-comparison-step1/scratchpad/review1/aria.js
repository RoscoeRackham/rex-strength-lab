'use strict';
const { chromium, CHROME, DIR, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 390, h: 844, fonts: false });
  for (const id of ['colossus_armored', 'thor', 'thing', 'luke_cage', 'rex', 'darkseid']) {
    const r = await p.evaluate((id) => { const b = document.querySelector('.fig[data-id="' + id + '"]'); const chips = Array.from(b.querySelectorAll('.chip')).map((c) => c.textContent); const flags = Array.from(b.querySelectorAll('.flag')).map((c) => c.textContent); const fr = document.querySelector('#fp [data-open="' + id + '"]'); return { cellLabel: b.getAttribute('aria-label'), visibleChips: chips, visibleFlags: flags, forestLabel: fr && fr.getAttribute('aria-label') }; }, id);
    console.log(id, JSON.stringify(r));
  }
  const snap = await p.accessibility.snapshot({ root: await p.$('.fig[data-id="colossus_armored"]') });
  console.log('a11y tree of the Colossus (armoured) cell:', JSON.stringify(snap));
  await ctx.close(); await browser.close();
})();
