const { open, tab } = require('./lib');
(async () => {
  const { browser, page } = await open({ w: 1280, h: 900 });
  for (const [t, duo, sel, readSel] of [['throw', false, '#effort-use', '#bay .effort-read p'], ['walk', false, '#step-effort', '#bay .verdict'], ['stomp', false, '#effort-use', '#bay .effort-read p'], ['arm', true, '#duo-effort-use', '#bay .effort-read p']]) {
    await tab(page, t, duo, 2500);
    const res = await page.evaluate(({ sel, rs }) => new Promise((resolve) => {
      const s = document.querySelector(sel); const lo = Number(s.min), hi = Number(s.max);
      const read = () => { const e = document.querySelector(rs); return e ? e.innerText.slice(0, 50) : ''; };
      let last = read(); const changes = [];
      const mo = new MutationObserver(() => { const r = read(); if (r !== last) { changes.push([performance.now(), r]); last = r; } });
      mo.observe(document.querySelector('#bay'), { childList: true, subtree: true, characterData: true });
      let i = 0; const N = 60; const t0 = performance.now(); let tEnd;
      const tick = () => {
        const el = document.querySelector(sel);
        el.value = String(lo + (hi - lo) * (0.5 + 0.4 * Math.sin(i / N * Math.PI * 2)));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        i++;
        if (i < N) requestAnimationFrame(tick); else { tEnd = performance.now(); setTimeout(() => { mo.disconnect(); resolve({ dur: tEnd - t0, during: changes.filter((c) => c[0] <= tEnd).length, after: changes.filter((c) => c[0] > tEnd).length }); }, 800); }
      };
      requestAnimationFrame(tick);
    }), { sel, rs: readSel });
    console.log(t, JSON.stringify(res));
  }
  await browser.close();
})();
