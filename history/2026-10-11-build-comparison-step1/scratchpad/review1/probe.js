// Usage: node probe.js <versionDir> <outJson>
'use strict';
const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ver = process.argv[2], out = process.argv[3];
const dist = fs.readFileSync(path.join(ver, 'build-comparison/dist/index.html'), 'utf8');
const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + dist + '</body></html>';
const tmp = path.join(path.dirname(out), path.basename(out, '.json') + '.html');
fs.writeFileSync(tmp, html);
const R = {};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const w of [1280, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    await ctx.route(/fonts\.(googleapis|gstatic)/, (r) => r.abort());
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', (e) => errs.push(String(e.message)));
    p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await p.goto(pathToFileURL(tmp).href);
    await p.waitForFunction(() => document.querySelectorAll('#results tr').length > 5, null, { timeout: 60000 }).catch(() => {});
    const W = {};
    W.clusters = await p.evaluate(() => document.getElementById('clusters').innerText);
    if (w === 1280) {
      Object.assign(W, await p.evaluate(() => {
        const t = (sel) => { const e = document.querySelector(sel); return e ? e.innerText : null; };
        const bc = window.__bc;
        const o = {};
        o.lede = t('#lede');
        o.limitsNotes = t('#limitsNotes');
        o.limitCards = t('#limitCards');
        o.natCard = t('#natCard');
        o.scoreCard = t('#scoreCard');
        o.fatCard = t('#fatCard');
        o.stops = Array.from(document.querySelectorAll('#stops .stop')).map((s) => ({ id: s.id, head: (s.querySelector('.stop-head') || s).innerText }));
        o.forestRows = Array.from(document.querySelectorAll('#fp .fp-row')).map((r) => r.innerText.replace(/\n/g, ' | '));
        o.plates = {};
        ['brian_shaw', 'hulk_grey', 'kouri1995_nonusers'].forEach((id) => { const f = document.querySelector('.fig[data-id="' + id + '"]'); o.plates[id] = f ? f.innerText.replace(/\n/g, ' | ') : null; });
        o.toolStatus = t('#toolStatus'); o.results = t('#results');
        o.list = bc.LIST.map((e) => ({ id: e.id, group: e.group, lo: e.score.lo, v: e.score.value, hi: e.score.hi, mass: e.mass.value, bfst: e.bodyFat.status, hst: e.height.status, wst: e.mass.status, comp: e.comparable }));
        o.gaps = bc.GAPS.map((g) => ({ from: g.from, to: g.to, below: g.below, above: g.above }));
        o.HUMAN_TOP = bc.HUMAN_TOP; o.MEAT = bc.MEAT;
        return o;
      }));
      // drawers
      W.drawers = {};
      for (const id of ['brian_shaw', 'hulk_grey', 'kouri1995_nonusers', 'bruce_banner', 'rex', 'ollie', 'ansur2_m_p50', 'thing', 'withers1997', 'withers1997_natural', 'kraemer2020_elite_strongmen_dxa']) {
        const got = await p.evaluate((id) => { const f = document.querySelector('.fig[data-id="' + id + '"]') || document.querySelector('#fp [data-open="' + id + '"]'); if (!f) return null; f.click(); const d = document.getElementById('drawer'); return d && !d.hidden ? d.innerText : 'closed'; }, id);
        W.drawers[id] = got;
        await p.keyboard.press('Escape');
      }
      W.figIds = await p.evaluate(() => Array.from(document.querySelectorAll('.fig[data-id]')).map((f) => f.getAttribute('data-id')));
      // Close-up forest
      await p.click('#zHum');
      W.closeupForest = await p.evaluate(() => Array.from(document.querySelectorAll('#fp .fp-row, #fp > *')).map((r) => r.innerText.replace(/\n/g, ' | ')).filter((s) => /off this scale|924|920/.test(s)));
      await p.click('#zAll');
      // gap tiles
      W.gapTiles = await p.evaluate(() => Array.from(document.querySelectorAll('#stops .stop')).filter((s) => /gap|Score/.test(s.id + s.className)).map((s) => ({ id: s.id, cls: s.className, txt: s.innerText.slice(0, 900) })));
      // glance hatch vs ticks
      W.glance = await p.evaluate(() => {
        const g = document.getElementById('glance'); const X = g._X; const bc = window.__bc;
        const hatch = Array.from(g.querySelectorAll('rect')).filter((r) => /url\(#hatch/.test(r.getAttribute('fill') || '')).map((r) => [+r.getAttribute('x'), +r.getAttribute('x') + +r.getAttribute('width')]);
        const thing = bc.LIST.find((e) => e.id === 'thing'), thor = bc.LIST.find((e) => e.id === 'thor');
        return { hatch, thingX: X(thing.score.value), thorX: X(thor.score.value), cap: document.querySelector('.glance .cap').innerText };
      });
      // target tool
      await p.fill('#tTarget', '100');
      await p.click('#targetBtn');
      await p.waitForFunction(() => /measures/.test(document.getElementById('targetStatus').textContent), null, { timeout: 60000 }).catch(() => {});
      W.target100 = await p.evaluate(() => document.getElementById('targetStatus').textContent);
      // F1 drawer
      const f1 = [];
      const e0 = errs.length;
      await p.evaluate(() => document.querySelector('.fig[data-id="ronnie_coleman"]').click());
      f1.push('open: ' + await p.evaluate(() => !document.getElementById('drawer').hidden));
      await p.click('#hReal');
      f1.push('after hReal drawer exists: ' + await p.evaluate(() => !!document.getElementById('drawer')));
      await p.evaluate(() => document.querySelector('.fig[data-id="phil_heath"]').click());
      f1.push('after click phil: ' + await p.evaluate(() => { const d = document.getElementById('drawer'); return d ? (!d.hidden && (document.getElementById('drawerH') || {}).textContent) : 'no drawer'; }));
      await p.click('#vSide'); await p.click('#vFront'); await p.click('#hSame');
      await p.evaluate(() => document.querySelector('.fig[data-id="rex"]').click());
      f1.push('after Side/Front/Same, click rex: ' + await p.evaluate(() => { const d = document.getElementById('drawer'); return d ? (!d.hidden && (document.getElementById('drawerH') || {}).textContent) : 'no drawer'; }));
      f1.push('errors: ' + JSON.stringify(errs.slice(e0)));
      W.F1 = f1;
    }
    W.errs = errs.slice();
    R[w] = W;
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(out, JSON.stringify(R, null, 1));
  console.log('ok');
})().catch((e) => { console.error(e); process.exit(1); });
