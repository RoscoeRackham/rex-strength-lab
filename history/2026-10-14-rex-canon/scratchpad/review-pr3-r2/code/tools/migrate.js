const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PG = process.argv[2];
const url = (n) => pathToFileURL(path.join(PG, n + '.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  const go = async (n) => { await page.goto(url(n)); await page.waitForTimeout(700); };
  const setRaw = async (raw) => { await page.evaluate((r) => { if (r === null) localStorage.clear(); else localStorage.setItem('rex-lab-v1', r); }, raw); };
  const read = () => page.evaluate(() => { let s = null; try { s = JSON.parse(localStorage.getItem('rex-lab-v1')); } catch (e) { s = 'BAD'; } const sw = document.getElementById('sw-passenger');
    return { sw: sw ? sw.checked : null, sp: s && s.safePassenger, v: s && s.saveV, m: s && s.m, oM: s && s.oM, keys: s ? Object.keys(s).length : 0, sum: (document.getElementById('powers-sum') || {}).textContent }; });
  await go('HEAD');
  // shared origin check
  await setRaw('{"probe":1}'); await go('origin_main'); const shared = await page.evaluate(() => localStorage.getItem('rex-lab-v1')); console.log('origin shared:', shared);
  const cases = [['none', null], ['{}', '{}'], ['nomark sp false', '{"safePassenger":false}'], ['nomark sp true', '{"safePassenger":true}'], ['mark1 false', '{"safePassenger":false,"saveV":1}'],
    ['mark2 false', '{"safePassenger":false,"saveV":2}'], ['mark2 true', '{"safePassenger":true,"saveV":2}'], ['mark3 false', '{"safePassenger":false,"saveV":3}'], ['mark3 true', '{"safePassenger":true,"saveV":3}'],
    ['mark3 sp missing', '{"saveV":3}'], ['mark3 sp "no"', '{"safePassenger":"no","saveV":3}'], ['mark3 sp 0', '{"safePassenger":0,"saveV":3}'], ['mark3 sp null', '{"safePassenger":null,"saveV":3}'],
    ['mark "3" false', '{"safePassenger":false,"saveV":"3"}'], ['mark 3.0 false', '{"safePassenger":false,"saveV":3.0}'], ['mark 4 false', '{"safePassenger":false,"saveV":4}'], ['mark null false', '{"safePassenger":false,"saveV":null}'], ['mark 2.9999 false', '{"safePassenger":false,"saveV":2.9999}'], ['mark -1', '{"safePassenger":false,"saveV":-1}'],
    ['nomark m3007', '{"m":3007,"oM":3007,"safePassenger":false}'], ['mark2 m3007', '{"m":3007,"oM":3007,"saveV":2,"safePassenger":false}'], ['mark3 m3007', '{"m":3007,"oM":3007,"saveV":3,"safePassenger":false}'], ['mark3 m2700', '{"m":2700,"oM":2700,"saveV":3}'],
    ['array', '[1,2]'], ['number', '5'], ['string', '"abc"'], ['bad json', '{bad'], ['true', 'true'], ['null literal', 'null']];
  for (const [name, raw] of cases) { await go('HEAD'); await setRaw(raw); await go('HEAD'); const r = await read(); await go('HEAD'); const r2 = await read(); console.log(name.padEnd(20), JSON.stringify(r), 'reload2', JSON.stringify([r2.sw, r2.sp, r2.v])); }
  // saves written by the older pages themselves
  for (const pg of ['pre31', 'origin_main', 'origin_claude_canon-2-recoil']) {
    for (const tick of [null, false, true]) {
      await go(pg); await setRaw(null); await go(pg);
      if (tick !== null) { await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.setChecked('#sw-passenger', tick); await page.waitForTimeout(300); }
      // and a visitor's own 3,007 kg on the older page (m) is only meaningful marked; use the mass box? keep simple
      const w = await page.evaluate(() => localStorage.getItem('rex-lab-v1'));
      const ws = JSON.parse(w);
      await go('HEAD'); const r = await read();
      console.log(pg.padEnd(30), 'ticked', String(tick).padEnd(5), 'wrote', JSON.stringify({ sp: ws.safePassenger, v: ws.saveV, m: ws.m }), '-> PR3', JSON.stringify([r.sw, r.sp, r.v, r.m]));
    }
  }
  // the branch's own: untick on PR3, reload twice
  await go('HEAD'); await setRaw(null); await go('HEAD'); await page.evaluate(() => { document.getElementById('powers').open = true; }); await page.setChecked('#sw-passenger', false); await page.waitForTimeout(300);
  const w3 = await page.evaluate(() => localStorage.getItem('rex-lab-v1')); await go('HEAD'); const a = await read(); await go('HEAD'); const b = await read();
  console.log('PR3 untick wrote', w3.match(/"safePassenger":\w+|"saveV":\d+/g).join(' '), '-> reload', JSON.stringify([a.sw, a.sp, a.v, a.sum]), 'reload2', JSON.stringify([b.sw, b.sp, b.v]));
  // saved keys equal DEFAULTS keys?
  await setRaw('{"foo":1,"group":"duo","safePassenger":false}'); await go('HEAD'); const ks = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('rex-lab-v1'))).sort().join(','));
  console.log('saved keys', ks);
  console.log('errors', JSON.stringify(errs.slice(0, 5)));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
