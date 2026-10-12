const H = require('./hc.js');
const tabs = (process.argv[2] || 'throw,jump,stomp,punch,clap,sprint,pull').split(',');
const surfaces = (process.argv[3] || 'concrete').split(',');
const strengths = (process.argv[4] || 'rec,def,hi,inf').split(',');
const presets = (process.argv[5] || 'least,ceiling,rattle,plaster,windows,ground,houses,block,allout').split(',');
const extra = process.argv[6] ? JSON.parse(process.argv[6]) : {};
const STR = { rec: { logKg: Math.log10(511), inf: false }, def: { logKg: Math.log10(100 * 907.18474), inf: false }, k10: { logKg: 7, inf: false }, hi: { logKg: 12, inf: false }, vhi: { logKg: 20, inf: false }, inf: { inf: true, logKg: 20 } };
(async () => {
  const p = await H.open();
  for (const s of strengths) for (const sf of surfaces) {
    await H.setState(p, Object.assign({ surface: sf }, STR[s], extra));
    for (const t of tabs) {
      await H.tab(p, t);
      for (const pr of presets) {
        await H.sel(p, '#effort', pr);
        const ok = await H.settle(p, 90000);
        const txt = await p.evaluate(() => {
          const b = document.getElementById('bay');
          b.querySelectorAll('details').forEach((d) => d.open = true);
          const v = b.querySelector('.verdict'); const sr = b.querySelector('.status-row'); const er = b.querySelector('.effort-read');
          const tl = [...b.querySelectorAll('.tile')].map((t) => t.innerText.replace(/\n/g, ' | ')).join(' ;; ');
          const callouts = [...b.querySelectorAll('.callout, .happens li')].map((x) => x.innerText).join(' // ');
          return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' · ') : '-') + '\nEFFORT: ' + (er ? er.innerText : '-') + '\nTILES: ' + tl + '\nNOTES: ' + callouts.slice(0, 1500);
        });
        console.log(`\n==== ${t} | ${sf} | ${s} | ${pr} ${ok ? '' : '(NOT SETTLED)'}\n${txt}`);
      }
    }
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
