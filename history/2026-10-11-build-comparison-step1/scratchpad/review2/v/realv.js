const { open, S } = require('./h.js');
(async () => {
  const { browser, p } = await open(1280, 900);
  await p.waitForTimeout(1000);
  await p.click('#hReal');
  await p.waitForTimeout(500);
  const o = await p.evaluate(() => ({ pressed: document.getElementById('hReal').getAttribute('aria-pressed'), verdict: document.querySelector('#lineup .verdict').textContent, sub: document.querySelector('#lineup .sub').textContent, mode: document.getElementById('modeNote').textContent,
    figs: Array.from(document.querySelectorAll('#lineup svg')).slice(0, 0).length }));
  console.log(JSON.stringify(o, null, 1));
  // figure heights: find figure cells with names
  const hs = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-id]').forEach((c) => { const g = c.querySelector('svg g'); if (!g) return; const b = g.getBoundingClientRect(); out.push(c.getAttribute('data-id') + ':' + Math.round(b.height)); });
    return out.filter((x) => /banner|ansur2_m_p50|hulk_savage|rex|ollie/.test(x));
  });
  console.log(hs.join(' '));
  await p.evaluate(() => document.getElementById('lineup').scrollIntoView());
  await p.screenshot({ path: S + '/real-verdict.png' });
  await browser.close();
})();
