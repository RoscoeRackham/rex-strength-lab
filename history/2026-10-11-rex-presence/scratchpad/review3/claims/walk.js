const H = require('./hc.js');
const surfaces = (process.argv[2] || 'concrete,sand').split(',');
(async () => {
  const p = await H.open();
  for (const sf of surfaces) {
    for (const walker of ['rex', 'ollie', 'both']) {
      for (const pace of ['stroll', 'walk', 'fast']) {
        for (const d of [3, 30]) {
          await H.setState(p, { surface: sf, walker, pace, walkD: d });
          await H.tab(p, 'walk');
          for (const e of [0, 0.5, 1]) {
            if (walker !== 'rex' && pace !== 'walk' && e !== 0.5) continue;
            await p.evaluate((e) => { const s = document.getElementById('step-effort'); s.value = String(e); s.dispatchEvent(new Event('input', { bubbles: true })); }, e);
            await p.waitForTimeout(500);
            const t = await p.evaluate(() => {
              const b = document.getElementById('bay');
              b.querySelectorAll('details').forEach((d) => d.open = true);
              const v = b.querySelector('.verdict'), sr = b.querySelector('.status-row');
              const tl = [...b.querySelectorAll('.tile')].map((t) => t.innerText.replace(/\n/g, ' | ')).join(' ;; ');
              const li = [...b.querySelectorAll('.happens li')].map((x) => x.innerText).join('\n  ');
              const co = [...b.querySelectorAll('.callout')].map((x) => x.innerText).join(' // ');
              const lg = [...b.querySelectorAll('.ladder-legend span')].map((x) => x.innerText).join(' | ');
              return 'VERDICT: ' + (v ? v.innerText : '-') + '\nCHIPS: ' + (sr ? sr.innerText.replace(/\n/g, ' · ') : '-') + '\nTILES: ' + tl + '\nLEGEND: ' + lg + '\nLIST:\n  ' + li + '\nCALLOUT: ' + co;
            });
            console.log(`\n==== ${sf} | ${walker} | ${pace} | d=${d} | e=${e}\n${t}`);
          }
        }
      }
    }
  }
  console.log('ERRS', p.errs);
  await H.close();
})();
