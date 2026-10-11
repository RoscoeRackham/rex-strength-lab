const { open, S } = require('./h.js');
(async () => {
  const { browser, p } = await open(1280, 900);
  await p.waitForTimeout(1000);
  const out = await p.evaluate(() => {
    const by = {}; window.__bc.LIST.forEach((e) => by[e.id] = e);
    return by;
  });
  const L = require(S + '/tree/build-comparison/data/limits.json');
  for (const it of L.items) {
    const ids = (it.met_by || []).filter((id) => out[id]);
    const sc = ids.map((id) => [id, out[id].score.value.toFixed(1)]);
    console.log(it.id, 'score', it.score, 'met_by', ids.length, 'below limit', ids.filter((id) => out[id].score.value < it.score).length, 'below 45', ids.filter((id) => out[id].score.value < 45).length);
    console.log('  ', sc.map((x) => x.join(':')).join(' '));
  }
  await browser.close();
})();
