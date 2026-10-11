const { chromium, CHROME, DIR, open } = require('./lib');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { ctx, p } = await open(browser, { w: 360, h: 740, dpr: 2, extraHead: '<style>body{margin:0}[hidden]{display:none!important}</style>' });
  await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
  await p.click('#zHum');
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll('.fp-row').forEach((row) => {
      const off = row.querySelector('.off, .chev'); if (!off) return;
      const o = off.getBoundingClientRect(); const tk = row.querySelector('.tk').getBoundingClientRect();
      row.querySelectorAll('.bar,.tick,.pill,.ring,.hz,.arr').forEach((m) => { const b = m.getBoundingClientRect(); if (b.width && b.right > o.left && b.left < o.right) out.push((row.querySelector('.nm') || {}).textContent.slice(0, 25) + ': ' + m.className + ' under "' + off.textContent + '"'); });
      if (o.left < tk.left - 0.5) out.push('off text past track start: ' + off.textContent);
    });
    const ax = Array.from(document.querySelectorAll('#fpAxis .tp b')).map((b) => b.textContent);
    return { out, ax };
  });
  console.log(JSON.stringify(r));
  await p.evaluate(() => document.querySelector('.forest').scrollIntoView({ block: 'start' }));
  await p.waitForTimeout(100);
  await p.screenshot({ path: path.join(DIR, 's-closeup-360.png') });
  await ctx.close(); await browser.close();
})();
