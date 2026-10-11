const { chromium, CHROME, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [scheme, theme] of [['light', null], ['dark', null], ['light', 'dark'], ['dark', 'light']]) {
    const { ctx, p } = await open(browser, { w: 390, h: 844, scheme, theme, fonts: false });
    const r = await p.evaluate(() => { const cs = getComputedStyle(document.body); const pat = document.querySelector('#hatchVoid rect'); const meat = document.querySelector('.fig svg .wallr'); return { bg: cs.backgroundColor, fg: cs.color, colorScheme: getComputedStyle(document.documentElement).colorScheme, hatchFill: pat && getComputedStyle(pat).fill, wall: meat && getComputedStyle(meat).fill, viewer: getComputedStyle(document.querySelector('.viewer')).backgroundColor, input: getComputedStyle(document.getElementById('tH')).backgroundColor }; });
    console.log(scheme, theme || '-', JSON.stringify(r));
    await ctx.close();
  }
  await browser.close();
})();
