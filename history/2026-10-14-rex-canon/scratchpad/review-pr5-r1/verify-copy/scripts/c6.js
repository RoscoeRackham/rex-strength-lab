const { open } = require('./h.js');
(async () => {
  const { browser, page, load } = await open(1280);
  await load({ action: 'throw' });
  const r = await page.evaluate(() => { const d = Array.from(document.querySelectorAll('#assume > div, #assume div')).find((n) => n.querySelector('b') && n.querySelector('b').textContent.startsWith('The shimmer')); const t = d.textContent.replace(/ /g, ' '); const i = t.indexOf('The level runs'); return t.slice(i, i + 900); });
  console.log(r);
  const g = await page.evaluate(() => { const L = window.EnergyLadder, D = window.DINO_DATA, sg = L.glow(1, D.energyRefs); const c = (J) => { const x = L.compare(J, D.energyRefs); return x.text + ' [ref ' + (x.ref && x.ref.key) + ' rough=' + !!(x.ref && x.ref.rough) + ']'; };
    const hi = 1.674e25, L0 = Math.log10(sg.flicker.J), sp = Math.log10(hi) - L0;
    return { steps: sg.steps.map((s) => s.word + ' ' + s.J.toExponential(2) + ' rough=' + s.rough + ' :: ' + c(s.J)), withHigh: [0.25, 0.5, 0.75].map((l) => l + ' -> ' + Math.pow(10, L0 + l * sp).toExponential(2)), ratio: [0.25, 0.5, 0.75].map((l) => (Math.pow(10, L0 + l * sp) / Math.pow(10, L0 + l * (Math.log10(sg.flare.J) - L0))).toFixed(2)) }; });
  console.log(JSON.stringify(g, null, 1));
  await browser.close();
})();
