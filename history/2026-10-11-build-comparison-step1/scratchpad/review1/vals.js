const { chromium, CHROME, open } = require('./lib');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 1280, h: 900, fonts: false });
  const v = await p.evaluate(() => {
    const bc = window.__bc;
    return {
      HUMAN_TOP: bc.HUMAN_TOP, MEAT: bc.MEAT,
      GAPS: bc.GAPS.map((g) => [g.from, g.to, g.below, g.above]),
      SEQ: bc.SEQ.map((s) => [s.kind, s.id, +(s.lo||0).toFixed(2), +(s.hi||0).toFixed(2), s.tag, s.title]),
      top: bc.LIST.filter((e) => e.score.value > 35 && e.score.value < 70).map((e) => [e.id, e.group, e.comparable, +e.score.lo.toFixed(2), +e.score.value.toFixed(2), +e.score.hi.toFixed(2)]),
      clusters: Array.from(document.querySelectorAll('#clusters button')).map((b) => b.textContent + ' @' + b.style.left),
      ruleEnd: (document.getElementById('real-men-end') || {}).textContent,
      lede: document.getElementById('lede').textContent,
    };
  });
  console.log(JSON.stringify(v, null, 1));
  await ctx.close(); await browser.close();
})();
