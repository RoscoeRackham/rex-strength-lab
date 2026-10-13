const L = require('./lib.js');
(async () => {
  for (const [w, h, scheme] of [[1280, 900, 'light'], [390, 844, 'dark'], [390, 844, 'light']]) {
    const { browser, page, errs } = await L.open({ w, h, scheme });
    await L.load(page, {});
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.waitForTimeout(200);
    const info = await page.evaluate(() => {
      const sl = document.getElementById('air-absorb');
      const lab = document.querySelector('label[for="air-absorb"]');
      const r = sl.getBoundingClientRect();
      const cs = (n) => { const s = getComputedStyle(n); return { color: s.color, bg: s.backgroundColor, fs: s.fontSize }; };
      // effective background: walk up
      const bgOf = (n) => { while (n) { const b = getComputedStyle(n).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') return b; n = n.parentElement; } return 'none'; };
      const read = document.getElementById('air-absorb-read'), big = document.getElementById('air-absorb-big');
      return { label: lab && lab.textContent, valuetext: sl.getAttribute('aria-valuetext'), describedby: sl.getAttribute('aria-describedby'), rect: [r.left, r.right, r.width], vw: document.documentElement.clientWidth, sw: document.documentElement.scrollWidth,
        read: read.textContent, readStyle: cs(read), readBg: bgOf(read), big: big.textContent, bigStyle: cs(big), sum: document.getElementById('powers-sum').textContent,
        over: Array.from(document.querySelectorAll('#powers *')).filter((n) => { const b = n.getBoundingClientRect(); return b.width && (b.right > document.documentElement.clientWidth + 0.5 || b.left < -0.5); }).map((n) => n.id || n.tagName + '.' + n.className).slice(0, 10),
        hints: Array.from(document.querySelectorAll('#powers .hint')).map((n) => ({ t: n.textContent.slice(0, 60), c: getComputedStyle(n).color, bg: bgOf(n) })),
        swLabels: ['sw-unbreakable','sw-recoil','sw-keep'].map((id) => { const i = document.getElementById(id); return { id, checked: i.checked, name: i.closest('label').textContent.slice(0, 40), aria: i.getAttribute('aria-label') }; }) };
    });
    console.log(w, scheme, JSON.stringify(info, null, 1));
    // slider values
    for (const v of [0, 30, 50, 100]) {
      await page.evaluate((v) => { const s = document.getElementById('air-absorb'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, v);
      await page.waitForTimeout(300);
      console.log(v, await page.evaluate(() => [document.getElementById('air-absorb-big').textContent, document.getElementById('air-absorb-read').textContent, document.getElementById('air-absorb').getAttribute('aria-valuetext'), document.getElementById('powers-sum').textContent].join(' | ')));
    }
    if (errs.length) console.log('ERRS', errs);
    await page.screenshot({ path: '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/copy/panel-' + w + '-' + scheme + '.png', fullPage: false });
    await browser.close();
  }
})();
