const L = require('./lib.js');
(async () => {
  const browser = await L.launch();
  for (const scheme of ['light', 'dark']) {
    const pg = await L.newPage(browser, { viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', colorScheme: scheme });
    await L.load(pg, { action: 'stomp', logKg: 9, duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: Math.log10(0.001 / Math.sqrt(1 - 1e-6)) });
    await L.setEffort(pg, 'bay', 'allout'); await L.settled(pg, 'duo-bay'); await L.setEffort(pg, 'duo-bay', 'allout');
    if (scheme === 'light') {
      const t = pg.locator('#bay .tile.shimmer'), o = pg.locator('#bay .tile:not(.shimmer)').first();
      console.log('SOLO tile aria:\n' + await t.ariaSnapshot() + '\nother tile aria:\n' + await o.ariaSnapshot());
      console.log('DUO tile aria:\n' + await pg.locator('#duo-bay .tile.shimmer').ariaSnapshot());
      const bayA = await pg.locator('#bay').ariaSnapshot();
      console.log('bay snapshot has Shimmer:', bayA.includes('Shimmer'), '| hero banner snapshot:', (await pg.locator('header.hero').ariaSnapshot()).slice(0, 300));
      const g = await pg.evaluate(() => [document.getElementById('hero-glow'), document.querySelector('#duo-bay .glow')].map((l) => ({ ariaHidden: l.getAttribute('aria-hidden'), pe: getComputedStyle(l).pointerEvents, peI: Array.from(l.children).every((i) => getComputedStyle(i).pointerEvents === 'none'), focusables: l.querySelectorAll('a,button,input,select,textarea,[tabindex]').length, tabindex: l.tabIndex, role: l.getAttribute('role'), nKids: l.children.length, text: l.textContent.length })));
      console.log('glow layers', JSON.stringify(g));
      // what a click on the eye hits
      const hit = await pg.evaluate(() => { const b = document.getElementById('hero-art').getBoundingClientRect(); const e = document.elementFromPoint(b.x + 0.421 * b.width, b.y + 0.192 * b.height); return e && e.tagName; });
      console.log('elementFromPoint over the header eye:', hit);
      // tab order: does Tab ever land in a glow layer?
      const cdp = await pg.context().newCDPSession(pg);
      const { nodes } = await cdp.send('Accessibility.getFullAXTree');
      const glowNodes = nodes.filter((n) => n.name && /glow/i.test(n.name.value || ''));
      console.log('AX nodes named glow:', glowNodes.length);
      const shim = nodes.filter((n) => n.name && /Shimmer/.test(n.name.value || '') && !n.ignored).map((n) => n.role.value + ':' + n.name.value.slice(0, 60));
      console.log('AX nodes named Shimmer (not ignored):', JSON.stringify(shim));
      await cdp.detach();
      // animations under reduce
      console.log('animations under reduce:', await pg.evaluate(() => document.getAnimations().map((a) => a.animationName || a.constructor.name)));
    }
    // contrast of the tile's text, solo, duo and the growth what-if box
    const lumi = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
    const cr = (a, b) => { const x = lumi(a), y = lumi(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const cols = await pg.evaluate(() => { const bgOf = (n) => { while (n) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; n = n.parentElement; } return 'rgb(255,255,255)'; };
      const t = document.querySelector('#duo-bay .tile.shimmer'); return ['.k', '.v', '.s'].map((s) => { const n = t.querySelector(s); return [s, getComputedStyle(n).color, bgOf(n), getComputedStyle(n).fontSize, getComputedStyle(n).fontWeight]; }); });
    for (const [s, c, b, fs, fw] of cols) console.log(scheme, 'duo tile', s, c, 'on', b, fs, fw, 'contrast', cr(c, b).toFixed(2));
    await pg.close();
    const pw = await L.newPage(browser, { viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', colorScheme: scheme });
    await L.load(pw, { action: 'weight' });
    await pw.click('#grow-what-krakatoa'); await pw.waitForSelector('#bay .growth-whatif .tile.shimmer');
    const cw = await pw.evaluate(() => { const bgOf = (n) => { while (n) { const c = getComputedStyle(n).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; n = n.parentElement; } return 'rgb(255,255,255)'; };
      const t = document.querySelector('#bay .growth-whatif .tile.shimmer'); return ['.k', '.v', '.s'].map((s) => { const n = t.querySelector(s); return [s, getComputedStyle(n).color, bgOf(n)]; }); });
    for (const [s, c, b] of cw) console.log(scheme, 'weight tile', s, c, 'on', b, 'contrast', cr(c, b).toFixed(2));
    console.log(scheme, 'weight tile text:', await pw.evaluate(() => document.querySelector('#bay .growth-whatif .tile.shimmer').textContent));
    await pw.close();
  }
  await browser.close();
})();
