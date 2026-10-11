const { open, close } = require('./h.js');
(async () => {
  const { page, ctx } = await open({ w: 1280, h: 900, state: {} });
  for (const val of ['1e309', '1e300', '1e-300', '0.1', '1e30', '5e-324']) {
    for (const lg of [1, 4.958, 34, 'inf']) {
      await page.evaluate(({ val, lg }) => {
        const m = document.querySelector('#mass'); m.value = val; m.dispatchEvent(new Event('change'));
        if (lg === 'inf') [...document.querySelectorAll('#tier-chips .chip')].find(c => c.textContent === '∞').click();
        else { const s = document.querySelector('#strength'); s.value = lg; s.dispatchEvent(new Event('input')); }
      }, { val, lg });
      const r = await page.evaluate(() => {
        const out = [];
        for (const tab of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
          document.querySelector('#tab-' + tab).click();
          const txt = document.querySelector('#bay').innerText + ' | ' + document.querySelector('#dial-force').textContent + ' | ' + document.querySelector('#setup-sum').textContent;
          for (const bad of ['NaN', 'undefined', 'Infinity', 'null', 'Calculation failed', '−∞']) if (txt.includes(bad)) { const i = txt.indexOf(bad); out.push(tab + ': ' + bad + ' "' + txt.slice(Math.max(0, i - 70), i + 30).replace(/\n/g, ' / ') + '"'); }
        }
        return { m: document.querySelector('#mass').value, out };
      });
      if (r.out.length) console.log('mass', val, 'lg', lg, '-> field', r.m, '\n   ' + r.out.slice(0, 6).join('\n   '));
    }
  }
  await ctx.close(); await close();
})();
