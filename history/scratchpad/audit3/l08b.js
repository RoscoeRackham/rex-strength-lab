const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const scheme of ['light','dark']) {
    const p = await b.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: scheme });
    await p.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await p.evaluate(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ logKg: 9, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 })); } catch (e) {} });
    await p.reload(); await p.waitForTimeout(5500);
    const r = await p.evaluate(() => {
      const bgOf = (el) => { while (el) { const c = getComputedStyle(el).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; el = el.parentElement; } return 'none'; };
      const out = {};
      const leader = document.querySelector('#ladder-viz g.mk path');
      if (leader) { const cs = getComputedStyle(leader); out.leader = { stroke: cs.stroke, op: cs.strokeOpacity, bg: bgOf(leader.parentElement) }; }
      const tracks = [...document.querySelectorAll('svg rect')].filter(r => r.getAttribute('fill') === 'var(--surface-2)');
      out.tracks = tracks.map(t => ({ fill: getComputedStyle(t).fill, stroke: getComputedStyle(t).stroke, bg: bgOf(t.closest('svg').parentElement) }));
      const warns = [...document.querySelectorAll('.status')].filter(s => s.innerHTML.includes('M8 1.5l7 13H1z'));
      out.warn = warns.map(w => ({ text: w.textContent, fill: getComputedStyle(w.querySelector('path')).fill, bg: bgOf(w) }));
      out.chips = [...document.querySelectorAll('.status')].map(s => s.textContent);
      return out;
    });
    console.log(scheme, JSON.stringify(r, null, 1));
    const w = await p.$(".status:has(path[d^=\"M8 1.5\"])"); if (w) await w.screenshot({ path: `l08b_warn_${scheme}.png`, scale: "device" });
    await p.close();
  }
  await b.close();
})();
