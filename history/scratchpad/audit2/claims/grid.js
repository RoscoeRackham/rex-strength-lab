// Usage: node grid.js <outfile> <json of config list filter>
const { open } = require('./harness');
const fs = require('fs');
const STR = [{ log: 1 }, { log: 2 }, { chip: 'human' }, { log: 3 }, { chip: 'spidey' }, { log: 4 }, { chip: 'hulk' }, { log: 6 }, { log: 9 }, { log: 12 }, { chip: 'secretwars' }, { log: 15 }, { log: 20 }, { chip: 'allstar' }, { chip: 'earth' }, { log: 25 }, { log: 30 }, { log: 34 }, { chip: 'inf' }];
const LIFT = ['car', 'shot', 'piano', 'eiffel', 'everest', 'moon', 'sun', 'sky', 'cloud', 'bar511'];
const THROW = [['baseball', [0, 45, 90]], ['shot', [37, 90]], ['car', [0, 45, 90]], ['tank', [30]], ['pyramid', [45]]];
const PULL = ['car', 'cc177', 'bus', 'bar511'];
(async () => {
  const out = process.argv[2];
  const cfgs = JSON.parse(process.argv[3]);
  const { browser, page, errs } = await open();
  const rows = [];
  for (const cfg of cfgs) {
    const t0 = Date.now();
    const res = await page.evaluate(({ cfg, STR, LIFT, THROW, PULL }) => {
      const rs = [];
      window.__set(cfg);
      for (const s of STR) {
        window.__set(s);
        const base = Object.assign({}, cfg, s);
        for (const o of LIFT) { window.__set({ tab: 'lift', obj: o }); rs.push(Object.assign({ cfg: Object.assign({}, base, { tab: 'lift', obj: o }) }, window.__snap())); }
        for (const [o, angs] of THROW) for (const a of angs) { window.__set({ tab: 'throw', obj: o, angle: a }); rs.push(Object.assign({ cfg: Object.assign({}, base, { tab: 'throw', obj: o, angle: a }) }, window.__snap())); }
        for (const tb of ['jump', 'stomp', 'punch', 'clap', 'sprint']) { window.__set({ tab: tb }); rs.push(Object.assign({ cfg: Object.assign({}, base, { tab: tb }) }, window.__snap())); }
        for (const o of PULL) { window.__set({ tab: 'pull', obj: o }); rs.push(Object.assign({ cfg: Object.assign({}, base, { tab: 'pull', obj: o }) }, window.__snap())); }
      }
      return rs;
    }, { cfg, STR, LIFT, THROW, PULL });
    for (const r of res) delete r.text;
    rows.push(...res);
    console.error(JSON.stringify(cfg), res.length, (Date.now() - t0) + 'ms');
  }
  fs.writeFileSync(out, JSON.stringify({ rows, errs }));
  await browser.close();
})();
