const { open, close } = require('./h.js');
(async () => {
  const cases = ['{"action":"fly"}', '{"mode":"cartoon"}', '{"anchor":"glued"}', '{"H":1e6}', '{"logKg":null}', '{"logKg":"5"}', '{"inf":"true"}', '{"angle":45.5,"action":"throw"}', '{"angle":-5,"action":"throw"}', '{"obj":"sky","action":"throw"}', '{"obj":"earth","action":"pull"}', '{"surface":"__proto__"}', '{"__proto__":{"mode":"real"}}', '5', '"str"', '[1,2]', '{"m":1e-300}', '{"m":1e300}', '{"H":0.1,"m":1e30}', '{"H":500,"m":0.001}', '{"logKg":34.000000000001}', '{"logKg":0.9999999}', '{"H":0.1}', '{"m":0.1,"H":500,"action":"jump"}'];
  for (const c of cases) {
    const { page, ctx, errs } = await open({ w: 1280, h: 900, state: c });
    const r = await page.evaluate(() => {
      const t = (s) => document.querySelector(s) && document.querySelector(s).textContent;
      const sel = [...document.querySelectorAll('[role=tab]')].filter(x => x.getAttribute('aria-selected') === 'true').map(x => x.id);
      const all = [];
      for (const tab of ['lift', 'throw', 'jump', 'stomp', 'punch', 'clap', 'sprint', 'pull']) {
        document.querySelector('#tab-' + tab).click();
        const txt = document.querySelector('#bay').innerText + ' ' + [...document.querySelectorAll('#bay [aria-label]')].map(n => n.getAttribute('aria-label')).join(' ');
        for (const bad of ['NaN', 'undefined', 'Infinity', 'null', 'Calculation failed', '−∞']) if (txt.includes(bad)) { const i = txt.indexOf(bad); all.push(tab + ': ' + bad + ' "' + txt.slice(Math.max(0, i - 60), i + 30).replace(/\n/g, ' / ') + '"'); }
      }
      return { saved: localStorage.getItem('rex-lab-v1'), dial: t('#dial-big'), sum: t('#setup-sum'), sel, pressed: [...document.querySelectorAll('.seg button')].map(b => b.id + '=' + b.getAttribute('aria-pressed')).join(','), angleLbl: t('label[for=angle]'), bad: all };
    });
    console.log(c, '=>', JSON.stringify(r).slice(0, 900), errs.length ? 'ERRS ' + errs.slice(0, 2).join(' / ') : '');
    await ctx.close();
  }
  await close();
})();
