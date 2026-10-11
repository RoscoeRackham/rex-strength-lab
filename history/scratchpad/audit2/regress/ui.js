// Usage: node ui.js '<json array of states>'   each state = localStorage 'rex-lab-v1' object (merged over defaults)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const PREVIEW = 'file://' + __dirname + '/preview.html';
(async () => {
  const states = JSON.parse(process.argv[2]);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of states) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
    await page.goto(PREVIEW);
    await page.waitForTimeout(st.wait || 400);
    const txt = await page.evaluate((withLadder) => {
      const bay = document.querySelector('#bay');
      const parts = [];
      parts.push('DIAL: ' + document.querySelector('#dial-big').textContent + ' | ' + document.querySelector('#dial-force').textContent + ' | ' + document.querySelector('#dial-who').textContent);
      for (const n of bay.querySelectorAll('.verdict, .status, .tile, .happens li, .callout, details.math .eq, .muted')) {
        if (n.classList.contains('tile')) parts.push('TILE: ' + [...n.children].map((c) => c.textContent).join(' / '));
        else if (n.classList.contains('status')) parts.push('CHIP: ' + n.textContent);
        else if (n.classList.contains('verdict')) parts.push('VERDICT: ' + n.textContent);
        else if (n.tagName === 'LI') parts.push('* ' + n.textContent);
        else if (n.classList.contains('eq')) parts.push('MATH: ' + n.textContent.replace(/\n/g, ' // '));
        else parts.push('NOTE: ' + n.textContent);
      }
      for (const t of bay.querySelectorAll('svg text')) parts.push('SVG: ' + t.textContent);
      if (withLadder) {
        for (const t of document.querySelectorAll('#ladder-viz svg .mk')) parts.push('LADDER: ' + t.getAttribute('aria-label'));
        parts.push('NEVER: ' + document.querySelector('#ladder-never').textContent);
      }
      return parts.join('\n');
    }, !!st.ladder);
    console.log('==== ' + JSON.stringify(st) + '\n' + txt + (errs.length ? '\nERRORS: ' + errs.join(' | ') : ''));
    await ctx.close();
  }
  await browser.close();
})();
